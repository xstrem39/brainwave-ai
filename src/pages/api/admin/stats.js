import { requireRole, getTokenFromRequest } from '../../../utils/security';
import { backendCall } from '../../../utils/backend';

export default requireRole(['admin', 'superadmin'])(async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed' });
  const token = getTokenFromRequest(req);
  try {
    const result = await backendCall('admin_getDashboard', token);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to fetch stats' });
  }
});
