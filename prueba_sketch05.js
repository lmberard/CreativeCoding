const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

let manager;
let text = 'A';
let fontSize = 1200;
let fontFamily = 'Isidora Sans';

//PARA MAPA DE BITS
const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

const sketch = ({ context, width, height }) => {

  const cell = 20;
  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;

  typeCanvas.width = cols;
  typeCanvas.height = rows;


  return ({ context, width, height }) => {
    typeContext.fillStyle = 'black';
    typeContext.fillRect(0, 0, cols, rows);

    fontSize = cols;
    typeContext.fillStyle = 'white';
    //typeContext.font = fontSize + 'px ' + fontFamily;
    typeContext.font = `${fontSize}px ${fontFamily}`;//otra forma de concatenar strings
    typeContext.textBaseline = 'middle';
    typeContext.textAlign = 'center';
    

    const metrics = typeContext.measureText(text);
    const mx = metrics.actualBoundingBoxLeft * -1;
    const my = metrics.actualBoundingBoxAscent * -1;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const tx = (cols - mw) * 0.5 - mx;
    const ty = (rows - mh) * 0.5 - my;

    typeContext.save();
      typeContext.translate(tx, ty);
      typeContext.fillText(text,0,0);
    typeContext.restore();

    const typeData = typeContext.getImageData(0,0,cols,rows).data;
    
    context.drawImage(typeCanvas,0,0);

    for(let i = 0; i < numCells; i++){
      
      const col = i % cols;
      const row = Math.floor(i / cols);
      
      const x = col * cell;
      const y = row * cell;

      //para leer los valores de rgb del mapa de bits:
      const r = typeData[i * 4 + 0]; //porque red es el primero
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];

      context.fillStyle = `rgb(${r},${g},${b})`; 
      /* lo bueno de escribirlo asi pixelado es que lo puedo dibujar como quiera, 
      rectangulos, circulos, etc*/
      context.save();
        context.translate(x, y);
        context.translate(cell*0.5, cell*0.5);
        //context.fillRect(0,0,cell,cell);
        context.beginPath();
        context.arc(0, 0, cell*0.5,0, Math.PI*2);
        context.fill();
      context.restore();

    }
  };
};

const onKeyUp = (e) =>  {
  text = e.key.toUpperCase();
  manager.render();
}

document.addEventListener('keyup',onKeyUp)


//FUNCIONES ASINCRONICAS, REVISAR ASYNC Y PROMISE()
const start = async () => {
  manager = await canvasSketch(sketch, settings);
};
start();