import { rateLimit } from '../../../utils/security';

const backendCall = async (action, data) => {
  const url = process.env.GOOGLE_SCRIPT_URL;
  if (!url) throw new Error('Backend not configured');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...data }),
  });
  return res.json();
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  const ip = req.headers['x-forwarded-for'] || 'unknown';
  const limit = rateLimit(`pwd_reset:${ip}`, 3, 3600000);
  if (!limit.allowed) return res.status(429).json({ success: false, error: 'Too many requests. Try again later.' });
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, error: 'Email required' });
  try {
    const result = await backendCall('auth_forgotPassword', { email });
    return res.status(200).json(result);
  } catch {
    return res.status(500).json({ success: false, error: 'Request failed' });
  }
}
