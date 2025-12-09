import Anthropic from '@anthropic-ai/sdk';
import { getMikeSystemPrompt } from '@/lib/prompts';
import { CoachingMode } from '@/lib/types';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Send notification email when rate limit is hit
async function notifyRateLimit(errorDetails: string) {
  const notificationEmail = process.env.NOTIFICATION_EMAIL;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!notificationEmail || !resendApiKey) {
    console.warn('Rate limit hit but notification not configured (missing NOTIFICATION_EMAIL or RESEND_API_KEY)');
    return;
  }

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Mike App <noreply@resend.dev>',
        to: notificationEmail,
        subject: '⚠️ Mike App: API Rate Limit Reached',
        html: `
          <h2>Rate Limit Alert</h2>
          <p>The Mike coaching app has hit the Anthropic API rate limit.</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          <p><strong>Details:</strong> ${errorDetails}</p>
          <p>Users will see a friendly message asking them to wait. Consider upgrading your API tier if this happens frequently.</p>
        `,
      }),
    });
    console.log('Rate limit notification sent to', notificationEmail);
  } catch (emailError) {
    console.error('Failed to send rate limit notification:', emailError);
  }
}

// Error types for user-friendly messages
type ErrorType = 'rate_limit' | 'quota_exceeded' | 'overloaded' | 'auth' | 'unknown';

function classifyError(error: unknown): { type: ErrorType; details: string } {
  if (error instanceof Anthropic.RateLimitError) {
    // Check if it's a quota/spend limit vs rate limit
    const message = error.message?.toLowerCase() || '';
    if (message.includes('quota') || message.includes('limit') || message.includes('exceeded') || message.includes('billing')) {
      return { type: 'quota_exceeded', details: error.message };
    }
    return { type: 'rate_limit', details: error.message };
  }
  if (error instanceof Anthropic.APIError) {
    if (error.status === 429) {
      // Check the error message for quota-related keywords
      const message = error.message?.toLowerCase() || '';
      if (message.includes('quota') || message.includes('limit exceeded') || message.includes('billing') || message.includes('spend')) {
        return { type: 'quota_exceeded', details: error.message };
      }
      return { type: 'rate_limit', details: error.message };
    }
    if (error.status === 529 || error.message?.includes('overloaded')) {
      return { type: 'overloaded', details: error.message };
    }
    if (error.status === 401) {
      return { type: 'auth', details: error.message };
    }
  }
  return { type: 'unknown', details: error instanceof Error ? error.message : 'Unknown error' };
}

export async function POST(request: NextRequest) {
  try {
    // Parse request
    const body = await request.json();
    const { messages, mode = 'standard', language = 'en' } = body;

    // Basic validation
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: messages required', errorType: 'validation' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'API key not configured', errorType: 'config' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Call Claude API with streaming
    const stream = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: getMikeSystemPrompt(mode as CoachingMode, language as any),
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      stream: true,
    });

    // Create streaming response
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              const text = event.delta.text;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);

    const { type, details } = classifyError(error);

    // Send notification for rate limits
    if (type === 'rate_limit' || type === 'overloaded') {
      notifyRateLimit(details);
    }

    return new Response(
      JSON.stringify({
        error: details,
        errorType: type,
      }),
      { status: type === 'rate_limit' ? 429 : 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
