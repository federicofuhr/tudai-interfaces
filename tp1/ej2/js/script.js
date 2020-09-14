document.addEventListener('DOMContentLoaded', init);

function init() {
    "uses strict";

    let ctx = document.querySelector(".canvas").getContext("2d");
    ctx.beginPath();
    ctx.fillRect(20, 20, 150, 100);
    ctx.stroke();
}