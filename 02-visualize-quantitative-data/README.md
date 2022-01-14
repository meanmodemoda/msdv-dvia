## Assignment 2 - Visualize Quantitative Data

### Concept

I have always been fascinated by the mystery of time. Thanks to Einstein, we now know time is relative, it might not necessarily travel at the same rate and can bend in space; in our experience, time is fluid, uncertain and perhaps an illusion that is just too real. My visualization is based on these wobbly features of time, as famously depicted by Dali in his melting clock almost a century ago. I use shaky blobs generated using [Polar Perlin Noise Loops](https://thecodingtrain.com/CodingChallenges/136.1-polar-perlin-noise-loops.html) and exaggerated geometry shapes and negative space to symbolize the "passing" of time. I also want to preserve some ability to estimate time through this abstraction.

##
### Sketches and Design

I have gone through three rounds of sketches and settle down on the following ideas:

<img src="/images/Blob-Sketch-01.JPG" width="800" alt="Block Sketch 01">

##

<img src="/images/Blob-Sketch-02.jpg" width="800" alt="Block Sketch 02">

##

<img src="/images/Blob-Sketch-03.jpg" width="800" alt="Block Sketch 03">


#### Hour:

**AM:** A white blob symbolizes day time and its shape expands by day and shrinks by night in the scale of hours. 

**PM:** A blue blob symbolizes night time and its shape shrinks by day and expands by night in the scale of hours.

As the hours run out, the wobbly effect becomes more apparent, so the more unstable a blob is, the smaller it is. 
##
#### Minute:

A half black blob at the right bottom corner symbolizes the total minutes of 60.

A growing white blob on top of it indicates the minute progress. As minute approaching 60, the white blob will overlap the background black blob completely. Additionally, viewers can use the negative space to estimate minutes left from reaching 60.
##
#### Second:

A big yellow circle rotates at the background at the speed of a second hand of an analog clock. A red stroke runs counter clock at the same speed. These contradictory seconds symbolize the contradictory nature of time.
##

### Constraints and Compromises

As seen in my sketches, I initially wanted to create blobs that interact with the canvas frame as well as other blobs - the blobs will squeeze into new organic shapes upon interacting with other elements. Upon research, I realized that the best library to create such effect is using [paper.js](http://paperjs.org/examples/candy-crash/) but the sample code is quite complicated for me to comprehend. I decided to use P5.js as a starter project.

##
### Inspirations & References

- [TED-Ed: Does time exist?](https://www.youtube.com/watch?v=R3tbVHlsKhs)
- [Polar Perlin Noise Loops](https://thecodingtrain.com/CodingChallenges/136.1-polar-perlin-noise-loops.html) by The Code Train
- [Paper.js Candy Crush Demo](http://paperjs.org/examples/candy-crash/)
- [P5.js Blob Demo](https://editor.p5js.org/nyxtom/sketches/o6v7VLZhM)
- Libraries used: p5.js, cash.min.js, time-keeper.js, clock.js