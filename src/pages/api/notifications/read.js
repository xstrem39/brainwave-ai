import { requireAuth, getTokenFromRequest } from '../../../utils/security';
import { backendCall } from '../../../utils/backend';

export default requireAuth(async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  const token = getTokenFromRequest(req);
  const { notificationId } = req.body;
  try {
    const result = await backendCall('notification_markRead', token, { notificationId });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to mark notification' });
  }
});
