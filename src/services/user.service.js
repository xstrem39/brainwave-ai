import { callAppsScript, getToken } from '../utils/appsScript';

export const userService = {
  async getProfile() {
    return callAppsScript('user_getProfile', getToken());
  },

  async updateProfile(data) {
    return callAppsScript('user_updateProfile', getToken(), data);
  },

  async updatePassword(oldPassword, newPassword) {
    return callAppsScript('user_updatePassword', getToken(), { oldPassword, newPassword });
  },

  async getStats() {
    return callAppsScript('user_getStats', getToken());
  },

  async getActivity() {
    return callAppsScript('user_getActivity', getToken());
  },

  async getCredits() {
    return callAppsScript('credit_getBalance', getToken());
  },

  async getCreditHistory() {
    return callAppsScript('credit_getHistory', getToken());
  },

  async getNotifications() {
    return callAppsScript('notification_getAll', getToken());
  },

  async markNotificationRead(id) {
    return callAppsScript('notification_markRead', getToken(), { notificationId: id });
  },
};
