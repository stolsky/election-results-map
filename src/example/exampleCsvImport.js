/* One possible way for handling keys in map --> make theme enum values */
const COLUMN = Object.freeze({
    VOTER_NUM: "Anzahl abgegebener Stimmzettel",
    CDU: "Wahlergebnis der CDU"
});

function example1_get_csv() {
    console.log("enter example 1");

    let myResult = [];

    //1) for semicolon seperated values
    d3.dsv(";","src/example/example1.csv").then(function(data) {
        _retrieveCsvData(data, myResult);
        // return myResult;
    });
    return myResult;
}

function _retrieveCsvData(data, result){
    console.log("data",data);
    console.log("data",data.columns);
    for(var i = 0; i < data.length; i++) { /* Iterates through all rows */
        console.log(data[i]);
        let importedCustomRow = new Map();
        for (var j = 0; j < data.columns.length; j++) { /* Iterates through columns of row */
            let keyString = data.columns[j]; //object or just use primitive?
            if(i == 0) {
                console.log(keyString);
                let myValue = data[i].keyString; // --> that returns undef. WHY??? 
                // console.log("Returned Value through directly passing key in code",myValue);
                let mySuperString = "data[" + i + "]." + keyString;
                console.log(mySuperString);
                try {
                    let mySuperResult = eval(mySuperString); // really bad practice, surely there is cleaner way?
                    console.log(mySuperResult);
                } catch (error) {
                    console.log(error);
                    /* Fehler festgestellt für: 
                    "Wahlbezirke insg.", "erf. Wahlbezirke", "Erst-/Zweitstimme", "ungueltige Stimmen", "gueltige Stimmen", "Grüne"
                    */
                }
            }
            try {
                switch (keyString) {
                case 'Waehler':
                    // the point is to give consistent key values for all data sets
                    importedCustomRow.set(COLUMN.VOTER_NUM, eval("data[" + i + "]." + keyString));
                    break;
                case 'CDU':
                    importedCustomRow.set(COLUMN.CDU, eval("data[" + i + "]." + keyString));
                    break;
                // and so on... 
                default:
                    //with real data the default action would be to add nothing, maybe give loggging message.
                    importedCustomRow.set(keyString, eval("data[" + i + "]." + keyString));
                }
            } catch (error) {
                // console.log(error);
                importedCustomRow.set(keyString, "FEHLER!");
            }
        }
        result[result.length] = importedCustomRow;
    }
    console.log("das zurückgegebene result objekt",result);
}

export {
    example1_get_csv
}