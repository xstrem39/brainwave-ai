import api from './api';

export const userService = {
  async getProfile() {
    return api.get('/user/profile');
  },

  async updateProfile(data) {
    return api.put('/user/profile', data);
  },

  async updatePassword(oldPassword, newPassword) {
    return api.put('/user/password', { oldPassword, newPassword });
  },

  async getStats() {
    return api.get('/user/stats');
  },

  async getActivity() {
    return api.get('/user/activity');
  },

  async getCredits() {
    return api.get('/user/credits');
  },

  async getCreditHistory() {
    return api.get('/user/credit-history');
  },

  async getNotifications() {
    return api.get('/notifications');
  },

  async markNotificationRead(id) {
    return api.post('/notifications/read', { notificationId: id });
  },
};
