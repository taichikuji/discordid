const el = {
  img: document.getElementById("UrlImage"),
  uid: document.getElementById("UserId"),
  num: document.getElementById("NumberId"),
  add: document.getElementById("AddBtn"),
  btnTxt: document.getElementById("AccessBtn"),
  title: document.getElementById("DiscTitle"),
  sq: document.getElementById("Square")
};

let userId = null, userData = null, currentRequest = null;

function updateUI(data) {
  if (!data) return;
  
  if (el.img && data.id && data.avatar)
    el.img.style = `background-image:url(https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.webp);background-color:#5865F2`;
  
  const displayName = data.username || data.global_name || 'Unknown User';
  if (el.uid) el.uid.textContent = displayName;
  if (el.num) el.num.textContent = (data.discriminator && data.discriminator !== "0") ? `#${data.discriminator}` : "";
  if (el.btnTxt) el.btnTxt.textContent = `Add ${displayName}`;
  
  if (el.title) {
    const baseTitle = el.title.textContent.split('·')[0].trim();
    el.title.textContent = displayName ? `${baseTitle} · ${displayName}` : baseTitle;
  }
}

function displayError(msg) {
  console.error("Error:", msg);
  if (!el.sq) return alert(`Error: ${msg}`);
  
  el.sq.textContent = `Error: ${msg}`;
  el.sq.classList.add('error-state');
  
  if (msg.includes('@discordid/wiki')) {
    const span = document.createElement('span');
    span.textContent = ' Visit ';
    
    const link = document.createElement('a');
    link.textContent = '@discordid/wiki';
    link.href = 'https://github.com/taichikuji/discordid/wiki';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    span.appendChild(link);
    el.sq.appendChild(span);
  }
}

async function fetchUserData(id) {
  if (currentRequest) currentRequest.abort();
  
  const controller = new AbortController();
  currentRequest = controller;
  
  try {
    if (!id) throw new Error("No user ID provided");
    if (!/^\d+$/.test(id) || id.length < 17 || id.length > 20)
      throw new Error("Invalid Discord ID format");
      
    const timestamp = Number(BigInt(id) >> 22n) + 1420070400000;
    if (new Date(timestamp) < new Date('2015-01-01') || new Date(timestamp) > new Date())
      throw new Error("Invalid Discord ID timestamp");
    
    const res = await fetch(`./.netlify/functions/fetch?id=${id}`, {
      signal: controller.signal,
      headers: {Accept: 'application/json'}
    });
    
    if (!res.ok) {
      let errorJson;
      try { errorJson = await res.json(); } catch (_) { /* ignore json parse error */ }
      throw new Error(errorJson?.msg || res.statusText || `API Error: ${res.status}`);
    }
    
    const result = await res.json();
    if (!result?.msg) throw new Error("Invalid API response");
    
    userData = result.msg;
    updateUI(userData);
  } catch (err) {
    if (err.name !== 'AbortError')
      displayError(`Failed to load data for ID ${id} - (${err.message}) @discordid/wiki`);
  } finally {
    if (currentRequest === controller) currentRequest = null;
  }
}

const isMobile = () => navigator.userAgentData?.mobile || 
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || '');

async function handleAddClick() {
  if (!userId || !userData) return alert("User info missing. Please refresh.");

  const username = userData.username || userData.global_name || '';
  const fullUser = `${username}${(userData.discriminator && userData.discriminator !== "0") ? `#${userData.discriminator}` : ""}`;

  try {
    await navigator.clipboard.writeText(fullUser);
    if (el.btnTxt) {
      const origText = el.btnTxt.textContent;
      el.btnTxt.textContent = 'Copied!';
      setTimeout(() => el.btnTxt.textContent = origText, 1500);
    }
  } catch (err) {
    if (!isMobile()) console.error("Clipboard error:", err);
  }

  window.location.href = isMobile() 
    ? `https://discord.com/users/${userId}`
    : `discord://-/users/${userId}`;
    
  if (!isMobile()) {
    setTimeout(() => {
      if (document.hasFocus()) window.location.href = `https://discord.com/users/${userId}`;
    }, 500);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  userId = new URLSearchParams(window.location.search).get("id");
  userId ? fetchUserData(userId) : displayError("No user ID provided in URL");
  el.add?.addEventListener("click", handleAddClick);
});