const WEBHOOK_URL = "https://workflows.thehiretalent.io/webhook-test/50d54b65-3faf-45fb-a0fe-1982089861f9";

// Simple in-memory rate limiting (resets on worker restart)
// For production, use Cloudflare KV or Durable Objects
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute per IP

function isRateLimited(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { timestamp: now, count: 1 });
    return false;
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }
  
  record.count++;
  return false;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 100;
}

function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, 100).replace(/<[^>]*>/g, '');
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let path = url.pathname;
    
    // Remove the /ifa2026 prefix
    if (path.startsWith('/ifa2026')) {
      path = path.slice('/ifa2026'.length) || '/';
    }
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    
    // Handle API registration endpoint
    if (path === '/api/register' && request.method === 'POST') {
      const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
      
      // Rate limiting
      if (isRateLimited(clientIP)) {
        return new Response(
          JSON.stringify({ error: 'Too many requests. Please wait a moment.' }),
          { 
            status: 429, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }
      
      try {
        const body = await request.json();
        
        // Validate required fields
        if (!body.firstName || !body.lastName || !body.email) {
          return new Response(
            JSON.stringify({ error: 'All fields are required' }),
            { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
        }
        
        // Validate email
        if (!validateEmail(body.email)) {
          return new Response(
            JSON.stringify({ error: 'Invalid email address' }),
            { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
        }
        
        // Sanitize inputs
        const sanitizedData = {
          firstName: sanitizeString(body.firstName),
          lastName: sanitizeString(body.lastName),
          email: body.email.trim().toLowerCase().slice(0, 100),
          source: 'ifa2026-raffle',
          submittedAt: new Date().toISOString(),
          clientIP: clientIP,
        };
        
        // Forward to webhook
        let webhookResponse;
        try {
          webhookResponse = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(sanitizedData),
          });
        } catch (fetchError) {
          console.error('Fetch error:', fetchError.message);
          return new Response(
            JSON.stringify({ error: 'Network error. Please try again.', details: fetchError.message }),
            { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
        }
        
        // Accept 200-299 status codes as success
        if (webhookResponse.status >= 200 && webhookResponse.status < 300) {
          return new Response(
            JSON.stringify({ success: true }),
            { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
        } else {
          const webhookError = await webhookResponse.text();
          console.error('Webhook error:', webhookResponse.status, webhookError);
          return new Response(
            JSON.stringify({ error: 'Registration failed. Please try again.', status: webhookResponse.status }),
            { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
        }
      } catch (e) {
        console.error('Error processing registration:', e.message);
        return new Response(
          JSON.stringify({ error: 'Invalid request', details: e.message }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    }
    
    // Default to index.html for root or non-asset paths (SPA routing)
    if (path === '/' || (!path.includes('.') && !path.startsWith('/assets'))) {
      path = '/index.html';
    }
    
    // Build GCS URL
    const gcsUrl = `https://storage.googleapis.com/${env.GCS_BUCKET}${path}`;
    
    try {
      const response = await fetch(gcsUrl, {
        headers: {
          'Accept': request.headers.get('Accept') || '*/*',
        },
      });
      
      if (response.ok) {
        // Clone response and add correct content-type headers
        const headers = new Headers(response.headers);
        
        // Set correct content types
        if (path.endsWith('.js')) {
          headers.set('Content-Type', 'application/javascript');
        } else if (path.endsWith('.css')) {
          headers.set('Content-Type', 'text/css');
        } else if (path.endsWith('.html')) {
          headers.set('Content-Type', 'text/html');
        } else if (path.endsWith('.png')) {
          headers.set('Content-Type', 'image/png');
        }
        
        // Add caching headers
        if (path.startsWith('/assets/')) {
          headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        }
        
        return new Response(response.body, {
          status: response.status,
          headers,
        });
      }
      
      // If asset not found, try index.html for SPA routing
      if (response.status === 404 && !path.startsWith('/assets/')) {
        const indexUrl = `https://storage.googleapis.com/${env.GCS_BUCKET}/index.html`;
        const indexResponse = await fetch(indexUrl);
        if (indexResponse.ok) {
          return new Response(indexResponse.body, {
            status: 200,
            headers: {
              'Content-Type': 'text/html',
            },
          });
        }
      }
      
      return new Response('Not found', { status: 404 });
    } catch (e) {
      return new Response(`Error: ${e.message}`, { status: 500 });
    }
  },
};
