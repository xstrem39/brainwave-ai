import { requireAuth, getTokenFromRequest } from '../../../utils/security';
import { backendCall } from '../../../utils/backend';

export default requireAuth(async function handler(req, res) {
  const token = getTokenFromRequest(req);

  if (req.method === 'GET') {
    try {
      const result = await backendCall('notification_getAll', token);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message || 'Failed to fetch notifications' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
});
