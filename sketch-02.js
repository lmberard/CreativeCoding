const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ]
};
/*
const degToRad = (degrees) => {
    return degrees / 180*Math.PI;
}

const randomRange = (min, max) => {
    return Math.random() * (max - min)  + min;
}*/

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black';
    
    const cx = width  *0.5;
    const cy = height *0.5;

    const w = width  *0.01;
    const h = height *0.1;

    const num = 40;
    const slice = math.degToRad(360/num);
    const radius = width *0.3;

    let x,y;

    for (let i = 0; i < num; i++) {
        
        const angle = slice * i;
        y = cy + radius * Math.cos(angle);
        x = cx + radius * Math.sin(angle);

        //bloque de transformaciones
        context.save();
            context.translate(x, y);
            context.rotate(-angle);
            context.scale(random.range(1,3),random.range(0.5,1.5));

            context.beginPath();
            context.rect(-w * 0.5, -h * 0.5,w,h);
            context.fill();
        context.restore();


        context.save();
            context.translate(cx,cy);
            //context.translate(x, y);
            context.rotate(-angle);
            //context.scale(random.range(1,3),random.range(1,3));

            context.lineWidth = random.range(5,20);
            context.beginPath();
            context.arc(0,0,radius*random.range(0.7,0.3),-slice*random.range(1,6),slice*random.range(1,6));
            context.stroke();
        context.restore();
    }


  };
};

canvasSketch(sketch, settings);
