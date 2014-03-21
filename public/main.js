var socket = io.connect(host);
var converter = new Markdown.Converter();
var chatDisplay = document.querySelector('.chat-display');
var messageBox = document.querySelector('#message');
var nameBox = document.querySelector('#name');
var markdownPreviewBox = document.querySelector('#markdownPreview');
var sendButton = document.querySelector('#send');
var config = {sendKey: 13};

main();

function main() {
    listenMessage();
    listenSendMessage();
    previewMarkdown();
}

function listenMessage() {
    socket.on('message', function(data) {
        var div = document.createElement('div');
        var text = '<b>' + data.name + ' : </b>' + data.message;
        var html = converter.makeHtml(text);
        div.innerHTML = html;
        chatDisplay.appendChild(div);
        addStylesToChatMessage(div, data.name);

    });
}

function listenSendMessage() {
    messageBox.addEventListener('keyup', function (e) {
        if (e.keyCode === config.sendKey && e.shiftKey) {
            sendMessage();
        }
    });
    sendButton.addEventListener('click', sendMessage);
}

function sendMessage() {
    socket.emit('message', {
        message: messageBox.value,
        name: nameBox.value
    });
    messageBox.value = '';
    markdownPreviewBox.innerHTML = '';
}

function previewMarkdown() {
    messageBox.addEventListener('input', function (e) {
        var html = converter.makeHtml(e.target.value);
        markdownPreviewBox.innerHTML = html;
    }); 
}

function addStylesToChatMessage(div, name) {
    if (nameBox.value !== name) {
        div.classList.add('alert');
        div.classList.add('alert-info');
        div.classList.add('other');
    } else {
        div.classList.add('well');
        div.classList.add('well-sm');
        div.classList.add('self');
    }
    scrollToBottom();
}

function scrollToBottom() {
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}
