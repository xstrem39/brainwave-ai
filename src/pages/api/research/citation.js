import { requireAuth } from '../../../utils/security';
import Anthropic from '@anthropic-ai/sdk';

export default requireAuth(async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const { source, format = 'APA' } = req.body;
  if (!source) return res.status(400).json({ success: false, error: 'Source information required' });

  const validFormats = ['APA', 'MLA', 'Harvard', 'Chicago', 'IEEE', 'Vancouver'];
  if (!validFormats.includes(format)) return res.status(400).json({ success: false, error: 'Invalid citation format' });

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      messages: [{
        role: 'user',
        content: `Generate a properly formatted ${format} citation for:\n\n${source}\n\nProvide both the reference list entry and in-text citation format. Be precise with punctuation, italics indicators, and capitalization per ${format} guidelines.`,
      }],
    });
    return res.status(200).json({ success: true, citation: response.content[0].text, format });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Citation generation failed' });
  }
});
