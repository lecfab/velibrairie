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
    for (t of all_trips) {
        ts[t.weekday]++;
    }
    let ds = Array(7).fill(0);
    let ds_nice = Array(7).fill(0);
    for (t of all_trips) {
        ds[t.weekday] += (t.dur_mn);
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
    for (t of all_trips) {
        ts[t.hour]++;
    }
    let ds = Array(25).fill(0);
    let ds_nice = Array(25).fill(0);
    for (t of all_trips) {
        ds[t.hour] += (t.dur_mn);
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
