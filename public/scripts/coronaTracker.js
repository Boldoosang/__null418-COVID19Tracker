/*
INFO 1601
Justin Baldeosingh Corona Tracker
__null418
Made 95% from scratch apart from APIs.
*/
 
//The region map is redrawn each time the user resizes the page.
window.addEventListener("resize", drawRegionsMap);

//Global Variable declaration and initialization.
//Stores the endpoint for which all of the data for the application will be used.
let stats = "https://pomber.github.io/covid19/timeseries.json";
let countryList = "https://raw.githubusercontent.com/pomber/covid19/master/docs/countries.json";
let countries;
let results;
let userSelection;
let selectedCountry;
let selectedCountryCode;

//Creates an object to store the formatted data once it has been parsed for the charts API and maps API.
let formattedData = {
    country: 0,
    date: [],
    confirmed: [],
    deaths: [],
    recovered: [],
    piechart: [],
    heatmap: [["Country","Infected"]]
};

//Gets the div element that will be used to load the visualizers.
let coronaTrackerArea = document.querySelector(".coronaTracker");

//Declares the format in which dates will be stored for the application.
let globalDateFormat = {day: '2-digit', month: 'short', year: 'numeric'};

//Once the javascript file has loaded, draw the map.
load = getCoronaData(stats);


//Triggered when the user hits the submit button and begins the loading of the data with the user's selection.
function getUserSelection(){
    //Gets the value of the list element that has been chosen by the user.
    let sel = document.getElementById("coronaCountry").value;
    userSelection = sel;
    console.log(`User Selected: ${userSelection}`); //Debug

    //Takes the user's selection and begins updating of tables and graphs.
    processSelection(results, userSelection);
}


//Gets the corona results and countries from the URL.
async function getCoronaData(stats){
    //Stores the outcome notifier element.
    let outcomeArea = document.querySelector(".outcome");
    try {
        //Fetches the results remote file from the stats url.
        let response = await fetch(stats);
        //Converts/Parses the file to JSON.
        results = await response.json();

        //Fetches the results remote file from the stats url.
        response = await fetch(countryList);
        //Converts/Parses the file to JSON.
        countries = await response.json();

        //Reorders the data from recent to oldest.
        arrangeData(results);
        //Compiles data from all countries into 1 object and adds the object to the results object array.
        getWorldData(results);

        //Notifies the user that the data was fetched without error.
        outcomeArea.innerHTML = `<p style="text-align: center; color: #00d123;"><b>Data fetched!</b></p>`

        //Makes the submit button clickable.
        document.querySelector("#coronaSubmit-btn").removeAttribute("disabled");
    } catch(error) {
        //If an error has occurred, hide the tracker.
        document.querySelector(".coronaTracker").style.display = "none";
        //Notifies the user that the data was unable to be fetched.
        outcomeArea.innerHTML = `<p style="text-align: center; color: #FFA3A3;"><b>Unable to fetch data from endpoint!</b></p>`
        //Outputs the error to the console.
        console.log(error);
    }
}

//Accepts the results and user's selected country and begins updating the graphs and tables.
function processSelection(results, userSelection){
    //Stores the outcome notifier element.
    let outcomeArea = document.querySelector(".outcome");
    try {
        //Inform the user that the data is being formatted.
        outcomeArea.innerHTML = `<p style="text-align: center; color: #99E689;"><b>Formatting data... please wait.</b></p><br>`
        //Formats the data and updates the tables and graphs.
        formatData(results, countries, userSelection);
        updateGraph();
        //Inform the user that the data is ready to be viewed.
        outcomeArea.innerHTML = `<p style="text-align: center; color: #99E689;"><b>The result of the query is shown below!</b></p><br>
        <p id="mobilePinch" style="text-align: center; color: #F6AB6D;"><b >Mobile web scalability enabled! Pinch to zoom.</b></p><hr class="segmentedGraphs">`;
    } catch(error) {
        //If the country was not in the results list, hide the tracker.
        document.querySelector(".coronaTracker").style.display = "none";
        //Notifies the user that no data was avaialable for the country.
        outcomeArea.innerHTML = `<p style="text-align: center; color: #FFA3A3;"><b>No data on selected country.</b></p>`
        //Outputs the error to the console.
        console.log(error);
    }

}


//Gets the elements that are to be populated upon update.
let cTableElement = coronaTrackerArea.querySelector(".coronaTableCountry");
let cPieElement = coronaTrackerArea.querySelector(".coronaPieChart");
let cMapWorld = coronaTrackerArea.querySelector(".coronaMapWorld");
let cMapRegion = coronaTrackerArea.querySelector(".coronaMapRegion");

//Due to the nature of the endpoint data, it was necessary to reverse the contents to get the order: most recent to most oldest.
function arrangeData(results){
    //For every country in results, reverse the country array.
    for (let tempCountry in results) 
        results[tempCountry].reverse();
}


//Compiles all of the countries data in results, creates a new object and adds the new object to results.
function getWorldData(results){
    //Initializes the totals to 0 and declares the worldResults object with the world array.
    let regionTotalConfirmed = 0;
    let regionTotalDeaths = 0;
    let regionTotalRecovered = 0;
    let worldResults = {World: []};

    //Iterates through all of the days in country results. The country "Trinidad and Tobago" was used as the control value to determine the number of 
    //days data was collected for.
    for(let day = 0; day < results['Trinidad and Tobago'].length; day++){
        //Resets the accumulating value for each country property to 0.
        regionTotalConfirmed = 0;
        regionTotalDeaths = 0;
        regionTotalRecovered = 0;

        //For each country in results, accumulate each property values into a total.
        for (let region in results){
            regionTotalConfirmed += results[region][day].confirmed;
            regionTotalDeaths += results[region][day].deaths;
            regionTotalRecovered += results[region][day].recovered;
        }

        //Creates a new object from the accumulated values. 
        //Trinidad was used as the control to determine the iterating date.
        let statsObject = {
            date : results['Trinidad and Tobago'][day].date,
            confirmed : regionTotalConfirmed,
            deaths : regionTotalDeaths,
            recovered : regionTotalRecovered
        }

        //Pushes the accumulated values for each day into the world array within worldResults.
        worldResults.World.push(statsObject);
    }

    //Adds the worldResults to the results global object.
    Object.assign(results, worldResults);
}


//Draws the table to the div section given the results and the selected country.
function drawTable(results, userSelection){
    // DEBUG PURPOSES
    // console.log(userSelection);
    // console.log(`Country: ${userSelection}`);
    // console.log(`Date: ${results[userSelection][0].date}`);
    // console.log(`Confirmed: ${results[userSelection][0].confirmed}`);
    // console.log(`Deaths: ${results[userSelection][0].deaths}`);
    // console.log(`Recovered: ${results[userSelection][0].recovered}`);

    //Gets the table title element and prints the title of the table.
    let tableTitle = document.querySelector(".tableTitle");
    tableTitle.innerHTML = `<h2>DATA FOR ${userSelection}</h2>`;

    //Prints the headers to the table div.
    cTableElement.innerHTML =
    `
    <hr style="border: 2px solid white;">
    <table class="centered" id="coronaTableHeader">
        <tr>
            <td><b>Date</b></td>
            <td><b>Confirmed</b></td>
            <td><b>Recovered</b></td>
            <td><b>Deaths</b></td>
            <td><b>Increase</b></td>
        </tr>
    </table>
    <hr style="border: 2px solid white;">
    `;

    //Assigns the data of the user's selected country to selectedCountry.
    selectedCountry = results[userSelection];

    //Declares the previous day object.
    let previousDay;

    //Iterates through all of the tracked days for the chosen country.
    for(let day = 0; day < selectedCountry.length; day++){
        //Parses the date from the current date into epoch time.
        let dataDate = Date.parse(selectedCountry[day].date);
        //A new date object is created with the epoch time.
        let resultDate = new Date(dataDate);
        //The date to be displayed in the table is formatted.
        let displayDate = Intl.DateTimeFormat("en-TT", globalDateFormat).format(resultDate);
        //The previous day is stored in the previous day object; The next array location is the previous day (since dates are stored from recent to oldest)
        previousDay = Object.assign({},selectedCountry[day+1])

        //Appends the processed day entry to the table.
        cTableElement.innerHTML += 
        `
        <table class="centered" id="coronaDataTable">
            <tr>
                <td>${displayDate}</td>
                <td>${selectedCountry[day].confirmed}</td>
                <td>${selectedCountry[day].recovered}</td>
                <td>${selectedCountry[day].deaths}</td>
                <td>${selectedCountry[day].confirmed - previousDay.confirmed}</td>
            </tr>
        </table>
        <hr>
        `
    }
}


//Formats the data from the results to match the format required by charts API and maps API.
function formatData(results, countries, selectedCountry){

    //Iterates through the number of days for the selected country in results and pops all of the previous data from the formatted data.
    for(let item = 0; item < results[selectedCountry].length; item++){
        formattedData.date.pop();
        formattedData.deaths.pop();
        formattedData.confirmed.pop();
        formattedData.recovered.pop();
        formattedData.piechart.pop();
    }

    for(let item = 0; item < results[selectedCountry].length; item++){
        formattedData.heatmap.pop();
        formattedData.heatmap.pop();
        formattedData.heatmap.pop();
        formattedData.heatmap.pop();
        formattedData.heatmap.pop();
    }

    formattedData.heatmap.push(["Country","Infected"]);

    //Iterates through all of the days within the selected country, formats the data and pushes the data into the formattedData array.
    for(let item in results[selectedCountry]){
        //Parses and formats the date.
        let formattedDate = Date.parse(results[selectedCountry][item].date);
        formattedDate = new Intl.DateTimeFormat("en-TT", globalDateFormat).format(formattedDate);
        //Pushes the data into the array.
        formattedData['date'].push(formattedDate);
        formattedData['deaths'].push(results[selectedCountry][item].deaths);
        formattedData['confirmed'].push(results[selectedCountry][item].confirmed);
        formattedData['recovered'].push(results[selectedCountry][item].recovered);
    }
    
    let confirmedCases;
    let confirmedCountryCode;

    //Iterates through all of the countries and writes the country data to the formatted data array.
    for (let currentCountry in countries){
        //Try to parse the confirmed cases and country code of the current country.
        try {
            confirmedCases =  parseInt(results[currentCountry][0].confirmed);
            confirmedCountryCode = countries[currentCountry].code;
        } catch(error) {
            //If an error was detected, do nothing.
            void(0);
        }
        //Writes the map data to the formatted data array.
        writeCountryData(confirmedCases, confirmedCountryCode);
    }

    //Pushes the most recent formatted data (as by array location 0), into the formatted pie chart section.
    formattedData['piechart'].push(formattedData['confirmed'][0]);
    formattedData['piechart'].push(formattedData['deaths'][0]);
    formattedData['piechart'].push(formattedData['recovered'][0]);

    //If the selected country is not World, assign the name of the country to formatted data country and the country code to
    //selected country code else assign the country code to "world";
    if(selectedCountry != "World") {
        formattedData.country = selectedCountry;
        selectedCountryCode = countries[userSelection].code;
    } else {
        formattedData.country = "World";
        selectedCountryCode = "world";
    }
}

//Writes the heatmap data to formattedData.
function writeCountryData(n, cCode){
    let tempCountryData = [];

    try {
        //Empties the tempCountryData array.
        tempCountryData.pop();
        tempCountryData.pop();

        //Assigns the data columns to the country code and number of cases.
        tempCountryData[0] = cCode;
        tempCountryData[1] = n;
        
        //If the number of cases is not -1 (No Data), push the data into the formattedData heatmap array.
        if(n !== -1)
            formattedData.heatmap.push(tempCountryData);
    } catch(error) {
        //If an error is encountered, log it.
        console.log(error);
    }

}

//Sets the graphing regions.
let coronaGraphContext = document.querySelector('#coronaLineGraph').getContext('2d');
let coronaPieContext = document.querySelector('#coronaPieChart').getContext('2d');
let mapRegion = document.querySelector('.coronaMapRegion');
mapRegion.style.width = "100%";

//Adjusts the size of the canvas based on device client.
let windowWidth = window.matchMedia("(min-width: 1000px)");


//Uses javascript media queries to adjust size of graphs
function responsiveGraph(){
    windowWidth = window.matchMedia("(min-width: 1000px)");
    
    if(windowWidth.matches){
        coronaGraphContext.canvas.height = document.documentElement.clientHeight/8;
        coronaPieContext.canvas.height = document.documentElement.clientHeight/8;
        mapRegion.style.height = document.documentElement.clientHeight/5;
    } else {
        coronaGraphContext.canvas.height = document.documentElement.clientHeight/3;
        coronaPieContext.canvas.height = document.documentElement.clientHeight/3;
        mapRegion.style.height = document.documentElement.clientHeight/3;
    }
    updateGraph();
    console.log("Yes");
}


parent.addEventListener("resize", responsiveGraph);



//Generates the corona line graph with formatted data.
let coronaGraph = new Chart(coronaGraphContext, {
    type: 'line',
    data: {
        labels: formattedData.date,
        datasets: [{
            label: 'Confirmed Cases',
            data: formattedData.confirmed,
            borderColor:'#EABD3B',
            fill: false,
            lineTension: 0
        },{
            label: 'Recovered',
            data: formattedData.recovered,
            borderColor: '#00CC00',
            fill: false,
            lineTension: 0
        },{
            label: 'Deaths',
            data: formattedData.deaths,
            borderColor: '#C02323',
            fill: false,
            lineTension: 0
        }
    ]},
    options: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        layout: {
            padding: {
                top: 5,
                bottom: 5,
                left: 30,
                right: 5
            }
        },
        legend: {
            labels: {
                fontColor: "#FFFFFF",
                fontFamily:"'Share Tech Mono', monospace",
                fontSize: 18,
            },
        },
        scales: {
            yAxes: [{
                position: "right",
                type: "linear",
                gridLines: {
                    color: "#C5C6C7",
                },
                scaleLabel:{
                    fontColor:"#C5C6C7",
                },
                ticks: {
                    beginAtZero: false,
                    min: 0,
                    fontColor:"#C5C6C7"
                }
            }],
            xAxes: [{
                position: "bottom",
                gridLines: {
                    color: "#C5C6C7",
                },
                scaleLabel:{
                    fontColor:"#C5C6C7",
                },
                ticks: {
                    reverse: true,
                    fontColor:"#C5C6C7"
                }
            }]
        }
    }
});


//Generates the corona pie chart with formatted data.
let coronaPie = new Chart(coronaPieContext, {
    type: 'pie',
    data: {
        datasets: [{
            data: formattedData.piechart,
            backgroundColor : ['#EABD3B','#C02323','#00CC00'],
        }],
        labels: ["Confirmed Cases", "Deaths", "Recovered"],
    },
    options: {
        layout: {
            padding: {
                bottom: 25
            }
        },
        legend: {
            labels: {
                fontColor: "#FFFFFF",
                fontFamily:"'Share Tech Mono', monospace",
                fontSize: 18,
            },
        },
    }
});

//UPDATES GRAPHS AND CHARTS
function updateGraph(){
    //Sets the result area to visible.
    document.querySelector('.coronaTracker').style.display = "block";
    //Draws the table to its corresponding div.
    drawTable(results, userSelection);
    //Updates the corona line graph and corona pie chart.
    coronaPie.update();
    coronaGraph.update();
    //Draws the map to the screen.
    drawRegionsMap();
}


//Loads the geocharts packages required for the map.
google.charts.load('current', {'packages':['geochart']});

//When the charts API is loaded, call the drawRegionsMap function.
google.charts.setOnLoadCallback(drawRegionsMap);

//Selects the graph title element and assigns the title to it.
let graphTitle = document.querySelector(".graphTitle");
graphTitle.innerHTML = `<h2>COVID-19 REGION LINE GRAPH</h2>`;

//Selects the chart title element and assigns the title to it.
let chartTitle = document.querySelector(".chartTitle");
chartTitle.innerHTML = `<h2>COVID-19 REGION PIE CHART</h2>`;

//Draws the region map with the data in formattedData heatmap.
function drawRegionsMap() {
    let data = formattedData.heatmap;
    try {
        //Selects the map title element and prints the title of the map.
        let mapTitle = document.querySelector(".mapTitle");
        mapTitle.innerHTML = `<h2>COVID-19 HEATMAP:<br> ${userSelection}</h2>`;

        //Converts the heatmap data to a data table.
        data = google.visualization.arrayToDataTable(data);
    } catch(error){
        //If an error has occurred, log the error.
        console.log(error);
        console.log("Wrong map selected");
    }

    //General options for map generation.
    let options = {
        region: selectedCountryCode,
        //jQuery query selector used.
        width: $('#coronaMapRegion').width(),
        colorAxis: {colors: ["green","yellow","yellow","red","red","red","red","red","red","red","red","red","red",]},
        displayMode: "region",
        backgroundColor: "#1f2833"
    };

    //Creates a new object chart for coronaMapRegion.
    let chart = new google.visualization.GeoChart(document.querySelector('.coronaMapRegion'));

    //Draws the map with the data and options on the chart object.
    chart.draw(data, options);
}