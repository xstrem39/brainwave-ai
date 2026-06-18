import { validateEmail } from '../../../utils/validators';

const backendCall = async (action, data) => {
  const url = process.env.GOOGLE_SCRIPT_URL;
  if (!url || url.includes('YOUR_DEPLOYED_SCRIPT_ID')) {
    throw new Error('GOOGLE_SCRIPT_URL is not configured. Please add it in your Vercel environment variables.');
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...data }),
  });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Apps Script returned an invalid response. Make sure it is deployed as a Web App.');
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { name, email, password, confirmPassword, role = 'student' } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email address' });
  }
  if (!password || password.length < 8) {
    return res.status(400).json({ success: false, error: 'Password must be at least 8 characters' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, error: 'Passwords do not match' });
  }

  const validRoles = ['student', 'teacher', 'lecturer', 'institution_admin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ success: false, error: 'Invalid role selected' });
  }

  try {
    const result = await backendCall('auth_register', {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
    });
    return res.status(result.success ? 201 : 400).json(result);
  } catch (err) {
    console.error('Register error:', err.message);
    return res.status(500).json({
      success: false,
      error: err.message || 'Registration failed. Please check your server configuration.',
    });
  }
}
