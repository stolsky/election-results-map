
import * as Fetch from "./fetch.js";

Fetch.get_district_borders()
    .then(data => document.write(JSON.stringify(data)));
