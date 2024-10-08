document.addEventListener("DOMContentLoaded", getData);
document.getElementById("AddBtn").addEventListener("click", Redirect);

async function getData() {
    const params = new URLSearchParams(location.search);
    const userId = params.get("id");
    try {
        const response = await fetch("./.netlify/functions/fetch?id=" + userId).then((resp) => resp.json());
        const data = response["msg"];
        document.getElementById("UrlImage").style = "background-image: url(https://cdn.discordapp.com/avatars/" + data.id + "/" + data.avatar + ".webp);";
        document.getElementById("UserId").innerHTML = data.username;
        document.getElementById("NumberId").innerHTML = data.display_name === null ? ("#" + data.discriminator) : "";
        document.getElementById("AccessBtn").innerHTML = "Add " + data.username;
        document.getElementById("DiscTitle").innerHTML += " · " + data.username;
    } catch {
        document.getElementById("Square").innerHTML =
            `<span>It seems like there was an issue loading.<br/>Please visit the wiki for more information <a href='https://github.com/taichikuji/discordid/wiki'>「here」</a></span>`;
    }
}

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