export default async function handler(req, res) {
  const url = process.env.GOOGLE_SCRIPT_URL;
  const checks = {
    GOOGLE_SCRIPT_URL: url ? 'SET ✅' : 'MISSING ❌',
    GOOGLE_SCRIPT_URL_value: url ? url.substring(0, 60) + '...' : 'not set',
    JWT_SECRET: process.env.JWT_SECRET ? 'SET ✅' : 'MISSING ❌',
    PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY ? 'SET ✅' : 'MISSING ❌',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'not set',
    NODE_ENV: process.env.NODE_ENV,
    appsScriptReachable: 'not tested',
    appsScriptResponse: null,
  };

  if (url) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'health' }),
      });
      const text = await response.text();
      try {
        const json = JSON.parse(text);
        checks.appsScriptReachable = 'YES ✅';
        checks.appsScriptResponse = json;
      } catch {
        checks.appsScriptReachable = 'REACHED BUT RETURNED INVALID JSON ❌';
        checks.appsScriptResponse = text.substring(0, 300);
      }
    } catch (e) {
      checks.appsScriptReachable = 'NO — NETWORK ERROR ❌';
      checks.appsScriptResponse = e.message;
    }
  } else {
    checks.appsScriptReachable = 'SKIPPED — URL not set ❌';
  }

  return res.status(200).json(checks);
}
