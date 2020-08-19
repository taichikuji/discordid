function CopyAndGo() {
    var CopyText = document.getElementById("userid");
    var CopyNumber = document.getElementById("numberid");
    var TextArea = document.createElement("textarea");
    TextArea.value = CopyText.TextContent + CopyNumber.TextContent;
    document.body.appendChild(TextArea);
    TextArea.select();
    TextArea.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand("Copy");
    TextArea.remove();
    window.location.href = 'https://discordapp.com/channels/@me/';
}

async function getUserId() {
    let params = new URLSearchParams(location.search);
    let response = await fetch('https://tracr.co/api/users/1/' + params.get('id'));
    let data = await response.json()
    document.getElementById("userid").innerHTML = data["username"];
    document.getElementById("numberid").innerHTML = data["discriminator"];
    document.getElementById("urlImage").style = "background-image: url(https://cdn.discordapp.com/avatars/" + data["id"] + "/" + data["avatar_url"] + ".webp?size=128);"
}