async function getData() {
    let params = new URLSearchParams(location.search);
    if (!isNaN(params.get('id')) && parseInt(params.get('id'))) {
        window.location.href = 'discord://-/users/' + params.get('id');
        const response = await fetch("./.netlify/functions/node-fetch?id=" + params.get('id')).then((resp) => resp.json());
        const data = response['msg'];
        document.getElementById("DiscTitle").innerHTML += " · " + data.username;
        document.getElementById("UserId").innerHTML = data.username;
        document.getElementById("NumberId").innerHTML = "#" + data.discriminator;
        document.getElementById("AccessBtn").innerHTML = "Add " + data.username;
        document.getElementById("UrlImage").style = "background-image: url(https://cdn.discordapp.com/avatars/" + data.id + "/" + data.avatar + ".webp);";
    } else {
        document.getElementById("Square").innerHTML = "<p>Hello! I'm Taichi.<br/>You're visiting the site without an ID, please visit the wiki for more info <a href='https://github.com/taichikuji/discordid/wiki'>「here」</a></p>";
    }
}

function CopyAndGo() {
    let CopyText = document.getElementById("UserId");
    let CopyNumber = document.getElementById("NumberId");
    let TextArea = document.createElement("TextArea");
    TextArea.value = CopyText.textContent + CopyNumber.textContent;
    document.body.appendChild(TextArea);
    TextArea.select();
    TextArea.setSelectionRange(0, 99999); /*For mobile devices*/
    navigator.clipboard.writeText(TextArea.value); /* Copy to Clipboard using Clipbard API */
    TextArea.remove();
    let params = new URLSearchParams(location.search);
    window.location.href = 'https://discord.com/users/' + params.get('id');
}