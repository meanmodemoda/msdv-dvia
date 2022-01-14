/*global d3 */
/*global L*/

async function draw() {

//*************************1. Set up Map & Tile Layer 

// Add watercolor tile
const layerWatercolor = new L.StamenTileLayer("watercolor", {
  noWrap: false, opacity: 0.8});

//Add toner tile
const layerToner = new L.StamenTileLayer("toner", {
  noWrap: false, opacity: 0.8});
  
//Add map  
const map = new L.Map("map", {preferCanvas: true, maxZoom: 13, minZoom: 2, layers: [layerWatercolor, layerToner]}).setView([0,0],2)

//Create overlay map control
const baseMaps = {
  "Toner": layerToner
}

const overlayMaps = {
  "Watercolor": layerWatercolor
}

//Add layers to map
L.control.layers(baseMaps,overlayMaps).addTo(map);

//append/add svg to Leaflet's map
L.svg().addTo(map);   
// L.svg({clickable:true}).addTo(map);   


//*************************2. Draw Canvas

   const wrapper = d3.select("#map").select("svg")
   const bounds = wrapper.append("g")
  
  const tooltip = d3.select("#tooltip")
  
//**************************3. Load Data  

  const dataset = await d3.csv("./all_month.csv",(d) => {
      d3.autoType(d) //time will converted to time format
        return d})
  console.table(dataset[0]) //this is good for csv
        
  const geojson = await d3.json('./world-geojson.json')
  // console.log(geojson[0])
  
//**************************4.Add Country Outline
// Add country borders
  const country_outline = L.geoJSON(geojson, {
        style: function (feature){
            let name = feature.properties.ADMIN
            return {
                color: "white",
                opacity: 0.5,
            }
        }
    })

    country_outline.addTo(map)
    
//**************************5. Create Accessor
    //what if the key is deeply nested
    const latAccessor = d => d.latitude;
    const longAccessor = d => d.longitude;
    const timeAccessor = d => d.time;
    const formatTime = d3.timeFormat("%B %d, %Y");
    const dayAccessor = d => formatTime(d.time);
    const depthAccessor = d => d.depth;
    const magAccessor =d => d.mag;
    
  //   console.log(depthAccessor(dataset[1]))
  
  //Get min and max depth
  // const depthMin = Math.min(...dataset.map(d => d.depth))
  // const depthMax = Math.max(...dataset.map(d => d.depth))   
  // console.log([depthMin,depthMax])
  // [-7.3, 655.67]
  
  
   //Get min and max mag
  // const magMin = Math.min(...dataset.map(d => d.mag))
  // const magMax = Math.max(...dataset.map(d => d.mag))   
  // console.log([magMin,magMax])
// [-1.35, 6.9]

 console.log(dataset.length)
//**************************6. Create Scale  

 const dotScale = d3.scaleSqrt()
        .domain(d3.extent(dataset,depthAccessor))
        .range([1,15])
        
const magColorScale = d3.scaleLinear()
    .domain(d3.extent(dataset,magAccessor))
    .range(["Thistle","OrangeRed"])
    
const magScale = d3.scaleLinear()
    .domain(d3.extent(dataset,magAccessor))
    .range([0,300])

//**************************7. Draw Dots
// Select the svg area and add circles:

const dotChart = bounds.selectAll("circle")
  .data(dataset)
  .join("circle")
  .transition()
  .delay(function(d,i) {return (i * 1)})
  .duration(1000)
  .attr("cx",d => map.latLngToLayerPoint([latAccessor(d),longAccessor(d)]).x)
    .attr("cy",d => map.latLngToLayerPoint([latAccessor(d),longAccessor(d)]).y)
    .attr("r", d => dotScale(depthAccessor(d)))
    .style("fill", d => magColorScale(magAccessor(d)))
    .attr("stroke", "Navy")
    .attr("stroke-width", 0.25)
    .attr("fill-opacity", .8)
    

//***************************8. Draw Tooltip

//***************************9. Draw Interactivity


// Function that update circle position if something change
function update() {
  d3.selectAll("circle")
  .attr("cx",d => map.latLngToLayerPoint([latAccessor(d),longAccessor(d)]).x)
    .attr("cy",d => map.latLngToLayerPoint([latAccessor(d),longAccessor(d)]).y)
}

// If the user change the map (zoom or drag), I update circle position:
map.on("moveend", update)

} draw()
