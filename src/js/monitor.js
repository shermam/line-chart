// Comands to start environment
// npm run signal
// watchify src/js/monitor.js -o src/js/bundle2.js
// watchify src/js/main.js -o src/js/bundle.js
// http-server ./src -c-1

//const signalhub = require('signalhub');
//const hub = signalhub('step-conter', ['http://192.168.0.111:8081']);
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const saveDataButton = document.querySelector('#saveData');
const lablesDiv = document.querySelector('#labels');

//Data for the chart
const motionData = JSON.parse(localStorage.getItem('data')) || [];
const colors = ['red', 'green', 'blue', 'black', 'purple'];
const lables = ['X', 'Y', 'Z', 'SUM'];
const shouldRender = lables.map(l => true);

canvas.width = innerWidth - 20;
canvas.height = 500;

let scalar = 5;
let windowSize = 500;
let xOffset = 0;
let centerLine = canvas.height / 2;

renderLabels(lablesDiv, lables);

//hub.subscribe('teste').on('data', data => motionData.push(data));

saveDataButton.addEventListener('click', _ => {
    localStorage.setItem('data', JSON.stringify(motionData));
});

let isGrabbing = false;

document.addEventListener('mousedown', e => {
    isGrabbing = true;
});

document.addEventListener('mouseup', e => {
    isGrabbing = false;
});

document.addEventListener('mousemove', e => {
    if (isGrabbing) {
        if (e.altKey) {
            windowSize += e.movementX * 5;
            scalar -= (e.movementY / 10);
        } else {
            xOffset -= e.movementX;
            centerLine += e.movementY;
        }

    }
});

document.addEventListener('wheel', e => {
    windowSize -= e.movementY * 5;
    scalar += (e.movementY / 10);
});


function renderLabels(div, labels) {
    div.innerHTML = `
        ${labels.map((l, i) => `<label>${l}<input type="checkbox" checked id="${i}" /></label><br>`).join('')}
    `;

    div.querySelectorAll('input').forEach(el => {
        el.addEventListener('change', e => {
            shouldRender[parseInt(el.id)] = el.checked;
        })
    })
}



function draw() {

    drawPoints();
    requestAnimationFrame(draw);
}

function drawPoints() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let j = 0; j < motionData[0].length; j++) {

        if (!shouldRender[j]) {
            continue;
        }

        context.beginPath();
        context.strokeStyle = colors[j];
        context.moveTo((canvas.width / windowSize) * xOffset, (centerLine) - (motionData[motionData.length - 1][j] * scalar));
        for (let i = 2; i <= windowSize; i++) {
            let index = motionData.length - i + xOffset;

            if (!motionData[index]) {
                continue;
            };

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