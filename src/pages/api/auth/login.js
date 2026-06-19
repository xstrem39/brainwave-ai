import { rateLimit } from '../../../utils/security';
import { backendCall } from '../../../utils/backend';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const limit = rateLimit(`login:${ip}`, 10, 900000);
  if (!limit.allowed) {
    return res.status(429).json({
      success: false,
      error: 'Too many login attempts. Please wait 15 minutes and try again.',
    });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }

  try {
    const result = await backendCall('auth_login', null, {
      email: email.toLowerCase().trim(),
      password,
    });

    if (result.success && result.token) {
      res.setHeader('Set-Cookie', [
        `brainwave_token=${result.token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
      ]);
    }

    return res.status(result.success ? 200 : 401).json(result);
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({
      success: false,
      error: err.message || 'Login failed. Please check your server configuration.',
    });
  }
}
