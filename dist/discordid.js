const el = {
    img: document.getElementById("UrlImage"),
    uid: document.getElementById("UserId"),
    num: document.getElementById("NumberId"),
    add: document.getElementById("AddBtn"),
    btnTxt: document.getElementById("AccessBtn"),
    title: document.getElementById("DiscTitle"),
    sq: document.getElementById("Square"),
};

let uid = null;
let udata = null;

function displayError(msg) {
    console.error("Error:", msg);
    if (el.sq) {
        el.sq.innerHTML = `<span class="error-message">${msg}</span>`;
        el.sq.classList.add('error-state');
    } else {
        alert("An error occurred. " + msg.replace(/<br\/?>/g, '\n').replace(/<a.*?>(.*?)<\/a>/g, '$1'));
    }
}

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
        udata = result.msg;
        updateUI(udata);
    } catch (error) {
        displayError(`Failed to load data for ID ${userId}. (${error.message}) <br/>See wiki <a href='https://github.com/taichikuji/discordid/wiki'>「here」</a>`);
    }
}

function isMobile() {
    return navigator.userAgentData?.mobile ?? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

async function handleAddClick() {
    if (!uid || !udata) {
        console.error("Missing ID or data for redirect.");
        alert("User info missing. Please refresh.");
        return;
    }

    const username = udata.username || '';
    const discrim = udata.discriminator;
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

    const webUrl = `https://discord.com/users/${uid}`;
    const appUrl = `discord://-/users/${uid}`;

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

async function init() {
    const params = new URLSearchParams(location.search);
    uid = params.get("id");
    if (!uid) {
        displayError("No user ID in URL. <br/>See wiki <a href='https://github.com/taichikuji/discordid/wiki'>「here」</a>");
        return;
    }
    await fetchUserData(uid);
}

document.addEventListener("DOMContentLoaded", init);
if (el.add) {
    el.add.addEventListener("click", handleAddClick);
} else {
    console.error("Add button ('AddBtn') not found.");
}