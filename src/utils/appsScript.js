// Direct browser → Google Apps Script caller.
// No server needed — works on GitHub Pages, Netlify, any static host.

const getScriptUrl = () => {
  if (typeof window !== 'undefined' && window.__BRAINWAVE_SCRIPT_URL__) {
    return window.__BRAINWAVE_SCRIPT_URL__;
  }
  return process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || '';
};

export const callAppsScript = async (action, token = null, data = {}) => {
  const url = getScriptUrl();

  if (!url) {
    throw new Error(
      'Google Apps Script URL is not configured. ' +
      'Set NEXT_PUBLIC_GOOGLE_SCRIPT_URL in your environment or GitHub Secrets.'
    );
  }

  const body = { action, ...data };
  if (token) body.token = token;

  const response = await fetch(url, {
    method: 'POST',
    redirect: 'follow',
    // text/plain avoids CORS preflight — Apps Script reads body via e.postData.contents
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `Apps Script returned an invalid response. ` +
      `Make sure it is deployed as a Web App with access set to "Anyone". ` +
      `Response: ${text.substring(0, 300)}`
    );
  }
};

// Token helpers — stored in localStorage (no server required)
export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('brainwave_token');
};

export const setToken = (token) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('brainwave_token', token);
};

export const removeToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('brainwave_token');
};

export const isLoggedIn = () => !!getToken();
