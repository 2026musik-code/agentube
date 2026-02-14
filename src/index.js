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
      // Inject the API key into the HTML
      // Use Regex to be robust against whitespace
      const injectedHtml = html.replace(
          /\/\*\s*INJECT_KEY_HERE\s*\*\//,
          `const UPSTREAM_KEY = "${API_KEY}";`
      );

      return new Response(injectedHtml, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    if (path === '/auth' && request.method === 'DELETE') {
      try {
        const body = await request.json();
        const key = body.key;
        if (!key) return new Response('Missing key', { status: 400, headers: corsHeaders });

        // Prevent deletion of master key
        if (key === API_KEY || key === 'fdv_oO0fXjS-jBrhgaZ6WdC_5A') {
             return new Response(JSON.stringify({ success: false, error: "Cannot delete Master Key" }), {
                 status: 403,
                 headers: { 'Content-Type': 'application/json', ...corsHeaders }
             });
        }

        try {
            await env.vpsai.delete(key);
        } catch (r2Err) {
            console.error("R2 Delete Error:", r2Err);
            // Don't fail the request if R2 fails, just log it, but user expects it deleted.
            // Actually, we should return error if we can't delete it.
            return new Response(JSON.stringify({ success: false, error: "Failed to delete from R2: " + r2Err.message }), { status: 500, headers: corsHeaders });
        }

        return new Response(JSON.stringify({ success: true, message: "Key deleted from R2" }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });

      } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500, headers: corsHeaders });
      }
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
            try {
                 const object = await env.vpsai.head(key);
                 if (object) isValid = true;
            } catch (err) {
                console.error("R2 Error:", err);
                return new Response(JSON.stringify({ success: false, error: "Server Configuration Error" }), { status: 500, headers: corsHeaders});
            }
        }

        if (isValid) {
          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        } else {
          // If key is not valid (not master, not in R2), create/register it as a new active session
          try {
             // Store the new key in R2 with a simple value 'active'
             await env.vpsai.put(key, 'active');

             return new Response(JSON.stringify({ success: true, message: "New Key Registered" }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
             });
          } catch (r2Err) {
             console.error("R2 Put Error:", r2Err);
             return new Response(JSON.stringify({ success: false, error: "Failed to register key: " + r2Err.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
             });
          }
        }
      } catch (e) {
        return new Response(e.message, { status: 500, headers: corsHeaders });
      }
    }

    // Server-side proxy endpoint (Legacy/Fallback, mostly unused now as client fetches directly)
    if (path === '/api/search') {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response('Unauthorized', { status: 401, headers: corsHeaders });
      }

      const token = authHeader.split(' ')[1];

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
