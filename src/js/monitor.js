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
const avgWindowSlider = document.querySelector('#avgWindow');

//Data for the chart
const motionData = JSON.parse(localStorage.getItem('data')) || [];
const colors = ['red', 'green', 'blue', 'black', 'purple', 'orange'];
const lables = ['X', 'Y', 'Z', 'SUM', 'AVG', 'NORMAL'];
const shouldRender = lables.map(l => true);

canvas.width = innerWidth - 20;
canvas.height = 500;

let scalar = 5;
let windowSize = 500;
let xOffset = 0;
let centerLine = canvas.height / 2;
let avgWindow = parseInt(avgWindowSlider.value);


treatData(motionData);
renderLabels(lablesDiv, lables, colors);

//hub.subscribe('teste').on('data', data => motionData.push(data));

saveDataButton.addEventListener('click', _ => {
    localStorage.setItem('data', JSON.stringify(motionData));
});

let isGrabbing = false;

canvas.addEventListener('mousedown', e => {
    isGrabbing = true;
});

canvas.addEventListener('mouseup', e => {
    isGrabbing = false;
});

canvas.addEventListener('mousemove', e => {
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

canvas.addEventListener('wheel', e => {
    windowSize -= e.movementY * 5;
    scalar += (e.movementY / 10);
});

avgWindowSlider.addEventListener('mousemove', e => {
    if (avgWindow == avgWindowSlider.value) return;
    avgWindow = parseInt(avgWindowSlider.value);
    treatData(motionData)
});


function treatData(data) {
    data.forEach((d, i) => {
        d[3] = (d[0] + d[1] + d[2]);
        d[4] = (d[0] + d[1] + d[2]) / 3;
        d[5] = 0;

        for (let j = i - avgWindow; j <= i + avgWindow; j++) {
            if (!data[j]) {
                d[5] += d[3];
            } else {
                d[5] += (data[j][0] + data[j][1] + data[j][2]);
            }
        }

        d[5] = d[5] / (2 * avgWindow + 1);
    });
}


function renderLabels(div, labels, colors) {
    div.innerHTML = `
        ${labels.map((l, i) => `
        <label style="cursor:pointer;">
            <input type="checkbox" checked id="${i}" />
            <span style="display:inline-block;width:30px;height:15px;background-color:${colors[i]};"></span>
            ${l}
        </label><br>`).join('')}
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