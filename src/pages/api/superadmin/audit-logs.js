import { requireRole, getTokenFromRequest } from '../../../utils/security';
import { backendCall } from '../../../utils/backend';

export default requireRole(['superadmin'])(async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed' });
  const token = getTokenFromRequest(req);
  const { page = 1, startDate, endDate } = req.query;
  try {
    const result = await backendCall('superadmin_getAuditLogs', token, { filters: { page: Number(page), startDate, endDate } });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to fetch audit logs' });
  }
});
