

// use colors     	FF9933	003399	99CCCC	CCCCCC
// https://www.colorcombos.com/color-schemes/89/ColorCombo89.html

import * as Loader from "./loaders.js";
import {Application} from "../lib/jst/dom/application.js";
import {Container} from "../lib/jst/dom/container.js";
import {TextComponent} from "../lib/jst/dom/textcomponent.js";

// const hasProperty = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

// Fetch.get_electoral_borders_from_backup(2002, 2005, 2009, 2013, 2017, 2021)
//     .then(data => data);

const app = new Application("Open Data Election");
const title_container = new Container("TitleContainer");
const title = new TextComponent("Wahlergebnisse", "Title");
const description = new TextComponent("Visuelle Darstellung der Wahlergebnisse 2005", "Description");
title_container.append(title, description);
const map_container = new Container("MapContainer Maximize");
map_container.setAttribute("id", "MapContainer");
const menu = new Container("Menu");
app.getRootPane().append(map_container, title_container, menu);
