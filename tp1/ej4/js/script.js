document.addEventListener('DOMContentLoaded', init);

function init() {
    "uses strict";

    let ctx = document.querySelector(".canvas").getContext("2d");

    let width = 500;
    let height = 500;

    let imageData = ctx.createImageData(width, height);


    for (let i = 0; i < width; i++) {
        let r = 0;
        let g = 1;
        let b = 0;
        let a = 200;
        for (let j = 0; j < height; j++) {
            setPixel(imageData, i, j, r, g, b, a);
            r--;
            b--;
            a--;
        }
    }

    ctx.putImageData(imageData, 0, 0);

    function setPixel(imageData, i, j, r, g, b, a) {
        let index = (i + j * imageData.width) * 4;
        imageData.data[index + 0] = r;
        imageData.data[index + 1] = g;
        imageData.data[index + 2] = b;
        imageData.data[index + 3] = a;
    }
}