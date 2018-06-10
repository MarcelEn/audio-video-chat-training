const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

let socket = new WebSocket(`${protocol}//${window.location.host}/watch`)



socket.onopen = () => {
    var canvas = document.querySelector('canvas');
    var ctx = canvas.getContext('2d');
    var imageData = ctx.createImageData(500, 500);
    var pixels = imageData.data;
    var lastFrame = new Date().valueOf();
    socket.onmessage = msg => {
        JSON.parse(`[${msg.data}]`).forEach((element, i) => {
            pixels[i] = element;
        });
        imageData.data = JSON.parse(`[${msg.data}]`)
        ctx.putImageData(imageData, 0, 0);
        console.log(new Date().valueOf() - lastFrame);
        lastFrame = new Date().valueOf();
    }
}