var constraints = { audio: false, video: { width: 500, height: 500 } };

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

let socket = new WebSocket(`${protocol}//${window.location.host}/stream`)

socket.onopen = () => {
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (mediaStream) {
            var video = document.querySelector('video');
            var canvas = document.querySelector('canvas');
            var ctx = canvas.getContext('2d');

            video.srcObject = mediaStream

            video.onloadedmetadata = function (e) {
                video.play();
                var lastFrame = new Date().valueOf();
                const onmessage = msg => {
                    setTimeout(() => {
                        var data = ctx.getImageData(0, 0, 500, 500).data;
    
                        let image = [];
                        Object.keys(data).forEach(key => {
                            image.push(data[key])
                        })
    
                        socket.send(image);
                        console.log(new Date().valueOf() - lastFrame);
                        lastFrame = new Date().valueOf();
                    }, 1)
                }
                onmessage();
                socket.onmessage = onmessage;

                setInterval(() => {
                    ctx.drawImage(video, 0, 0, 500, 500);
                }, 40)

            };




        })
        .catch(function (err) { console.log(err.name + ": " + err.message); });
}
