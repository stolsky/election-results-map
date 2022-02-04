
// use colors     	FF9933	003399	99CCCC	CCCCCC
// https://www.colorcombos.com/color-schemes/89/ColorCombo89.html



// // const hasProperty = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

// // Fetch.get_electoral_borders_from_backup(2002, 2005, 2009, 2013, 2017, 2021)
// //     .then(data => data);

import {get_data, QUERY_TYPE} from "./data/import.js";
import {visualize} from "./gui/visualize.js";

get_data(2005, QUERY_TYPE.BACKUP)
// const results = analyze(data);
// adjust(data, results, ...parameters);
// const evaluation = evaluate(data, ...parameters);
.then(results => visualize(results, {}));
