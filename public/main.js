var socket = io.connect('http://localhost');
var converter = new Markdown.Converter();

socket.on('message', function(data) {
    var div = document.createElement('div');
    var text = data.name + ' : <br>' + data.message;
    if (document.querySelector('#name').value !== data.name) {
    	div.classList.add('alert');
    	div.classList.add('alert-info');
    }
    var html = converter.makeHtml(text);
    div.innerHTML = html;
    document.querySelector('.chat-display').appendChild(div);

});

document.querySelector('#send').addEventListener('click', sendMessage);

function sendMessage() {
    socket.emit('message', {
        message: document.querySelector('#message').value,
        name: document.querySelector('#name').value
    });
}