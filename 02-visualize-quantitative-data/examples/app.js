/*global d3*/

// console.log("Hello World")
//use d3 to sort data, map function, dom manipulation
//use p5 to render data

//take advantage of async blocks

(async () => {
    
  
    
    const app = d3.select('#app')
    
    const data = await d3.csv('./data/iris.csv');
//using ./because it's comparing path relative to HTML
    console.log(data);
    
    const max_value=d3.max(data, (d) => {
        return d.petal_length;
    })
    
    console.log("Max Value: ",max_value);

//lambda function d of data, returns 6.9
    

const max_index=d3.maxIndex(data, (d) => {
        return d.petal_length;
    })
    
    console.log("Max Value Index: ",max_index);
    console.log("Max Value Item: ",data[max_index]);
    
    
const sorted_data = d3.groupSort(
    data,
    (g) => d3.median(g, d => d.petal_length),
    (d) => {
        return {
            name: d.species,
            petal_length: d.petal_length
        }
    }
    );
    
    console.log(sorted_data);

//in JS, sorting
//[1,4,3,5].sort((a,b) => a-b)

    const WIDTH = 600;
    const HEIGHT = 300;
//create bins of data
    const bin = d3
                .bin()
                .domain([0,max_value])
                .thresholds(Math.ceil(max_value))//force to always round up
                //.thresholds(max_value)//6.9 Javascript will round up to 7
                .value(d => d.petal_length)
//d => d.petal_length is the accessor
//d3.bin will automatically group into bins
    
    const binned_data = bin(sorted_data);
    
    console.log(binned_data);
    

    
    const svg = d3
    .create('svg')
     .attr('viewBox',[0,0,600,300])
     .style('border','1px solid red')
     .style('display','inline-block')
     
     
     
    const x_scale = d3
        .scaleBand()
        .domain(binned_data.map((d,i) => i)) //input
        .range([0,WIDTH]) //output
    
    // console.log('X Scale @ 2: ', x_scale[2])
    //scaleLinear - continuous
    //scaleBand
    
    const y_scale = d3
        .scaleLinear()
        .domain([0, d3.max(binned_data, (d) => d.length)])
        .range(0,HEIGHT)
        
        
    const color_scale = d3
        .scaleLinear()
        .domain([0, d3.max(binned_data, (d) => d.length)])
        .range([0, d3.max(binned_data, (d) => d.length)])
    
    
    svg
        .append('g')
        .selectAll('rect')
        .data(binned_data)
        .join('rect')
        .attr('fill', (d, i) => color_scale(i))
        .attr('data-value', (d) => d.length)
        .attr('width',() => x_scale.bandwidth())
        .attr('height',(d) => y_scale(d.length))
        .attr('x', (d,i) => x_scale(i))
        .attr('y', (d) => y_scale.range()[0] + y_scale.range()[1] - y_scale(d.length))
        
    app.append(() => svg.node())
    
    
    // let groupped_html = ``;
    


})()



//function expression, not function 
//immediately envokes it after the function
//IEFE immediately envoked function expression

//after IEFE we will have the await option
//loading can cause delay
//