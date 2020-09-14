document.addEventListener('DOMContentLoaded', init);

function init() {
    "uses strict";

    let ctx = document.querySelector(".canvas").getContext("2d");

    let width = 250;
    let height = 250;

    let imageData = ctx.createImageData(width, height);
    
    let r = 255;
    let g = 0;
    let b = 255;
    let a = 255;
    
    
    setColor(imageData, r, g, b, a);
    
    ctx.putImageData(imageData, 0, 0);
    
    

    function setColor(imageData, r, g, b, a) {
        for (let i = 0; i < width; i++) {

            if (i <= width / 2) {
                let coheficiente = 255 / (width / 2);
                r = coheficiente * i;
                g = coheficiente * i;
                b = 0;
                for (let j = 0; j < height; j++) {
                    setPixel(imageData, i, j, r, g, b, a);
                }
            } else if (i > width / 2) {
                let coheficiente =  255 / (width / 2);
                console.log("coheficiente: " + coheficiente);
                console.log("g antes: " + g);
                g = g - coheficiente;
                console.log("g despues: " + g);
                for (let j = 0; j < height; j++) {
                    setPixel(imageData, i, j, r, g, b, a);
                }
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