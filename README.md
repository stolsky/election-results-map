# Open-Data Election Results
A simple application that visualizes election results and their background information in various ways.

## Usage
When you move the mouse over a region, the corresponding data is displayed in a window.
You can specify which data should be displayed in this window by selecting the appropriate category. Currently there are two categories positioned on the top right of the screen: the voter turnout as "Turnout" and the distance of the election results to each other as "Distance of results".

### Turnout
The voter turnout is visualized with a colored scale representing a turnout between 50 and 90 percent. The colors from red to green are assigned to this interval accordingly.

### Distance of results (Euclidean distance)
The election result of a region is interpreted as a point (or n-tuple with the length of 5 to 6 in our case). This way we can calculate the difference between two results with the Euclidean distance.

## Data used
For this application, the results of the federal elections in Germany are used.
The goal is to test our application with data from 2002, 2005, 2009, 2013, 2017 and 2021.

### Open-Data
* Rostock: https://www.opendata-hro.de/dataset/?groups=politik_wahlen
* Germany (2021): https://www.bundeswahlleiter.de/bundestagswahlen/2021/ergebnisse/opendata.html

### Election results
* Rostock: https://geo.sv.rostock.de/download/opendata/bundestagswahl_2017/bundestagswahl_2017_ergebnisse.json
* Germany (all elections, including all federal states): https://www.bundeswahlleiter.de/dam/jcr/ce2d2b6a-f211-4355-8eea-355c98cd4e47/btw_kerg.zip

### Geo Data
* Rostock districts: https://geo.sv.rostock.de/download/opendata/stadtbereiche/stadtbereiche.json
* Germany (including federal states): https://github.com/isellsoap/deutschlandGeoJSON

### Population structure data
Data on population structure will be included in the future.

* Rostock (2017): https://geo.sv.rostock.de/download/opendata/bevoelkerungsstruktur_2017/bevoelkerungsstruktur_2017_insgesamt.json
* Germany (2017, including all federal states): https://www.bundeswahlleiter.de/dam/jcr/f7566722-a528-4b18-bea3-ea419371e300/btw17_strukturdaten.csv

## Unit tests
We use the assertion library [Unit.js](https://unitjs.com/) in the browser with the test framework [Mocha.js](https://mochajs.org/).
All the tests are stored in the directory "test". To run these tests, execute `test/index.html` in a browser.
