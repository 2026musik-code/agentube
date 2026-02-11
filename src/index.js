import html from './html.js';

const API_KEY = "fdv_oO0fXjS-jBrhgaZ6WdC_5A";
const API_URL = "https://api.ferdev.my.id/search/youtube";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers for API
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (path === '/') {
      return new Response(html, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    if (path === '/auth' && request.method === 'POST') {
      try {
        const body = await request.json();
        const key = body.key;

        if (!key) return new Response('Missing key', { status: 400, headers: corsHeaders });

        // Check if key matches the hardcoded API Key or exists in R2
        let isValid = false;

        if (key === API_KEY || key === 'fdv_oO0fXjS-jBrhgaZ6WdC_5A') {
            isValid = true;
        } else {
            // Check R2
            // If env.vpsai is undefined (e.g. local dev without binding), this will throw.
            // We assume the binding exists as per plan.
            try {
                 const object = await env.vpsai.head(key);
                 if (object) isValid = true;
            } catch (err) {
                console.error("R2 Error:", err);
                // Fallback for testing/dev if R2 isn't actually bound in the test env
                // but in production it must work.
                return new Response(JSON.stringify({ success: false, error: "Server Configuration Error" }), { status: 500, headers: corsHeaders});
            }
        }

        if (isValid) {
          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        } else {
          return new Response(JSON.stringify({ success: false, error: "Invalid Key" }), {
            status: 401,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }
      } catch (e) {
        return new Response(e.message, { status: 500, headers: corsHeaders });
      }
    }

    if (path === '/api/search') {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response('Unauthorized', { status: 401, headers: corsHeaders });
      }

      const token = authHeader.split(' ')[1];

      // Validate Token
      let isValid = false;
      if (token === API_KEY || token === 'fdv_oO0fXjS-jBrhgaZ6WdC_5A') {
          isValid = true;
      } else {
          try {
            const object = await env.vpsai.head(token);
            if (object) isValid = true;
          } catch (err) {
             console.error("R2 Error in search:", err);
             return new Response('Server Error', { status: 500, headers: corsHeaders });
          }
      }

      if (!isValid) {
          return new Response('Invalid Token', { status: 401, headers: corsHeaders });
      }

      const query = url.searchParams.get('q');
      if (!query) {
        return new Response('Missing query', { status: 400, headers: corsHeaders });
      }

      try {
        const targetUrl = `${API_URL}?query=${encodeURIComponent(query)}&apikey=${API_KEY}`;

        const apiResp = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                // Mimic the exact headers that worked in CURL
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://google.com',
                'Accept': '*/*'
            }
        });

        if (!apiResp.ok) {
            const errorText = await apiResp.text();
            return new Response(JSON.stringify({
                success: false,
                error: `Upstream API Error: ${apiResp.status} ${apiResp.statusText} - ${errorText.substring(0, 100)}`
            }), {
                status: apiResp.status,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
        }

        let data;
        try {
            data = await apiResp.json();
        } catch (jsonErr) {
            const rawText = await apiResp.text();
            return new Response(JSON.stringify({
                success: false,
                error: `Invalid JSON from Upstream API: ${rawText.substring(0, 100)}`
            }), {
                status: 502,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
        }

        return new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      } catch (e) {
         return new Response(JSON.stringify({ success: false, error: `Worker Error: ${e.message}` }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
      }
    }

    return new Response('Not Found', { status: 404 });
  },
};
