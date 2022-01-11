# Open-Data-Election-Results
A simple Application, which analyzes election results by the populatin of its region.

# General workflow with data files

1. import data from local disk or from web via REST API
2. parse data (into javascript objects to work with)
3. filter and reduce data to necessary parts
   * only need second vote for CDU/CSU, SPD, FDP, Gruene, Linke, AfD
4. examine (reduced) data for missing, wrong attributes and replace them (only the reduced data objects, not the files itself)
   * data qualitiy criteria
5. compare, aggregate the data and prepare for visualization
7. visualize the data

# Tools, Libraries, Frameworks

## Leaflet
[homepage](https://leafletjs.com/)

[documentation](https://leafletjs.com/reference.html)


## UML Diagram Tool
[yEd live](https://www.yworks.com/products/yed-live)

## D3.js
another great tool to visualize data.

[d3.js](https://d3js.org/)

[tutorial](https://wattenberger.com/)
