import { requireAuth, getTokenFromRequest } from '../../../utils/security';
import { backendCall } from '../../../utils/backend';

export default requireAuth(async function handler(req, res) {
  const token = getTokenFromRequest(req);

  if (req.method === 'GET') {
    try {
      const result = await backendCall('user_getProfile', token);
      return res.status(result.success ? 200 : 404).json(result);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message || 'Failed to fetch profile' });
    }
  }

  if (req.method === 'PUT') {
    const { name, avatar, language } = req.body;
    try {
      const result = await backendCall('user_updateProfile', token, { name, avatar, language });
      return res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message || 'Failed to update profile' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
});
