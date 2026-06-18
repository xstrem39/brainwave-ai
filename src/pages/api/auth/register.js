import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { generateToken } from '../../../utils/security';
import { validateEmail, validatePassword } from '../../../utils/validators';
import nodemailer from 'nodemailer';

const backendCall = async (action, data) => {
  const url = process.env.GOOGLE_SCRIPT_URL;
  if (!url) throw new Error('Backend URL not configured');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...data }),
  });
  return res.json();
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const { name, email, password, confirmPassword, role = 'student' } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email address' });
  }
  const pwdCheck = validatePassword(password);
  if (!pwdCheck.valid) {
    return res.status(400).json({ success: false, error: pwdCheck.errors[0] });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, error: 'Passwords do not match' });
  }

  const validRoles = ['student', 'teacher', 'lecturer', 'institution_admin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ success: false, error: 'Invalid role' });
  }

  try {
    const result = await backendCall('auth_register', { name: name.trim(), email: email.toLowerCase(), password, role });
    return res.status(result.success ? 201 : 400).json(result);
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, error: 'Registration failed. Please try again.' });
  }
}
