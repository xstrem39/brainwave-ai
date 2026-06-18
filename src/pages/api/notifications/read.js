import { requireAuth, getTokenFromRequest } from '../../../utils/security';

const backendCall = async (action, token, data) => {
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
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  const token = getTokenFromRequest(req);
  const { notificationId } = req.body;
  try {
    const result = await backendCall('notification_markRead', token, { notificationId });
    return res.status(200).json(result);
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to mark notification' });
  }
});
