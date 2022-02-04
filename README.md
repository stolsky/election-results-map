# Open-Data-Election-Results
A simple Application, which analyzes election results by the populatin of its region.

# Development
1. define personas to create user stories in the form of `As <persona>, I want <goal>, so that <reason>.`
   * personas: App Provider, App User
   * Example: As an <App Provider>, I want to 
     * collect specific election results of Rostock and its districts to compare these result
     * collect additional election results of election district II, Mecklenburg-Vorpommern and Germany so I can compare these results
     * check if these election results satisfy certain data quality criteria, so I am sure to work with the most correct data
     * accumulate, process, … the data, so I can make the comparison 
2. define acceptance criteria for user stories
3. plan development according to user stories: what do we want to achieve and how
4. create iterations and its tasks
5. for each task create a new branch

# General workflow of the Application

## 1) Data Collection
1. import data from local disk or from web via REST API
2. parse data (into javascript objects to work with)
3. filter and reduce data to necessary parts
   * only need second vote for CDU/CSU, SPD, FDP, Gruene, Linke, AfD

## 2) Data Processing
4. analyzation (examine [reduced] data)
   * for missing, wrong attributes, values -> names, data types, 
5. preparation (adjust data)
   * create identifies if necessary
   * unify attribute names
   * add/change missing attributes, values, wrong data types, precision, etc...
   * add dummy value if attribute is necessary else check with hasOwnProperty method
6. evaluate data
   * compare, aggregate the data (prepare for visualization)
   * selection, range, data types, names, etc..
## 3) Data Visualization
7. visualize the data using certain libraries as d3.js and leaflet
8. integrate data into GUI

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
