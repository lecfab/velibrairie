/******************************************************/
/****** Vélib'rairie : analyse de trajets Vélib *******/
/******************************************************/

// repository: https://github.com/lecfab/velibrairie
// utilisation: https://www.velib-metropole.fr/private/account#/my-runs
// text/plain: https://raw.githubusercontent.com/lecfab/velibrairie/main/
// text/javascript: https://cdn.jsdelivr.net/gh/lecfab/velibrairie/
// plotting: https://cdn.plot.ly/plotly-2.9.0.min.js


/******************************************************/
/********** Data format to use it in charts ***********/
/******************************************************/

class Trip {
    /**
     * Transform the parsed trip into a trip object
     * @constructor
     * @param {object} l - Format [(year,month,day,hour,minut), elec, number, speed, (hours,minuts,seconds), price]
     */
    constructor(l) {
        this.date = this.formatDate(l[0]);
        this.elec = this.formatV0elo(l[1]);
        this.number = parseInt(l[2]);
        this.speed = parseFloat(l[3]);
        this.duration = this.formatDuration(l[4]);
        this.price = parseInt(l[5]);
    }

    get year() {
        return this.date.getFullYear();
    }
    get month() {
        return this.date.getMonth() + 1;
    }
    get day() {
        return this.date.getDate();
    }
    get weekday() {
        return (this.date.getDay() + 6) % 7;
    }
    get hour() {
        return this.date.getHours();
    }
    get minute() {
        return this.date.getMinutes();
    }
    get durMinutes() {
        return this.duration[0] * 60 + this.duration[1] + this.duration[2] / 60;
    }

    /**
     * Give the correct format to a duration string
     * @param {string} d - Duration with Velib format: 1h 54min 32sec
     */
    formatDuration(d) {
        d = d.replace(/h /, "-").replace(/min /, "-").replace(/sec /, "").split("-")
        if (d.length == 1) return [0, 0, parseInt(d[0])];
        else if (d.length == 2) return [0, parseInt(d[0]), parseInt(d[1])];
        else return [parseInt(d[0]), parseInt(d[1]), parseInt(d[2])];
    }

    /**
     * Give the correct format to a date string
     * @param {string} d - Date with Velib format: 08/02/2022 - 19:47
     */
    formatDate(d) {
        d = d.split("-");
        let day = d[0].split("/");
        return new Date(`${day[2]}/${day[1]}/${day[0]} ${d[1]}`);
        // let time = d[1].split(":");
        // return [parseInt(day[2]), parseInt(day[1]), parseInt(day[0]), parseInt(time[0]), parseInt(time[1])];
    }

    /**
     * Give the correct format to a velo string
     * @param {string} v - Velo with Velib format: vélo méca
     * @return {number} - 0 for a normal bike, 1 for electric
     */
    formatVelo(v) {
        return v != "vélo méca";
    }
}


/******************************************************/
/******* Extracting the data from the webpage *********/
/******************************************************/

let allTrips = [];

/**
 * Navigation in the website
 */
function goToPageRuns() {
    $(".navbar-item").each(function() {
        if ($(this).html() == "Trajets") $(this).click();
    });
}

function goToPage1() {
    $(".page-item a").each(function() {
        if (parseInt($(this).html()) == 1) this.click(); // no idea it fails with $(this)
    });
}

function goToNextPage() {
    $(".page-link span").each(function() {
        if ($(this).html() == "»") $(this).click();
    });
}

/**
 * Find the number of total pages
 */
function getTotalPages() {
    let items = $(".page-item");
    let n = parseInt($(items[items.length - 3]).find("a").html())
    return n;
}

/**
 * Get the information of the i-th trip of the page
 * @param {number} i - ID of trip in the page
 * @return {object} l - Format [(year,month,day,hour,minut), elec, number, speed, (hours,minuts,seconds), price]
 */
function getTrip(i) {
    let run = $(".runs")[i];
    let date = $(run).find(".operation-date").html();
    let type = $(run).find(".runs-item img").attr("alt");
    let bike = $(run).find(".bike-number span").html().slice(2);
    let speed = $(run).find(".speed").html();
    let duration = $(run).find(".duration").html()
    let price = $(run).find(".runs-item-content .text-center:contains(€)").html().replace(/[^0-9]*([0-9]+)[^0-9]*€.*/, '$1');
    $($(".runs")[i]).html(" ");
    return [date, type, bike, speed, duration, price];
}


/**
 * Get the information of all trips in current page
 */
function getTripInPage() {
    let result = []
    let runs = $(".runs")
    for (let i = 0; i < runs.length; i++) {
        if ($($(".runs")[i]).html() == " " || $($(".runs")[i]).is("#loader")) continue;
        result.push(new Trip(getTrip(i)));
    }
    return result
}

/**
 * Get the information of all trips
 */
function getTripAllPages(p) {
    loaderUpdate(p);
    if (p == 0) return;
    allTrips = allTrips.concat(getTripInPage());
    goToNextPage();

    window.setTimeout(getTripAllPages, 1000, p - 1);
}

function getTripAll() {
    allTrips = [];
    getTripAllPages(getTotalPages());
}



function loaderCreate() {
    // $(".runs").hide(100);
    $(".race-tab").parent().prepend($("<div>", {
        id: "loader",
        class: "runs",
        style: "padding: 30px"
    }).html(`Patience : le script doit encore lire <span>les informations</span> de vos trajets.`))
    $(".race-tab").hide(100);
}

function loaderUpdate(p) {
    if (p == 0) loaderStop();
    else $("#loader span").html(p + (p > 1 ? " pages" : " page"));
}

function loaderStop() {
    goToPage1();
    $("#loader").hide(100);
    $(".race-tab").show(100);
    velibrairiePlot();
}


/******************************************************/
/***************** Plotting functions *****************/
/******************************************************/

let zone;
let params = {
    color1: "#1669A9",
    color2: "#619C2F",
}

function createPlot(name) {
    let id = "#" + name;
    if ($(id).length == 0) {
        $(zone).parent().append($("<div>", {
            id: name,
            class: "plot"
        }));
    }
    return $(id)[0];
}


function mn2str(mn) {
    let str = "";
    if (mn >= 60) {
        let h = parseInt(mn / 60);
        str += h + "h ";
        mn -= 60 * h;
    }
    str += parseInt(mn) + "min";
    mn = mn - parseInt(mn);
    if (mn > 0) {
        str += " " + parseInt(mn * 60) + "sec"
    }
    return str;
}

function capitalFirst(str) {
    return str[0].toUpperCase() + str.slice(1);
}


/*
 * Shows for each weekday the number of trips and time on the bike
 */
function plotTripsPerWeekday() {
    let div = createPlot("plotTripsPerWeekday");
    let x = Array();
    for (let i = 0; i < 7; i++) {
        let date = new Date("2000-01-" + (3 + i)); // this was a Monday
        x.push(capitalFirst(date.toLocaleDateString("fr-FR", {
            weekday: "long"
        })));
    }
    let ts = Array(7).fill(0);
    for (t of allTrips) {
        ts[t.weekday]++;
    }
    let ds = Array(7).fill(0);
    let ds_nice = Array(7).fill(0);
    for (t of allTrips) {
        ds[t.weekday] += (t.durMinutes);
        ds_nice[t.weekday] = mn2str(ds[t.weekday]);
    }

    Plotly.newPlot(div, [{
        name: "Trajets",
        x: x,
        y: ts,
        line: {
            color: params.color1,
            width: 3
        },
        // hovertemplate: "%{yaxis.title.text}: %{y: }<extra></extra>",
        showlegend: false
    }, {
        name: "Durée",
        x: x,
        y: ds,
        text: ds_nice,
        yaxis: 'y2',
        line: {
            color: params.color2,
            width: 3
        },
        hovertemplate: "%{text}",
        showlegend: false
    }], {
        title: 'Utilisation par jour de la semaine',
        xaxis: {
            title: 'Jour de la semaine',
            // showgrid: false,
            zeroline: false
        },
        yaxis: {
            title: 'Nombre de trajets',
            rangemode: "tozero",
            titlefont: {
                color: params.color1
            },
            tickfont: {
                color: params.color1
            },
        },
        yaxis2: {
            title: 'Durée des trajets',
            rangemode: "tozero",
            overlaying: 'y',
            side: 'right',
            titlefont: {
                color: params.color2
            },
            tickfont: {
                color: params.color2
            },
        },
        hovermode: "x",
    });
}

/*
 * Shows for each hour of the day the number of trips and time on the bike
 */
function plotTripsPerHour() {
    let div = createPlot("plotTripsPerHour");
    let ts = Array(25).fill(0);
    for (t of allTrips) {
        ts[t.hour]++;
    }
    let ds = Array(25).fill(0);
    let ds_nice = Array(25).fill(0);
    for (t of allTrips) {
        ds[t.hour] += (t.durMinutes);
        ds_nice[t.hour] = mn2str(ds[t.hour]);
    }
    ts[24] = ts[0];
    ds[24] = ds[0];
    ds_nice[24] = ds_nice[0];

    Plotly.newPlot(div, [{
        name: "Trajets",
        x: [...ts.keys()],
        y: ts,
        line: {
            color: params.color1,
            width: 3
        },
        showlegend: false
    }, {
        name: "Durée",
        x: [...ts.keys()],
        y: ds,
        text: ds_nice,
        yaxis: 'y2',
        line: {
            color: params.color2,
            width: 3
        },
        hovertemplate: "%{text}",
        showlegend: false
    }], {
        title: 'Utilisation par heure de la journée',
        xaxis: {
            title: 'Heure de la journée',
            // showgrid: false,
            zeroline: false
        },
        yaxis: {
            title: 'Nombre de trajets',
            rangemode: "tozero",
            titlefont: {
                color: params.color1
            },
            tickfont: {
                color: params.color1
            },
        },
        yaxis2: {
            title: 'Durée des trajets',
            rangemode: "tozero",
            overlaying: 'y',
            side: 'right',
            titlefont: {
                color: params.color2
            },
            tickfont: {
                color: params.color2
            },
        },
        hovermode: "x",
    });
}



function velibrairiePlot() {
    zone = $(".synthesis-content")[0];
    plotTripsPerWeekday();
    plotTripsPerHour();
}


/******************************************************/
/****************** Execute everything ****************/
/******************************************************/

// Optional: silence errors and warnings in console
console.error = function() {}
console.warn = function() {}

// Load the plotting library (https://plotly.com)
$.getScript("https://cdn.plot.ly/plotly-2.9.0.min.js");

goToPageRuns();
window.setTimeout(loaderCreate, 800);
window.setTimeout(goToPage1, 1000);
window.setTimeout(getTripAll, 2000);
