import { validateEmail } from '../../../utils/validators';
import { backendCall } from '../../../utils/backend';

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
    const result = await backendCall('auth_register', null, {
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
