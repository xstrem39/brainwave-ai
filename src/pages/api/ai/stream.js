import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { verifyToken, getTokenFromRequest, rateLimit } from '../../../utils/security';

const SYSTEM_PROMPT = `You are BrainWave AI, an expert academic assistant for students, teachers, lecturers, and researchers. Provide accurate, well-structured, educational responses. Show all steps when solving problems. Use proper academic language.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = getTokenFromRequest(req);
  const user = token ? verifyToken(token) : null;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const limit = rateLimit(`stream:${user.userId}`, 30, 60000);
  if (!limit.allowed) return res.status(429).json({ error: 'Rate limit exceeded' });

  const { message, model = 'claude', subject, level, conversationHistory = [] } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: 'Message required' });

  const contextualMessage = [subject && `[Subject: ${subject}]`, level && `[Level: ${level}]`, message].filter(Boolean).join('\n');

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  try {
    if (model === 'claude') {
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const messages = [
        ...conversationHistory.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: contextualMessage },
      ];
      const stream = await client.messages.stream({ model: 'claude-sonnet-4-6', max_tokens: 4096, system: SYSTEM_PROMPT, messages });
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta?.type === 'text_delta') {
          send({ content: chunk.delta.text });
        }
      }
    } else if (model === 'openai') {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...conversationHistory.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: contextualMessage },
      ];
      const stream = await client.chat.completions.create({ model: 'gpt-4o', messages, stream: true });
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) send({ content: delta });
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('Stream error:', err);
    send({ error: 'Stream failed' });
    res.end();
  }
}

export const config = { api: { responseLimit: false } };
