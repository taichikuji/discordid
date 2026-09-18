const RATE_LIMIT = 20;
const WINDOW_MS = 60_000;
const requestLog = new Map();

const isRateLimited = ip => {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter(t => now - t < WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT;
};

export default async req => {
  const ip = req.headers.get('x-nf-client-connection-ip') || 'unknown';
  if (isRateLimited(ip))
    return new Response(JSON.stringify({ 
      msg: "Too many requests, please try again later" 
    }), { status: 429, headers: { 'Content-Type': 'application/json' } });

  const userId = new URL(req.url).searchParams.get('id');
  
  if (!userId || !/^\d{17,20}$/.test(userId)) 
    return new Response(JSON.stringify({ 
      msg: userId ? "Invalid user ID format" : "Missing required 'id' parameter" 
    }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  
  try {
    const res = await fetch(`https://discord.com/api/v10/users/${userId}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bot ${process.env.DISCORD_API_KEY}`,
        'User-Agent': 'DiscordID/2.0.1 (https://github.com/taichikuji/discordid)'
      }
    });

    if (!res.ok) 
      return new Response(JSON.stringify({ 
        msg: res.statusText || `API returned ${res.status}` 
      }), { status: res.status, headers: { 'Content-Type': 'application/json' } });
    
    const { id, username, discriminator, avatar, global_name } = await res.json();
    
    return new Response(JSON.stringify({ 
      msg: { id, username, discriminator, avatar, global_name } 
    }), { 
      status: 200, 
      headers: { 
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'Netlify-CDN-Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800, durable',
        'Content-Type': 'application/json' 
      }
    });
  } catch (err) {
    console.error("Discord API Error:", err);
    return new Response(JSON.stringify({ 
      msg: "Internal server error occurred while fetching user data" 
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
