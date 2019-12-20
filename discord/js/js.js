function copyandgo() {
    var copyText = document.getElementById("userid");
    var copyNumber = document.getElementById("numberid");
    var textArea = document.createElement("textarea");
    textArea.value = copyText.textContent + copyNumber.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand("Copy");
    textArea.remove();
    window.location.href='https://discordapp.com/channels/@me/';
}