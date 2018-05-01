const startButton = document.querySelector('.start-button');

let running = false;

startButton.addEventListener('click', toggle);

function toggle(event) {
    running = !running;
    startButton.innerHTML = running ? 'Stop' : 'Start';
}