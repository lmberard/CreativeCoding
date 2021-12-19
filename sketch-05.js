const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const Tweakpane = require('tweakpane');

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
    
    context.fillStyle = 'black';
    context.fillRect(0,0,width,height);

    context.textBaseline = 'middle';
    context.textAlign = 'center';
    //context.drawImage(typeCanvas,0,0);

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

      //GLIFOS
      const glyph = getGlyph(b);
      //const glyph2 = getGlyph(r);
      context.font = `${cell *2}px ${fontFamily}`; 
      if(Math.random() < 0.1) context.font = `${cell *6}px ${fontFamily}`; 
      //context.fillStyle = 'white';
      context.fillStyle = `rgb(${r},${g},${b})`; 

      /* lo bueno de escribirlo asi pixelado es que lo puedo dibujar como quiera, 
      rectangulos, circulos, etc*/
      context.save();
        context.translate(x, y);
        context.translate(cell*0.5, cell*0.5);
        //context.fillRect(0,0,cell,cell);
        /*context.beginPath();
        context.arc(0, 0, cell*0.5,0, Math.PI*2);
        context.fill();*/
        context.fillText(glyph,0,0);
        //context.fillText(glyph2,0,0);
      context.restore();

    }
  };
};


//color es un numero entre 0 y 255
const getGlyph = (color) => {
  if(color < 50) return '';
  if(color < 100) return '.';
  if(color < 150) return '-';
  if(color < 200) return '♥';
  const glyphs = 'love'.split('');
  return random.pick(glyphs);

}

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