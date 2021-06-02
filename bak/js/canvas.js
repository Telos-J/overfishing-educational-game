const canvas = document.querySelector('#sim');
const context = canvas.getContext('2d');

function resize() {
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    canvas.width = Math.floor(innerWidth * devicePixelRatio);
    canvas.height = Math.floor(innerHeight * devicePixelRatio); 
}

window.addEventListener('resize', resize);
resize();
