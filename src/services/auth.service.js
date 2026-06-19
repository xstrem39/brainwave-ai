import { callAppsScript, getToken, setToken, removeToken, isLoggedIn } from '../utils/appsScript';

export const authService = {
  async register(data) {
    return callAppsScript('auth_register', null, {
      name: data.name?.trim(),
      email: data.email?.toLowerCase().trim(),
      password: data.password,
      role: data.role || 'student',
    });
  },

  async login(email, password) {
    const result = await callAppsScript('auth_login', null, {
      email: email.toLowerCase().trim(),
      password,
    });
    if (result.success && result.token) {
      setToken(result.token);
    }
    return result;
  },

  async googleLogin(googleData) {
    const result = await callAppsScript('auth_googleAuth', null, { userData: googleData });
    if (result.success && result.token) {
      setToken(result.token);
    }
    return result;
  },

  async logout() {
    removeToken();
    return { success: true };
  },

  async getMe() {
    const token = getToken();
    if (!token) return { success: false, error: 'Not logged in' };
    return callAppsScript('auth_me', token);
  },

  async verifyEmail(token) {
    return callAppsScript('auth_verifyEmail', null, { token });
  },

  async forgotPassword(email) {
    return callAppsScript('auth_forgotPassword', null, { email });
  },

  async resetPassword(token, newPassword) {
    return callAppsScript('auth_resetPassword', null, { token, newPassword });
  },

  getToken,
  isLoggedIn,
};
