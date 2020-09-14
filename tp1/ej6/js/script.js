document.addEventListener('DOMContentLoaded', init);

function init() {
    "uses strict";

    let ctx = document.querySelector(".canvas").getContext("2d");

    let width = 400;
    let height = 600;

    let imageData = ctx.createImageData(width, height);
    
    let r = 255;
    let g = 0;
    let b = 0;
    let a = 100;
      
    setColor(imageData, r, g, b, a);
    
    ctx.putImageData(imageData, 0, 0);  

    function setColor(imageData, r, g, b, a) {
        for (let i = 0; i < width; i++) {
            if (i <= width * 0.333) {
                let coheficiente = 255 / (width * 0.333);
                g = coheficiente * i;
            } else if ((i > width * 0.333) && (i < width * 0.666)) {
                let coheficiente =  255 / (width / 2);
                g = coheficiente * i;
            } else {
                let coheficiente =  255 / (width / 0.66);
                g = coheficiente * i;
            }
            for (let j = 0; j < height; j++) {
                setPixel(imageData, i, j, r, g, b, a);
            }
        }
    }

    function setPixel(imageData, i, j, r, g, b, a) {
        let index = (i + j * imageData.width) * 4;
        imageData.data[index + 0] = r;
        imageData.data[index + 1] = g;
        imageData.data[index + 2] = b;
        imageData.data[index + 3] = a;
    }
}