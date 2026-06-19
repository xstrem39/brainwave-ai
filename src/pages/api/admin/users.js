import { requireRole, getTokenFromRequest } from '../../../utils/security';
import { backendCall } from '../../../utils/backend';

export default requireRole(['admin', 'superadmin'])(async function handler(req, res) {
  const token = getTokenFromRequest(req);

  if (req.method === 'GET') {
    const { page = 1, search, role, status } = req.query;
    try {
      const result = await backendCall('admin_getUsers', token, { page: Number(page), filters: { search, role, status } });
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message || 'Failed to fetch users' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
});
