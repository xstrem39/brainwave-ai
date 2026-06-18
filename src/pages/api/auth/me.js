import { requireAuth } from '../../../utils/security';

const backendCall = async (action, token, data = {}) => {
  const url = process.env.GOOGLE_SCRIPT_URL;
  if (!url) throw new Error('Backend not configured');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, token, ...data }),
  });
  return res.json();
};

export default requireAuth(async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const { getTokenFromRequest } = await import('../../../utils/security');
  const token = getTokenFromRequest(req);

  try {
    const result = await backendCall('auth_me', token);
    return res.status(result.success ? 200 : 401).json(result);
  } catch (err) {
    console.error('Get user error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch user data' });
  }
});
