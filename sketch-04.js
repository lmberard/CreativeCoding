const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const Tweakpane = require('tweakpane');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate : true, //
};


//para el gui
const params = {
  cols: 40,
  rows: 40,
  scaleMin: 1,
  scaleMax: 30,
  freq: 0.005,
  amplitude:0.25,
  frame: 0,
  animate: true,
  lineCap: 'butt',
  lineColor: 'black',
  backgroundColor: 'white',
};

const sketch = () => {
  return ({ context, width, height,frame }) => {
    context.fillStyle = params.backgroundColor;
    context.fillRect(0, 0, width, height);

    const cols = params.cols;
    const rows = params.rows;
    const numCells = cols * rows;
  
    const gridw = width  *0.8;
    const gridh = height *0.8;

    const cellw = gridw / cols;
    const cellh = gridh / rows;

    const margx = (width - gridw)*0.5;
    const margy = (height - gridh)*0.5;

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i/cols);

      const x = col * cellw;
      const y = row * cellh;
      const w = cellw * 0.8;
      const h = row * 0.8;

      const f = params.animate ? frame : params.frame;

      //const n = random.noise2D(x+frame*5,y+frame*5,params.freq);
      const n = random.noise3D(x,y,f*10, params.freq);
      const angle = n * Math.PI*params.amplitude;
      //const scale = (n+1)/2 * 30
      const scale = math.mapRange(n, -1,1,params.scaleMin,params.scaleMax);
      

      context.save();
        context.translate(x, y);
        context.translate(margx, margy);
        context.translate(cellw *0.5, cellh *0.5);
        context.rotate(angle);

        context.lineWidth = scale;
        context.lineCap = params.lineCap;
        
        context.strokeStyle = params.lineColor;
       
        context.beginPath();
        context.moveTo(w*-0.5,0);
        context.lineTo(w*0.5,0);
        context.stroke();
      context.restore();
    }

  };
};

//para crear el GUI uso la libreria de Tweakpane 
const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({title: 'Grid'});
  folder.addInput(params,'lineCap',{options: {butt: 'butt', square: 'square', round: 'round'}});
  folder.addInput(params,'backgroundColor',{options: {white: 'white',black: 'black', red: 'red', purple: 'purple'}});
  folder.addInput(params,'lineColor',{options: {white: 'white',black: 'black', red: 'red', purple: 'purple'}});
  folder.addInput(params,'cols',{min:2,max:50,step:1});
  folder.addInput(params,'rows',{min:2,max:50,step:1});
  folder.addInput(params,'scaleMin',{min:1,max:70});
  folder.addInput(params,'scaleMax',{min:1,max:70});

  folder = pane.addFolder({title: 'Noise'});
  folder.addInput(params,'freq',{min:-0.01,max:0.01});
  folder.addInput(params,'amplitude',{min:0,max:1})

  folder.addInput(params,'animate'); //por default si no pongo nada es como true or false
  folder.addInput(params,'frame',{min:0,max:999})
}

createPane();

canvasSketch(sketch, settings);
