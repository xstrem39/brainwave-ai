import { requireRole, getTokenFromRequest } from '../../../utils/security';

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

export default requireRole(['admin', 'superadmin'])(async function handler(req, res) {
  const token = getTokenFromRequest(req);

  if (req.method === 'GET') {
    const { page = 1, search, role, status } = req.query;
    try {
      const result = await backendCall('admin_getUsers', token, { page: Number(page), filters: { search, role, status } });
      return res.status(200).json(result);
    } catch {
      return res.status(500).json({ success: false, error: 'Failed to fetch users' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
});
