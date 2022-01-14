/*global p5 */
//I tried to create a class but some of the functions require quite complicated nested conditional statements
//to play it safe, I still used the class but coded it in a way that was more repetatively than I wished.

let blobAM;
let blobPM;
let blobMinCap;
let blobMin;
let discrete = false;



function setup() {
  createCanvas(600, 600);
  
  //r1,r2,r,g,b r1 and r2 are ratio knobs controlling the upper and lower bounds of noise output
  blobAM = new Blob(10,300,255,255,255);
  blobPM = new Blob(10,300,0,51,204);//klein blue
  blobMinCap = new Blob(80,130,0,0,0);
  blobMin = new Blob(1.8,2,255,255,255);
}

//initialize noise parameters
var inc = 0.001;
var zoff = 0;

function draw() {

  background(255);
  colorMode(RGB);  
  frameRate(60);

 let now=clock(); 
//create time based angles
 let sAngle = (now.progress.min * TWO_PI) - HALF_PI
 let mAngle = (now.progress.hour * TWO_PI) - HALF_PI
 let hAngle = (now.progress.halfday * TWO_PI) - HALF_PI
 if (discrete){
    // L[inearly] [int]ERP[olate] from the current fraction of a minute to a
    // proportional value in the range 0–2π (for a 'ticking' effect)
    sAngle = lerp(0, TWO_PI, now.sec/60) - HALF_PI
  }
  
 //red stroke resembles a second hand of an analog clock (counterclock)
  push();
  stroke(224,0,0);
  fill(224,0,0);
  strokeWeight(600)
  line(200,500, 400+cos(sAngle)*500, 400-sin(sAngle)*500);
  pop();
  
  
  //yellow circle resembles a second hand of an analog clock
  push();
  stroke(254,221,0);
  fill(254,221,0);
  strokeWeight(random(5,10))
  circle(300+cos(sAngle)*300, 400+sin(sAngle)*300,900);
  pop();
   
  
  //pm hour 
  push();
  translate(450,450);
  translate(p5.Vector.fromAngle(millis() / 1000, 100))
  blobPM.pmBlob();
  pop();
  
  //am hour
  push();
  translate(150,150);
  translate(p5.Vector.fromAngle(millis() / 1000, 30))
  blobAM.amBlob();
  pop();
  
  //Full 60 minute indicator
  push();
  translate(580,600);
  blobMinCap.minCap();
  pop();
  
  //minute progress indicator
 push();
  translate(580,600);
  blobMin.minBlob();
  pop();
  
  
}


//create Blob class
class Blob {
  
  constructor(r1,r2,cr,cg,cb) {
    this.r1=r1;
    this.r2 =r2;
    this.cr =cr;
    this.cg = cg;
    this.cb = cb;
  }
  
 
  amBlob() {
    //this function shows the progress of hours visualized in a white blob with black stroke. 
    //Earlier in the day the white blob grows bigger, and starts shrinking when night approaches.
    //the white blob is put side by side with a pm blue blob. By comparing the relative sizes of the blobs,
    //viewers can estimate the hours of the day. 
    
      let noiseMax = 0.4;
      //if fill is white stroke black, else stroke fill color
      let updateStroke;
      let now = clock();
      let rSize =now.hours;
      
      if (this.cr==255 && this.cg==255 && this.cb==255) {
        updateStroke=stroke(0,0,0);
        strokeWeight(5);
      } else {
        updateStroke = stroke(this.cr,this.cg,this.cb,80);
        strokeWeight(5);
      } 
       
        beginShape();
        colorMode(RGB);
        updateStroke;
        fill(this.cr,this.cg,this.cb);
        for (let a = 0; a <= TWO_PI; a += inc) {
          let xoff = map(cos(a), -1, 1, 0, noiseMax);
          let yoff = map(sin(a), -1, 1, 0, noiseMax);
          let r = map(noise(xoff, yoff, zoff), 0, 1, (24-rSize)*this.r1, this.r2);
          let x = r * cos(a);
          let y = r * sin(a);
        
          vertex(x, y);
        }
        endShape(CLOSE);
        
        zoff += 0.005;
    
  }
  
  
    pmBlob() {
    //this function shows the progress of hours visualized in a blue blob. 
    //When deep into the night, the blue blob grows bigger, during the day the blue blob is shrinking. 
      let noiseMax = 0.4;
      let updateStroke;
      let now = clock();
      let rSize =now.hours;
      
      if (this.cr==255 && this.cg==255 && this.cb==255) {
        updateStroke=stroke(0,0,0);
        strokeWeight(5);
      } else {
        updateStroke = stroke(this.cr,this.cg,this.cb);
        strokeWeight(10);
      } 
       
       
        beginShape();
        colorMode(RGB);
        updateStroke;
        fill(this.cr,this.cg,this.cb);
        // translate(300,300);
        for (let a = 0; a <= TWO_PI; a += inc) {
          let xoff = map(cos(a), -1, 1, 0, noiseMax);
          let yoff = map(sin(a), -1, 1, 0, noiseMax);
          let r = map(noise(xoff, yoff, zoff), 0, 1, rSize*this.r1, this.r2);
          let x = r * cos(a);
          let y = r * sin(a);
        
          vertex(x, y);
        }
        endShape(CLOSE);
      
        
        zoff += 0.005;
  
  }
  
  
  minCap() {
  //this function caps the size of minute and uses negative space to show minute progress  
    let noiseMax = 0.4;
    let updateStroke;
    let now = clock();
    let rSize =now.min;
    
    // console.log(rSize);
    
    if (this.cr==255 && this.cg==255 && this.cb==255) {
      noStroke();
    } else {
      updateStroke = stroke(this.cr,this.cg,this.cb);
      strokeWeight(10);
    } 
     
     
      beginShape();
      colorMode(RGB);
      updateStroke;
      fill(this.cr,this.cg,this.cb);
      for (let a = 0; a <= TWO_PI; a += inc) {
        let xoff = map(cos(a), -1, 1, 0, noiseMax);
        let yoff = map(sin(a), -1, 1, 0, noiseMax);
        let r = map(noise(xoff, yoff, zoff), 0, 1, this.r1, this.r2);
        let x = r * cos(a);
        let y = r * sin(a);
      
        vertex(x, y);
      }
      endShape(CLOSE);
    
      
      zoff += 0.005;
  
  }
  
   minBlob() {
  //this function shows a growing blob by minutes passed. 
  //By reaching 60 minutes,`minBlob` should overlap `minCap`.
  //By gauging the negative space, viewers can estimate the minute. 
  
    let noiseMax = 0.4;
  
    let updateStroke;
    let now = clock();
    let rSize =now.min;
    
    // console.log(rSize);
    
    if (this.cr==255 && this.cg==255 && this.cb==255) {
      noStroke();
    } else {
      updateStroke = stroke(this.cr,this.cg,this.cb);
      strokeWeight(10);
    } 
     
    
      beginShape();
      colorMode(RGB);
      updateStroke;
      fill(this.cr,this.cg,this.cb);
      for (let a = 0; a <= TWO_PI; a += inc) {
        let xoff = map(cos(a), -1, 1, 0, noiseMax);
        let yoff = map(sin(a), -1, 1, 0, noiseMax);
        let r = map(noise(xoff, yoff, zoff), 0, 1, this.r1*rSize, this.r2*rSize);
        let x = r * cos(a);
        let y = r * sin(a);
      
        vertex(x, y);
      }
      endShape(CLOSE);
    
      
      zoff += 0.005;
  
  }
}



