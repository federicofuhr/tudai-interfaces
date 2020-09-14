document.addEventListener('DOMContentLoaded', init);

function init() {
    "uses strict";

    let canvas = document.querySelector(".canvas");
    let ctx = document.querySelector(".canvas").getContext("2d");

    let rect = canvas.getBoundingClientRect();
    
    
    let x = 0;
    let y = 0;
    let dibujando = false;
    let color = 'black';
    let grosor = 1;

    let botonSubirImagen = document.querySelector("#subir-imagen");
    botonSubirImagen.addEventListener('click', function() {
        inputImagen.click();
    })
    
    let inputImagen = document.querySelector("#input-imagen");
    inputImagen.addEventListener('click', prueba);

    function prueba() {
        console.log('hola');
    }


    let botonLapiz = document.querySelector("#lapiz");
    botonLapiz.addEventListener('click', activarLapiz);

    let botonGoma = document.querySelector("#goma");
    botonGoma.addEventListener('click', activarGoma);

    let botonNuevoLienzo = document.querySelector("#nuevo-lienzo");
    botonNuevoLienzo.addEventListener('click', nuevoLienzo);

    function nuevoLienzo() {
        ctx.beginPath();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.closePath();
    }

    function activarGoma() {
        color = 'white';
        grosor = 20;
    }

    function activarLapiz() {
        color = 'black';
        grosor = 1;
    }

    canvas.addEventListener('mousedown', function(e) {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
        dibujando = true;
    });

    canvas.addEventListener('mousemove', function(e) {
        if (dibujando === true) {
            dibujar(x, y, e.clientX - rect.left, e.clientY - rect.top);
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }
    });

    canvas.addEventListener('mouseup', function(e) {
        if (dibujando === true) {
            dibujar(x, y, e.clientX - rect.left, e.clientY - rect.top);
            x = 0;
            y = 0;
            dibujando = false;
        }
    });

    function dibujar(x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = grosor;
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.stroke();
        ctx.closePath();
    }
    
    
    let imageData = ctx.createImageData(canvas.height, canvas.width);

    
    

    function setPixel(imageData, i, j, r, g, b, a) {
        let index = (i + j * imageData.width) * 4;
        imageData.data[index + 0] = r;
        imageData.data[index + 1] = g;
        imageData.data[index + 2] = b;
        imageData.data[index + 3] = a;
    }
}