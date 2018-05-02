const signalhub = require('signalhub');
const hub = signalhub('step-conter', ['http://192.168.0.100:8080']);
const startButton = document.querySelector('.start-button');

let running = false;
let interval;
let frequency = 100;

let x;
let y;
let z;

startButton.addEventListener('click', toggle);
window.addEventListener('devicemotion', updatePosition);

function toggle(event) {
    running = !running;
    startButton.innerHTML = running ? 'Stop' : 'Start';

    if (running) {
        interval = setInterval(broadcast, 1000 / frequency);
    } else {
        clearInterval(interval);
    }    
}

function broadcast() {
    hub.broadcast('teste', [ x, y, z ]);
}

function updatePosition(e) {
    x = e.accelerationIncludingGravity.x;
    y = e.accelerationIncludingGravity.y;
    z = e.accelerationIncludingGravity.z;
}