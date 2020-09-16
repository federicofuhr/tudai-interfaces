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
    let umbralBinarizacion = 50;
    let nivelBrillo = 10;
    let nivelSaturacion = 2;

    let botonSubirImagen = document.querySelector("#subir-imagen");
    botonSubirImagen.addEventListener('click', function () {
        inputImagen.click();
    });

    let botonSaturacion = document.querySelector('#filtro-saturacion');
    botonSaturacion.addEventListener('click', aplicarFiltroSaturacion);

    let rangoGrosor = document.querySelector('#grosor');
    rangoGrosor.addEventListener('change', modificarGrosor);

    let botonFiltroBrillo = document.querySelector('#filtro-brillo');
    botonFiltroBrillo.addEventListener('click', aplicarFiltroBrillo);

    let botonFiltroNegativo = document.querySelector("#filtro-negativo");
    botonFiltroNegativo.addEventListener('click', aplicarFiltroNegativo);

    let botonFiltroBinarizacion = document.querySelector("#filtro-binarizacion");
    botonFiltroBinarizacion.addEventListener('click', aplicarFiltroBinarizacion);

    let botonFiltroSepia = document.querySelector("#filtro-sepia");
    botonFiltroSepia.addEventListener('click', aplicarFiltroSepia);

    let inputImagen = document.querySelector("#input-imagen");
    inputImagen.addEventListener('click', prueba);

    let botonGuardar = document.querySelector('#boton-guardar');
    botonGuardar.addEventListener('click', guardarImagen, false);

    let botonLapiz = document.querySelector("#lapiz");
    botonLapiz.addEventListener('click', activarLapiz);

    let botonGoma = document.querySelector("#goma");
    botonGoma.addEventListener('click', activarGoma);

    let botonNuevoLienzo = document.querySelector("#nuevo-lienzo");
    botonNuevoLienzo.addEventListener('click', nuevoLienzo);

    canvas.addEventListener('mousedown', function (e) {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
        dibujando = true;
    });

    canvas.addEventListener('mousemove', function (e) {
        if (dibujando === true) {
            dibujar(x, y, e.clientX - rect.left, e.clientY - rect.top);
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }
    });

    canvas.addEventListener('mouseup', function (e) {
        if (dibujando === true) {
            dibujar(x, y, e.clientX - rect.left, e.clientY - rect.top);
            x = 0;
            y = 0;
            dibujando = false;
        }
    });

    function modificarGrosor() {
        grosor = rangoGrosor.value;
    }

    function obtenerPixel(imageData, x, y, pos) {
        let index = (x + y * imageData.width) * 4;
        return imageData.data[index + pos];
    }

    function aplicarFiltroSaturacion() {
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < imageData.width; i++) {
            for (let j = 0; j < imageData.height; j++) {
                let hsv = RGBtoHSV(imageData, i, j);
                hsv[1] *= nivelSaturacion;
                let rgb = HSVtoRGB(hsv);
                setearPixel(imageData, i, j, rgb[0], rgb[1], rgb[2], 255);
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    function RGBtoHSV(imageData, i , j) {
        let r, g, b, h, s, v;
        r = obtenerPixel(imageData, i, j, 0);
        g = obtenerPixel(imageData, i, j, 1);
        b = obtenerPixel(imageData, i, j, 2);
        let min = Math.min(r, g, b);
        let max = Math.max(r, g, b);
        v = max;
        let delta = max - min;
        if (max != 0)
            s = delta / max;
        else {
            s = 0;
            h = -1;
            return [h, s, undefined];
        }
        if (r === max)
            h = (g - b) / delta;
        else if (g === max)
            h = 2 + (b - r) / delta;
        else
            h = 4 + (r - g) / delta;
        h *= 60;
        if (h < 0)
            h += 360;
        if (isNaN(h))
            h = 0;
        return [h, s, v];
    };

    function HSVtoRGB(color) {
        let i, h, s, v, r, g, b;
        h = color[0];
        s = color[1];
        v = color[2];
        if (s === 0) {
            r = g = b = v;
            return [r, g, b];
        }
        h /= 60;
        i = Math.floor(h);
        let f = h - i;
        let p = v * (1 - s);
        let q = v * (1 - s * f);
        let t = v * (1 - s * (1 - f));
        switch (i) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            default:
                r = v;
                g = p;
                b = q;
                break;
        }
        return [r, g, b];
    }

    function aplicarFiltroBinarizacion() {
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < canvas.width; i++) {
            for (let j = 0; j < canvas.height; j++) {
                let r = obtenerPixel(imageData, i, j, 0);
                let g = obtenerPixel(imageData, i, j, 1);
                let b = obtenerPixel(imageData, i, j, 2);
                let promedio = Math.floor((r + g + b) / 3);
                if (promedio > umbralBinarizacion) {
                    setearPixel(imageData, i, j, 255, 255, 255, 255);
                } else {
                    setearPixel(imageData, i, j, 0, 0, 0, 255);
                }
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    function aplicarFiltroBrillo() {
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < imageData.width; i++) {
            for (let j = 0; j < imageData.height; j++) {
                let r = obtenerPixel(imageData, i, j, 0) + nivelBrillo
                let g = obtenerPixel(imageData, i, j, 1) + nivelBrillo;
                let b = obtenerPixel(imageData, i, j, 2) + nivelBrillo;
                setearPixel(imageData, i, j, r, g, b, 255);
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    function aplicarFiltroSepia() {
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < imageData.width; i++) {
            for (let j = 0; j < imageData.height; j++) {
                let r = obtenerPixel(imageData, i, j, 0);
                let g = obtenerPixel(imageData, i, j, 1);
                let b = obtenerPixel(imageData, i, j, 2);
                let promedio = Math.floor((r + g + b) / 3);
                r = Math.min(promedio + 40, 255);
                g = Math.min(promedio + 15, 255);
                b = Math.min(promedio, 255);
                setearPixel(imageData, i, j, r, g, b, 255);
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    function aplicarFiltroNegativo() {
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < canvas.width; i++) {
            for (let j = 0; j < canvas.height; j++) {
                let r = 255 - obtenerPixel(imageData, i, j, 0);
                let g = 255 - obtenerPixel(imageData, i, j, 1);
                let b = 255 - obtenerPixel(imageData, i, j, 2);
                setearPixel(imageData, i, j, r, g, b);
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    function prueba() {
        console.log('hola');
    }

    function nuevoLienzo() {
        ctx.beginPath();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.closePath();
    }

    function activarGoma() {
        color = 'white';
    }

    function activarLapiz() {
        color = 'black';
    }

    function dibujar(x1, y1, x2, y2) {
        ctx.beginPath();
        modificarGrosor();
        ctx.strokeStyle = color;
        ctx.lineWidth = grosor;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
    }

    function setearPixel(imageData, i, j, r, g, b) {
        let index = (i + j * imageData.width) * 4;
        imageData.data[index + 0] = r;
        imageData.data[index + 1] = g;
        imageData.data[index + 2] = b;
    }

    inputImagen.onchange = e => {
        nuevoLienzo();
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = readerEvent => {
            let content = readerEvent.target.result;
            let image = new Image();
            image.src = content;
            image.onload = function () {
                if (this.width > this.height) {
                    imageAspectRatio = (1.0 * this.height) / this.width;
                    imageScaledWidth = canvas.width;
                    imageScaledHeight = canvas.width * imageAspectRatio;
                } else {
                    imageAspectRatio = (1.0 * this.width) / this.height;
                    imageScaledWidth = canvas.height;
                    imageScaledHeight = canvas.height * imageAspectRatio;
                }
                ctx.drawImage(this, 0, 0, imageScaledWidth, imageScaledHeight);
                let imageData = ctx.getImageData(0, 0, imageScaledWidth, imageScaledHeight);
                oldImage = imageData;
                ctx.putImageData(imageData, 0, 0);
            }
        }
    }

    function guardarImagen() {
        let dato = canvas.toDataURL("image/jpeg");
        dato = dato.replace("image/jpeg", "image/octet-stream");
        document.location.href = dato;
    }
}