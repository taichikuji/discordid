function CopyAndGo() {
    let CopyText = document.getElementById("UserId");
    let CopyNumber = document.getElementById("NumberId");
    let TextArea = document.createElement("TextArea");
    TextArea.value = CopyText.textContent + CopyNumber.textContent;
    document.body.appendChild(TextArea);
    TextArea.select();
    TextArea.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand("Copy");
    TextArea.remove();
    let params = new URLSearchParams(location.search);
    if (params.get('id')) {
        window.location.href = 'https://discord.com/users/' + params.get('id');
    } else {
        window.location.href = 'https://discordapp.com/channels/@me/';
    }
}

function getData() {
    let params = new URLSearchParams(location.search);
    if (params.get('name') && params.get('number')) {
        document.getElementById("UserId").innerHTML = params.get('name')
        document.getElementById("NumberId").innerHTML = "#" + params.get('number')
        document.getElementById("AccessButton").innerHTML = "Add " + params.get('name') + "#" + params.get('number')
    } else {
        document.getElementById("Square").innerHTML = "<p>Hello! I'm Taichi.<br/>You're visiting the site without any parameters, please visit the wiki for more <a href='https://github.com/taichikuji/template-discord-introduction/wiki'>info!</a></p>"
    }
    if (params.get('img')) {
        document.getElementById("UrlImage").style = "background-image: url(" + params.get('img') + ");"
    }
}