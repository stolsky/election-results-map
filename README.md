# Submission ToDo List
* all documents and complete runnabel software on **USB** stick
* software test functionality on
  * edge
  * chrome
  * firefox
* what to submit
  * complete runnabel software
  * UML Klassendiagramm
  * Source Code (not necessary because JavaScript is interpreter langauge -> make notes about this)
  * Manual of software functionality
  * Unittests
    * Manual how to run those tests
    * source code of tests -> folder "tests" 


# Open-Data-Election-Results
A simple Application, which analyzes election results by the populatin of its region.

# Development
1. define personas to create user stories in the form of `As <persona>, I want <goal>, so that <reason>.`
   * personas: App Provider, App User
   * Example: As an "App Provider", I want to 
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

# Tools, Libraries, Frameworks
  
* https://www.statistikportal.de/de/datenbanken
* https://rathaus.rostock.de/Statistik/Stadtbereichskatalog/atlas.html
* http://opendatalab.de/projects/geojson-utilities/
* https://gdz.bkg.bund.de/index.php/default/open-data.html
* https://data.opendatasoft.com/api/v2/console
* https://regionalatlas.statistikportal.de/#

### Color mixing information

* https://github.com/ProfJski/ArtColors
* https://www.colorcombos.com/color-schemes/89/ColorCombo89.html
  * use colors: FF9933, 003399, 99CCCC, CCCCCC ?

~~## Leaflet~~
~~[homepage](https://leafletjs.com/)~~

~~[documentation](https://leafletjs.com/reference.html)~~

## UML Diagram Tool
[yEd live](https://www.yworks.com/products/yed-live)

## D3.js
another great tool to visualize data.

[d3.js](https://d3js.org/)
  
[API](https://github.com/d3/d3/blob/main/API.md)
  
[examples](https://www.d3-graph-gallery.com/index.html)
  
[tutorial](https://wattenberger.com/)
