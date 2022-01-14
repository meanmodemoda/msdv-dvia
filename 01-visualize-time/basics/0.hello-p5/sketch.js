/* global p5 */

function setup() {
  createCanvas(600, 600); // set the size of the canvas
  background(255) // fill the canvas with black pixels
  print("Hello, javascript console.")
  print(`The P5 canvas is ${width}px wide and ${height}px tall`)

  // display out greeting message in medium grey
  fill(127) // grey value between 0–255
  textSize(60) // size in pixels
  text("Hello P5 👋", 90, height/2+10) // (message, x, y)

  // pick a light grey fill and bright red stroke to draw shapes with
  fill(200)         // a single value is greyscale
  stroke(200, 0, 0) // three values are red/green/blue
  strokeWeight(4)   // line weight in pixels

  // draw three shapes
  square(560, 560, 40) // (x, y, side length) to get the corner square x=600-40, y=600-40
  circle(20,20, 40)
  circle(0, 0, 40) // (x, y, diameter) it means x,y is the center, for radius diameter/2
  
  //arc (x, y, w, h, start, stop, [mode],[detail])
  arc(100,100,100,100, 0, PI); 
  arc(200,100,100,100,-PI, PI); 
  arc(300,100,100,100,-PI, 0); 
  arc(400,100,100,100, HALF_PI, -HALF_PI); 
  arc(450,100,100,100, -HALF_PI, HALF_PI); 
  arc(550,100, 100, 100, 0, PI+HALF_PI);


  arc(100, 200, 100, 100, -PI, -HALF_PI);
  fill(120)
  arc(100, 200, 100, 100, -HALF_PI, 0);
  fill(170)
  arc(100, 200, 100, 100, 0, HALF_PI);
  fill(50)
  arc(100, 200, 100, 100, HALF_PI, -PI);
  

  fill(200)
  arc(100,300, 100, 100, 0, PI+QUARTER_PI);
  arc(200,300, 100, 100, HALF_PI, QUARTER_PI-HALF_PI);
  arc(300,300,100,100, -PI, PI-QUARTER_PI,CHORD);
  arc(400,300,100,100, -PI, PI-QUARTER_PI,PIE);
  
  //real arc starts
  arc(100,500,150,100, 0, PI); 
  arc(200,500,100,200, PI, 0);
  arc(300,500,150,100, -PI, PI-QUARTER_PI);
  
  
}
//https://p5js.org/reference/#/p5/arc
