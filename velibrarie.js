let projectUrl = "https://github.com/lecfab/velibrairie/script/";

function load_script(url) {
    $("head").append($("script", {
        type: "text/javascript",
        url: url
    }));
}

// Load the plotting library (https://plotly.com)
load_script("https://cdn.plot.ly/plotly-2.9.0.min.js");

// This file extracts the data from the webpage
load_script(projectUrl + "scrapper.js");

// This file formats the data to use it in charts
load_script(projectUrl + "classTrip.js");

// This file plots the charts
load_script(projectUrl + "plots.js");

// Let's go!
velibrarieScrap();
