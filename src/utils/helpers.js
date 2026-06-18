export const formatCurrency = (amount, currency = 'GHS') => {
  return `${currency} ${parseFloat(amount || 0).toFixed(2)}`;
};

export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  const defaultOptions = { year: 'numeric', month: 'long', day: 'numeric', ...options };
  return new Date(dateString).toLocaleDateString('en-GH', defaultOptions);
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const diff = Date.now() - new Date(dateString).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateString);
};

export const truncate = (str, maxLength = 100) => {
  if (!str) return '';
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
};

export const getInitials = (name = '') => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const capitalizeFirst = (str = '') => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const slugify = (text) => {
  return text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
};

export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return true;
  }
};

export const downloadFile = (content, filename, type = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const isSubscriptionActive = (subscription) => {
  if (!subscription) return false;
  if (subscription.status !== 'active') return false;
  return new Date(subscription.endDate) > new Date();
};

export const getDaysRemaining = (endDate) => {
  if (!endDate) return 0;
  const diff = new Date(endDate) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

export const gradeFromPercentage = (pct) => {
  if (pct >= 80) return { grade: 'A', color: 'text-emerald-400', label: 'Excellent' };
  if (pct >= 70) return { grade: 'B', color: 'text-blue-400', label: 'Good' };
  if (pct >= 60) return { grade: 'C', color: 'text-yellow-400', label: 'Average' };
  if (pct >= 50) return { grade: 'D', color: 'text-orange-400', label: 'Below Average' };
  return { grade: 'F', color: 'text-red-400', label: 'Fail' };
};

export const parseMarkdown = (text) => {
  if (!text) return '';
  return text;
};

export const sanitizeInput = (input) => {
  return String(input || '').replace(/[<>'"]/g, '');
};

export const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

export const getAvatarColor = (name = '') => {
  const colors = ['#4F46E5', '#7C3AED', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};
