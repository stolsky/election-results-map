
import * as Fetch from "./fetch.js";

Fetch.get_district_borders_from_backup()
    .then(data => document.write(JSON.stringify(data)));
