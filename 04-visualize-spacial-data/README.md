## Assignment 4 - Visualize Geospecial Data

Use `Leaflet` to illustrate most recent earthquakaes using  GeoJSON data from [USGS Earthquake Harzard Program](https://earthquake.usgs.gov/earthquakes/feed/v1.0/csv.php).

I layered Stamen tiles `Toner` with `Watercolor` and used `d3.js` to plot out last 30-earthquakes. Lots of improvement need to be done such as transform the bubble display positions which currently all start from the top left corner.

I also ran into issue displaying tooltips. In retrospect, I should have used `Leaflet`'s built in tooltip.