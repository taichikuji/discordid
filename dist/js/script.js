function Redirect() {
    const params = new URLSearchParams(location.search);
    const userId = params.get("id");
    // Copy user to clipboard
    let TextArea = document.createElement("TextArea");
    TextArea.value = document.getElementById("UserId").textContent + document.getElementById("NumberId").textContent;
    document.body.appendChild(TextArea);
    TextArea.select();
    TextArea.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(TextArea.value);
    TextArea.remove();
    // Redirect to discord
    if (isMobileDevice()) {
        window.location.href = "https://discord.com/users/" + userId;
    } else {
        window.location.href = "discord://-/users/" + userId;
        setTimeout(() => {
            if (document.hasFocus()) {
                window.location.href = 'https://discord.com/users/' + userId;
            }
        }, 25)
    }
}

async function getData() {
    const params = new URLSearchParams(location.search);
    const userId = params.get("id");
    // Get user data from api if userId is valid
    if (!isNaN(userId) && parseInt(userId)) {
        const response = await fetch("./.netlify/functions/node-fetch?id=" + userId).then((resp) => resp.json());
        const data = response["msg"];
        document.getElementById("DiscTitle").innerHTML += " · " + data.username;
        document.getElementById("UserId").innerHTML = data.username;
        document.getElementById("NumberId").innerHTML = "#" + data.discriminator;
        document.getElementById("AccessBtn").innerHTML = "Add " + data.username;
        document.getElementById("UrlImage").style = "background-image: url(https://cdn.discordapp.com/avatars/" + data.id + "/" + data.avatar + ".webp);";
    } else {
        document.getElementById("Square").innerHTML =
            "<p>Hello! I'm Taichi.<br/>You're visiting the site without an ID, please visit the wiki for more info <a href='https://github.com/taichikuji/discordid/wiki'>「here」</a></p>";
    }
}

function isMobileDevice() {
    // Check in client hints if device is mobile
    if (window.navigator.userAgentData) {
        return window.navigator.userAgentData.mobile;
    }
    // Fallback for devices that don't support client hints
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        return true;
    }
    return false;
}