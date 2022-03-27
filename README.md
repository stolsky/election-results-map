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

# General workflow of the Application / Pipeline

## 1) Collection
1. import data from local disk or from web via REST API
   * json and csv files
2. parse data (into javascript objects to work with)

### Problems with CSV
* if table has a more complex header, you have to know the structure
  * for example in "dat/btw2005_kerg.csv" from the 4th column on, all headers are complex
<table>
 <tr><td colspan=4>Partei</td></tr>
 <tr><td colspan=2>Erststimme</td><td colspan=2>Zweitstimme</td></tr>
 <tr><td>Endgültige</td><td>Vorperiode</td><td>Endgültige</td><td>Vorperiode</td></tr>
</table>

### REST API call structure
```
// structure of complete REST API REQUEST:
const rest_api_request = function (query) {
    fetch("https://www.opendata-hro.de/api/action/package_search?q=" + query)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                 // filter ergebnisse und wahlbezirke
                return data.result.results.map(entry => entry.resources.filter(set => set.format.toLowerCase() === "json"));
            }
        });
}
```

## 2) Selection
* filter and reduce data to necessary parts
  * for example: only need second vote for CDU/CSU, SPD, FDP, Gruene, Linke, AfD
* link selected data to representative object property names
  * for example: `city_districts = {borders: dataset1, population: dataset2, votings: dataset3}`

## 3) Analysis (according to Information Quality Criteria)
* search for missing, wrong attributes, values -> names, data types
  
## 4) Adjustments (according to Evaluation and Visualization)
* create identifier if necessary
* replace and unify attribute names
  * use generic names
* add missing attributes, values
* correct wrong data types, precision, etc...
* add dummy value if attribute is necessary else check with hasOwnProperty method
 
## 5) Evaluation
* compare, aggregate the data (prepare for visualization)
* selection, range, data types, names, etc..
 
## 6) Visualization
* visualize the data using certain libraries as d3.js
* integrate data into GUI

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

## Importing CSVs

### via d3.dsv()
* https://www.tutorialsteacher.com/d3js/loading-data-from-file-in-d3js#d3.csv
* https://gist.github.com/jfreels/6814721
* https://d3-wiki.readthedocs.io/zh_CN/master/CSV/

### via Papa.parse()
* https://www.papaparse.com/
* https://www.papaparse.com/docs