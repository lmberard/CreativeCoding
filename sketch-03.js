const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

//OBJECTS
//settings es un object que solo tiene una property
const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};
//como funca el animate?
/*
const animate = () => {
  console.log('Mensaje para probar');
  requestAnimationFrame(animate);
};
animate();
*/
const sketch = ({ context, width, height }) => {

  const agents = [];

  for (let i = 0; i <40 ; i++){
    const x = random.range(0, width);
    const y = random.range(0, height);
    agents.push(new Agent(x,y))
  }

  //como puse el animate en true se actualiza 60 frames por segundo
  return ({ context, width, height }) => {
    //context es otro object que tiene properties como fillStyle y metodos como fillRect
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    //creo el objeto/clase y lo dibujo 
    /*
    const agentA = new Agent (800,400,10);
    const agentB = new Agent (300,700,10);

    agentA.draw(context);
    agentB.draw(context);
    */

    
    for(let i = 0; i < agents.length; i++) {
      const agent = agents[i];

      if( i % 2) context.strokeStyle = "purple";
        else context.strokeStyle = "pink";

      for(let j = i+1; j <  agents.length; j++){
        const other = agents[j];

        const dist = agent.pos.getDistance(other.pos);

        //if(dist > 200) continue;

        //context.lineWidth = math.mapRange(dist, 0, 200, 12, 1)

        context.beginPath();
        context.moveTo(agent.pos.x,agent.pos.y);
        context.lineTo(other.pos.x,other.pos.y);
        context.stroke();
      }

    }
    agents.forEach(agent => {
      agent.update();
      agent.draw(context);
      agent.bounce(width, height);
      //agent.wrap(width, height);
    })
  };
};

canvasSketch(sketch, settings);

//las clases van al final
class Vector {
  constructor(x,y,radius){
    this.x = x;
    this.y = y;
    this.radius = radius;

  }

  getDistance(v){
    const dx = this.x -v.x;
    const dy = this.y -v.y;

    return Math.sqrt(dx*dx + dy*dy);
    }
}

class Agent {
  constructor(x,y){
    this.pos = new Vector(x,y);
    this.vel = new Vector(random.range(-4,5), random.range(-3,3)); //para la animacion le agrego un parametro que sea la velocidad
    this.radius = random.range(4,12)*2;
  }

  //para la animacion tengo que cambiar la posicion con la velocidad
  update(){
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  //como no saben cual es el limite del rectangulo armo uno para que rebote 
  bounce(width, height){
    if(this.pos.x <= 0 || this.pos.x >= width){
        this.vel.x *= -1;
        //this.radius /= 1.2;
    }
      
    if(this.pos.y <= 0 || this.pos.y >= height){
        //this.radius /= 1.2;
        this.vel.y *= -1;
    }
      
      
  }

      wrap(width, height){
        if(this.pos.x <= 0){
            this.pos.x = width;
            this.vel.x *= -1;
        }
            
        if(this.pos.y <= 0){
            this.pos.y = height;
            this.vel.y *= -1;
        }
            

        if(this.pos.x >= width){
            this.pos.x = 0;
            //this.vel.x *= -1;
        }
            
        if(this.pos.y >= height){
            this.pos.y = 0;
            //this.vel.y *= -1;
        }
            
    }


  draw(context){
      //context.fillStyle = 'black';
      context.lineWidth = 4;
      context.save();
        context.translate(this.pos.x, this.pos.y);
        context.beginPath();
        context.arc(0, 0,this.radius,0,Math.PI *2);
        context.fill();
        context.stroke();
      context.restore();
  }
}