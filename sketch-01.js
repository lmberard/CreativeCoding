//import the library
const canvasSketch = require('canvas-sketch');

//dimensiones de canvas
//piola para hacerlo en A4 o landscape o cualquier cosa
const settings = {
  dimensions: [ 1080, 1080 ]
  /*
  pixelsPerInch : 300;
  orientation: 'land';//landscape
  */
};

//basicamente arma un rectangulo gigante 
//lo piola es que al guardarlo se genera un png que se guarda en la carpeta
const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.lineWidth = width *0.01;

    const ancho = width *0.1;
    const largo = height * 0.1;
    const gap = width *0.03;
    const off = width *0.02;
    let ix = width *0.17;
    let iy = height * 0.17;
    let x,y;

    for(let i = 0; i < 5; i++) {
        for(let j = 0; j < 5; j++) {

            x = ix + (ancho + gap)*i;
            y = iy + (ancho + gap)*j;
        
            context.beginPath();
            context.rect(x,y,ancho,largo);
            context.stroke();

            if(Math.random() > 0.5) //random devuelve un nro random entre 0 y 1
            {   context.beginPath();
                context.rect(x+off/2,y+off/2,ancho-off,largo-off);
                context.stroke();
            }

        }

    }
  };
};

//calling the library y pasandole los parametros
canvasSketch(sketch, settings);
