import { requireAuth } from '../../../utils/security';
import { backendCall } from '../../../utils/backend';

export default requireAuth(async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const { getTokenFromRequest } = await import('../../../utils/security');
  const token = getTokenFromRequest(req);

  try {
    const result = await backendCall('auth_me', token);
    return res.status(result.success ? 200 : 401).json(result);
  } catch (err) {
    console.error('Get user error:', err.message);
    return res.status(500).json({ success: false, error: err.message || 'Failed to fetch user data' });
  }
});
