const signalhub = require('signalhub');
const hub = signalhub('step-conter', ['http://192.168.0.100:8080']);
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const motionData = [];
const windowSize = 500;
const colors = ['red', 'green', 'blue'];
const scalar = 5;

canvas.width = 800;
canvas.height = 500;

hub.subscribe('teste').on('data', data => motionData.push(data));

function draw() {
    
    drawPoints();
    requestAnimationFrame(draw);
}

function drawPoints() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let j = 0; j < 3; j++) { 

        context.beginPath();
        context.strokeStyle = colors[j];
        context.moveTo(0, canvas.height / 2);
        for (let i = 1; i < windowSize; i++) {
            let index = motionData.length - i;

            if(!motionData[index]) continue;

            let xCoord = (canvas.width / windowSize) * (i - 1);
            let yCoord = (canvas.height / 2) - (motionData[index][j] * scalar);
            context.lineTo(xCoord, yCoord);
        }
        context.moveTo(canvas.width, canvas.height / 2);

        context.stroke();
        context.closePath();

    }

    context.stroke();
    context.closePath();
}

draw();