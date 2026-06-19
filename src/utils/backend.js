export const backendCall = async (action, token = null, data = {}) => {
  const url = process.env.GOOGLE_SCRIPT_URL;
  if (!url || url.includes('YOUR_DEPLOYED_SCRIPT_ID')) {
    throw new Error('GOOGLE_SCRIPT_URL is not configured. Add it in Vercel → Settings → Environment Variables.');
  }
  const body = { action, ...data };
  if (token) body.token = token;

  const res = await fetch(url, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Apps Script returned an invalid response. Make sure it is deployed as a Web App with access set to "Anyone". Response: ${text.substring(0, 300)}`);
  }
};
