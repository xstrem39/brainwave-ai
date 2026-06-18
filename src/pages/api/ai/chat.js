import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { requireAuth, rateLimit, getTokenFromRequest } from '../../../utils/security';

const SYSTEM_PROMPT = `You are BrainWave AI, an expert academic assistant for students, teachers, lecturers, and researchers across all educational levels. You help with:
- Solving academic problems (math, physics, chemistry, economics, programming, etc.)
- Writing assistance (essays, research papers, thesis)
- Explanations of academic concepts
- Research guidance and citation generation
- Exam preparation and study tools
- Quiz generation and grading

Always provide accurate, well-structured, and educationally valuable responses. Use proper academic language. When solving problems, show all steps clearly. When referencing sources, use proper academic citation formats.`;

export default requireAuth(async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const ip = req.headers['x-forwarded-for'] || 'unknown';
  const limit = rateLimit(`ai_chat:${req.user.userId}:${ip}`, 50, 60000);
  if (!limit.allowed) return res.status(429).json({ success: false, error: 'Rate limit exceeded. Please slow down.' });

  const { message, model = 'claude', subject, level, conversationHistory = [] } = req.body;

  if (!message?.trim()) return res.status(400).json({ success: false, error: 'Message is required' });
  if (message.length > 10000) return res.status(400).json({ success: false, error: 'Message too long' });

  const contextualMessage = [
    subject && `[Subject: ${subject}]`,
    level && `[Academic Level: ${level}]`,
    message,
  ].filter(Boolean).join('\n');

  try {
    let content = '';

    if (model === 'claude') {
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const messages = [
        ...conversationHistory.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: contextualMessage },
      ];
      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages,
      });
      content = response.content[0].text;

    } else if (model === 'openai') {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...conversationHistory.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: contextualMessage },
      ];
      const response = await client.chat.completions.create({
        model: 'gpt-4o',
        messages,
        max_tokens: 4096,
      });
      content = response.choices[0].message.content;

    } else if (model === 'gemini') {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro', systemInstruction: SYSTEM_PROMPT });
      const history = conversationHistory.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));
      const chat = geminiModel.startChat({ history });
      const result = await chat.sendMessage(contextualMessage);
      content = result.response.text();
    } else {
      return res.status(400).json({ success: false, error: 'Invalid AI model specified' });
    }

    return res.status(200).json({ success: true, content, model });
  } catch (err) {
    console.error('AI chat error:', err);
    const errorMsg = err.status === 429 ? 'AI service rate limit reached. Please try again in a moment.' : 'AI request failed. Please try again.';
    return res.status(500).json({ success: false, error: errorMsg });
  }
});
