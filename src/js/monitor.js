const signalhub = require('signalhub');
const hub = signalhub('step-conter', ['http://192.168.0.111:8081']);
const canvas = document.querySelector('canvas');
const saveDataButton = document.querySelector('#saveData');
const context = canvas.getContext('2d');
const colors = ['red', 'green', 'blue'];
const motionData = JSON.parse(localStorage.getItem('data')) || [];

canvas.width = innerWidth - 20;
canvas.height = 500;

let scalar = 5;
let windowSize = 500;
let xOffset = 0;
let centerLine = canvas.height / 2;


hub.subscribe('teste').on('data', data => motionData.push(data));

saveDataButton.addEventListener('click', _ => {
    localStorage.setItem('data', JSON.stringify(motionData));
});

let isGrabbing = false;

document.addEventListener('mousedown', e => {
    e.preventDefault();
    isGrabbing = true;
});

document.addEventListener('mouseup', e => {
    e.preventDefault();
    isGrabbing = false;
});

document.addEventListener('mousemove', e => {
    if (isGrabbing) {
        e.preventDefault();

        xOffset += e.movementX;

        if (e.altKey) {
            centerLine += e.movementY;
        } else {
            scalar += (e.movementY / 10);
        }

    }
});

document.addEventListener('wheel', e => {
    windowSize -= e.movementY * 5;
});





function draw() {

    drawPoints();
    requestAnimationFrame(draw);
}

function drawPoints() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let j = 0; j < 3; j++) {

        context.beginPath();
        context.strokeStyle = colors[j];
        context.moveTo(0, centerLine);
        for (let i = 1; i <= windowSize; i++) {
            let index = motionData.length - i + xOffset;

            if (!motionData[index]) continue;

            let xCoord = (canvas.width / windowSize) * (i - 1);
            let yCoord = (centerLine) - (motionData[index][j] * scalar);
            context.lineTo(xCoord, yCoord);
        }
        context.moveTo(canvas.width, centerLine);

        context.stroke();
        context.closePath();

    }
}

draw();