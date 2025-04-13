import fetch from 'node-fetch';

export default async req => {
  const userId = new URL(req.url).searchParams.get('id');
  
  if (!userId || !/^\d+$/.test(userId)) 
    return new Response(JSON.stringify({ 
      msg: userId ? "Invalid user ID format" : "Missing required 'id' parameter" 
    }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  
  try {
    const res = await fetch(`https://discordapp.com/api/users/${userId}`, {
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
        'Cache-Control': 'public, max-age=3600', 
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