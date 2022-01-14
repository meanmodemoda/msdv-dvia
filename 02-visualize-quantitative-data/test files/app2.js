/* global d3*/
//install npm install @observablehq/stdlib

async function draw () {

//---------------------Load and Prepare Data


const dataset = await d3.csv("../data/nyc_pollutants_pm25_borough.csv",(d) => {
   
    return {
      year : +d.year,
      borough: d.borough,
      num: +d.num
    //num outputs in numerical value
    }

  })


console.log("Review `dataset` format", dataset)

  
//Sort data by value `num`, and then by `year` 
dataset.sort((a, b) => b.num - a.num)
dataset.sort((a, b) => b.year - a.year)

//----------------------Create Accessors
//Return `d.year` in time `year` format
const parseYear=d3.timeParse("%Y")

//Pass `d.year` value to xAccessor
const xAccessor = d => parseYear(d.year)
//Pass `d.num` value to yAccessor
const yAccessor = d => d.num;
//Test in console
console.log("Review xAccessor",xAccessor(dataset[0]))

// //Group data by `neighborhood` and save to a different variable `sumstat`
const sumstat = d3.group(dataset, d => d.borough)
            
// //Test in console
console.log("Review `sumstat` format", sumstat)
console.log("xAccessor first",xAccessor(dataset[0]))

// //-----------------------Create Dimensions

let dimensions = {
    width: 1000,
    height: 600,
    leftMargin: 150,
    rightMargin: 300,
    topMargin: 20,
    bottomMargin: 100
};


dimensions.ctrWidth = dimensions.width - dimensions.leftMargin - dimensions.rightMargin;
dimensions.ctrHeight = dimensions.height - dimensions.topMargin - dimensions.bottomMargin;



// //-----------------------Create container `ctr`

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)
    //.attr('viewBox', [0, 0, 600, 300])

const ctr = svg.append("g")
    .attr("transform", `translate(${dimensions.leftMargin},${dimensions.topMargin})`
        )


// //----------------------Draw Tooltips and Dots

// // I couldn't get the interactive tooltips to work, but will revisit

const tooltip = d3.select("#tooltip")

const tooltipDot = ctr.append('g')
    .data(dataset)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("fill","#fc8781")
    .attr("stroke","black")
    .attr("stroke-width",2)
    .style("opacity",0)
// //do not cancel event when hover over
    .style("pointer-events","none")
    
    
// //------------------------Draw Scales

const xScale =d3.scaleTime()

//avoid using scaleUtc with .nice(), which results in end tick going out of range
    .domain(d3.extent(dataset,xAccessor))
    .range([0,dimensions.ctrWidth])
    .nice()

const yScale =d3.scaleLinear()

//Hardcoded the domain range for display aesthetics 
    .domain([0, 20])
    .range([dimensions.ctrHeight,dimensions.topMargin])
    .nice()
    
    
// //-----------------Draw Color Scale

const colorScale = d3.scaleOrdinal()
    .range(['#7C5659','#657C47','#49A558','#8BB152','#CACB64'])
    


// //----------------Draw PM 2.5 Guideline 

// //For proper layering this section needs to be drawn before the lines

// //12.1 is the dividing value between healthy vs moderate
const yPos = yScale(12.1) 

console.log("Return healthy/moderate value divider", yPos)

const pmGuide = ctr.append("line")
    .attr('x1', 0)
    .attr('y1', yPos)
    .attr('x2',dimensions.ctrWidth)
    .attr('y2', yPos)
    .attr('stroke','black')
    .style("stroke-dasharray", ("3,3"))


// //-----------------Draw PM 2.5 Guideline Colorblock

// //----Moderate Block

ctr.append("rect")
    .classed("moderate",true)
    .attr("x",0)
    .attr("y",dimensions.topMargin)
    .attr("width",dimensions.ctrWidth)
    .attr("height",yPos-dimensions.topMargin)
    .attr("fill","#C2BBB4")
    .style("opacity",0.5)
    
// //----Healthy Block
    
ctr.append("rect")
    .classed("healthy",true)
    .attr("x",0)
    .attr("y",yPos)
    .attr("width",dimensions.ctrWidth)
    .attr("height",dimensions.ctrHeight-yPos)
    .attr("fill","#E7EDD1")
    .style("opacity",0.5)
    
    
// //----------------Draw PM 2.5 Guideline Legend

// //If I have more time, I would code this section more efficiently into a table format

// //---Unhealthy Level 
    ctr.append("g")
    .classed('guide', true)
 
    .append("rect")
    .attr("x", dimensions.ctrWidth + 60)
      .attr('y', 50)
      .attr('width', 20)
      .attr('height', 40)
    .attr('fill', '#785E57')
    .style("opacity", 0.75)
     
    ctr.append("text")
    .attr("x", dimensions.ctrWidth + 90)
    .attr("y", 62)
    .text("35.5+ : Unhealthy")
    .style("font-family", "Arial Black")
    .style("font-size", 12)
 
// //---Moderate Level    
    ctr.append("rect")
    .attr("x", dimensions.ctrWidth + 60)
      .attr('y', 90)
      .attr('width', 20)
      .attr('height', 46)
    .attr('fill', '#C2BBB4')
    .style("opacity", 0.75)
    
  ctr.append("text")
    .attr("x", dimensions.ctrWidth + 90)
    .attr("y", 102)
    .text("12.1 - 35.4: Moderate")
    .style("font-family", "Arial Black")
    .style("font-size", 12)
    
     
// //-----Healthy Level    
    ctr.append("rect")
    .attr("x", dimensions.ctrWidth + 60)
      .attr('y', 136)
      .attr('width', 20)
      .attr('height', 24)
    .attr('fill', '#E7EDD1')
    .style("opacity", 0.75)
     
    ctr.append("text")
    .attr("x", dimensions.ctrWidth + 90)
    .attr("y", 148)
    .text("0 - 12.0: Healthy")
    .style("font-family", "Arial Black")
    .style("font-size", 12)

// //-----------------Draw Multiple Lines

const lineGenerator = d3.line()
    .x(d => xScale(xAccessor(d)))
    .y(d => yScale(yAccessor(d)))
    // .curve(d3.curveCardinal)
    
    
ctr.selectAll("path")
    .data(sumstat)
    .join("path")
    .classed("line",true)
    .attr("d", d => lineGenerator(d[1]))
    .attr("fill", "none")
    .attr("stroke", d => colorScale(d[0]))
    .attr("stroke-width", 2)

        
// //----------------------Draw Axis

const yAxis = d3.axisLeft(yScale)
    .tickFormat((d) => `${d}`)
  
  ctr.append("g")
    .classed("axis",true)
  .style('transform', `translateX(${dimensions.margin}px)`)
    .call(yAxis)
    
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", "-180")
    .attr("y", "-40")
    .attr("text-anchor", "end")
    .text("PM 2.5 Value (Yearly Average)")
    .style("fill", "black")
    .style("font-family", "Arial Black")
    .style("font-size", 12)

const xAxis = d3.axisBottom(xScale)

    ctr.append("g")
    .classed("axis",true)
    .style("transform", `translateY(${dimensions.ctrHeight}px)`)
    .call(xAxis)
    .append("text")
    .attr("x", dimensions.ctrWidth/2)  
    .attr("y", "40") // a little bit below xAxis
    .text("Year")
    .style("fill", "black")
    .style("font-family", "Arial Black")
    .style("font-size", 12)

// // ---------------------Draw Dots on Line

ctr.selectAll("circle")
    .append("g")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("r", 3)
    .attr("cx", d => xScale(xAccessor(d)))
    .attr("cy", d => yScale(yAccessor(d)))
    .style("fill", d => colorScale(d))
    

// //------------------Draw Borough Legend

    
const  legend = ctr.selectAll('g .legend')
    .data(sumstat)
    .enter()
    .append("g")
    .classed('legend', true)

legend.append("circle")
    .attr("cx", dimensions.ctrWidth + 70)
    .attr('cy', (d, i) => i * 20 + 375)
    .attr("r", 4)
    .style("fill", d => colorScale(d[0]))
    
legend.append("text")
    .attr("x", dimensions.ctrWidth + 85)
    .attr("y", (d, i) => i * 20 +380)
    .text(d => d[0])
    .style("fill", "black")
    .style("font-family", "Arial Black")
    .style("font-size", 12)

// //------------------Append source

ctr.append("text")
    .attr("x", -50)
    .attr("y", dimensions.ctrHeight +70)
    .html('Source: <a href="https://data.cityofnewyork.us/Environment/Air-Quality/c3uy-2p5r" target="_blank" rel="noopener">NYC OpenData</a>')
    .style("fill", "black")
    .style("text-decoration","underline")
    .style("font-size", 12)
    .style("font-family", "Noto Sans Display")
    .style("font-weight","bold")

     
// //------------------Draw Title
    
    ctr.append("text")
    .attr("x", dimensions.ctrWidth/2+50)
    .attr("y", dimensions.topMargin-20)
    .attr("text-anchor", "middle")
    .text("NYC Air Quality by Borough Over Time (2009 - 2018)")
    .style("fill", "black")
    .style("font-size", 14)
    .style("font-family", "Arial Black")
    .raise()
    
    
// //-----------------------Draw Interactive Tooltip

// //This section didn't work, and will revisit

  ctr.append('rect')
    .attr('width', dimensions.ctrWidth)
    .attr('height', dimensions.ctrHeight)
    .style('opacity', 0)
    .on('touchmouse mousemove', function (event) {
      
      const mousePos = d3.pointer(event, this)
        const year= xScale.invert(mousePos[0]) //invert revert back to dataset value
      //Custom Bisector - left lowest, center, right properties
    //bisect can only compare numbers can't compare dates or objects
      const bisector = d3.bisector( d => d.year ).left
     
      const index = bisector(sumstat, year)
    //   const index = bisector(dataset, year)

    console.log("Test bisector",index)
    
// //       const mouseValue = dataset[index - 1]
      


// // // //-------Update Image

// // //       tooltipDot.style('opacity', 1)
// // //         .attr('cx', xScale(xAccessor(year)))
// // //         .attr('cy', yScale(yAccessor(year)))
// // //         .raise()//push shape to front of image

// //     //   tooltip.style('display', 'block')
// //     //     .style('top', yScale(yAccessor(mouseValue)) - 20 + 'px')
// //     //     .style('left', xScale(xAccessor(mouseValue) + 'px')

// //     //   tooltip.select('.num')
// //     //     .text(`$${yAccessor(mouseValue)}`)

// //     //   const dateFormatter = d3.timeFormat('%Y')

// //     //   tooltip.select('.year')
// //     //     .text(`${dateFormatter(xAccessor(mouseValue))}`)

    }) 
    
// //   listen multiple events
    // .on('mouseleave', function (event) {
    //   tooltipDot.style('opacity', 0)
    //   tooltip.style('display', 'none')
    // })
    
}

draw()