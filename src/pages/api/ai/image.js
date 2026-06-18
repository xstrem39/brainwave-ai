import OpenAI from 'openai';
import { requireAuth, rateLimit } from '../../../utils/security';

export default requireAuth(async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const limit = rateLimit(`image:${req.user.userId}`, 20, 3600000);
  if (!limit.allowed) return res.status(429).json({ success: false, error: 'Image generation limit reached. Please try again later.' });

  const { prompt, type = 'realistic', size = '1024x1024', quality = 'hd', style = 'vivid' } = req.body;

  if (!prompt?.trim()) return res.status(400).json({ success: false, error: 'Image prompt is required' });
  if (prompt.length > 4000) return res.status(400).json({ success: false, error: 'Prompt too long' });

  const typePrompts = {
    realistic: 'ultra-realistic, photographic quality, 4K resolution, professional photography',
    diagram: 'clean educational diagram, academic illustration, clear labels, white background',
    chart: 'professional data visualization, clean educational chart, clear typography',
    infographic: 'professional infographic design, modern layout, colorful, informative',
    logo: 'professional logo design, clean, modern, vector style, minimal',
    poster: 'professional poster design, eye-catching, modern typography, high quality print ready',
    certificate: 'professional certificate design, elegant, formal, decorative border',
    banner: 'professional banner design, wide format, modern design, high impact',
    business_card: 'professional business card design, clean, modern, print ready',
    book_cover: 'professional book cover design, compelling, high quality, print ready',
  };

  const enhancedPrompt = `${prompt}. Style: ${typePrompts[type] || typePrompts.realistic}. No watermarks, no text unless specified.`;

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.images.generate({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      n: 1,
      size: size,
      quality: quality,
      style: style,
    });

    const imageUrl = response.data[0].url;
    const revisedPrompt = response.data[0].revised_prompt;

    return res.status(200).json({
      success: true,
      url: imageUrl,
      revisedPrompt,
      creditsUsed: 10,
    });
  } catch (err) {
    console.error('Image generation error:', err);
    if (err.code === 'content_policy_violation') {
      return res.status(400).json({ success: false, error: 'Your prompt violates content policy. Please modify and try again.' });
    }
    return res.status(500).json({ success: false, error: 'Image generation failed. Please try again.' });
  }
});
