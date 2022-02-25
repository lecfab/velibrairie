// https://www.velib-metropole.fr/private/account#/my-runs

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
        result.push(new Trip(get_trip(i)));
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

function velibrarieScrap() {
    // Optional: silence errors and warnings in console
    console.error = function() {}
    console.warn = function() {}

    goToPageRuns();
    window.setTimeout(loaderCreate, 800);
    window.setTimeout(goToPage1, 1000);
    window.setTimeout(getTripAll, 2000);
}
