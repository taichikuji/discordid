const el = {
    img: document.getElementById("UrlImage"),
    uid: document.getElementById("UserId"),
    num: document.getElementById("NumberId"),
    add: document.getElementById("AddBtn"),
    btnTxt: document.getElementById("AccessBtn"),
    title: document.getElementById("DiscTitle"),
    sq: document.getElementById("Square"),
};

let userId = null;
let userData = null;

function updateUI(data) {
    if (!data) return;
    if (el.img) {
        el.img.style.backgroundImage = `url(https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.webp)`;
        el.img.style.backgroundColor = '#5865F2';
    }
    if (el.uid) el.uid.textContent = data.username || 'Unknown User';
    if (el.num) {
        const d = data.discriminator;
        el.num.textContent = (d && d !== "0") ? `#${d}` : "";
    }
    if (el.btnTxt) el.btnTxt.textContent = `Add ${data.username || 'User'}`;
    if (el.title) el.title.textContent = el.title.textContent.split('·')[0] + (data.username ? ` · ${data.username}` : '');
}

function displayError(msg) {
    console.error("Error:", msg);
    if (el.sq) {
        el.sq.innerHTML = `Error: ${msg}`;
        el.sq.classList.add('error-state');
    } else {
        alert(`Error: ${msg}`);
    }
}

async function fetchUserData(userId) {
    try {
        const apiURL = `./.netlify/functions/fetch?id=${encodeURIComponent(userId)}`;
        const response = await fetch(apiURL);
        if (!response.ok) {
            let errMsg = `API Error: ${response.status}`;
            try { errMsg = (await response.json()).msg || errMsg; } catch (_) {}
            throw new Error(errMsg);
        }
        const result = await response.json();
        if (!result || !result.msg) throw new Error("Invalid API response structure.");
        userData = result.msg;
        updateUI(userData);
    } catch (error) {
        displayError(`Failed to load data for ID ${userId} - (${error.message})<br/>Visit <a href="https://github.com/taichikuji/discordid/wiki" target="_blank" rel="noopener noreferrer">@discordid/wiki</a>`);
    }
}

function isMobile() {
    if (navigator.userAgentData) {
        return navigator.userAgentData.mobile;
    }
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

async function handleAddClick() {
    if (!userId || !userData) {
        console.error("Missing ID or data for redirect.");
        alert("User info missing. Please refresh.");
        return;
    }

    const username = userData.username || '';
    const discrim = userData.discriminator;
    const fullUser = `${username}${(discrim && discrim !== "0") ? `#${discrim}` : ""}`;

    try {
        await navigator.clipboard.writeText(fullUser);
        const originalButtonText = el.btnTxt.textContent;
        el.btnTxt.textContent = 'Copied!';
        setTimeout(() => {
            el.btnTxt.textContent = originalButtonText;
        }, 1500);
    } catch (err) {
        console.error("Failed to copy text: ", err);
        alert("Could not copy username to clipboard.");
    }

    const webUrl = `https://discord.com/users/${userId}`;
    const appUrl = `discord://-/users/${userId}`;

    if (isMobile()) {
        window.location.href = webUrl;
    } else {
        window.location.href = appUrl;
        setTimeout(() => {
            if (document.hasFocus()) {
                window.location.href = webUrl;
            }
        }, 500);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    userId = params.get("id");
    userId ? fetchUserData(userId) : displayError("No user ID provided in URL.");
    el.add?.addEventListener("click", handleAddClick);
});