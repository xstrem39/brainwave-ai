import { requireAuth, getTokenFromRequest } from '../../../utils/security';

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
  const token = getTokenFromRequest(req);

  if (req.method === 'GET') {
    try {
      const result = await backendCall('notification_getAll', token);
      return res.status(200).json(result);
    } catch {
      return res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
});
