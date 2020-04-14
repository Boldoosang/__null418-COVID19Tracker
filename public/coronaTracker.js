let stats = "https://pomber.github.io/covid19/timeseries.json";
let countryList = "https://raw.githubusercontent.com/pomber/covid19/master/docs/countries.json";
let countries;
let results;
let selectedCountry;
let selectedCountryCode;
let formattedData = {
    country: 0,
    date: [],
    confirmed: [],
    deaths: [],
    recovered: [],
    piechart: [],
    heatmap: [["Country","Infected"]]
};

let worldResults = [];


let coronaTrackerArea = document.querySelector(".coronaTracker");
let globalDateFormat = {day: '2-digit', month: 'short', year: 'numeric'};

//TESTING
let userSelection = "US";

//GET CORONA RESULTS AND CORONA COUNTRIES
async function getCoronaData(stats, userSelection){
    try {
        let response = await fetch(stats);
        results = await response.json();

        response = await fetch(countryList);
        countries = await response.json();

        //console.log(results);
        //console.log(countries);

        arrangeData(results);
        getWorldData(results, userSelection);

        drawTable(results, userSelection);
        formatData(results, countries, userSelection);
        coronaGraph.update();
        coronaPie.update();
        
    } catch(error) {
        coronaTrackerArea.innerHTML = `<p style="text-align: center; color: white;"><b>No results found!</b></p>`
        console.log(error);
    }
}

//NEEDS TO BE TRIGGERED BY SOMETHING
document.addEventListener("load", getCoronaData(stats, userSelection));

//END GET CORONA RESULTS AND CORONA COUNTRIES

//CORONA RESULT ELEMENTS
let cTableElement = coronaTrackerArea.querySelector(".coronaTableCountry");
let cPieElement = coronaTrackerArea.querySelector(".coronaPieChart");
let cMapWorld = coronaTrackerArea.querySelector(".coronaMapWorld");
let cMapRegion = coronaTrackerArea.querySelector(".coronaMapRegion");
//END CORONA RESULT ELEMENTS

//ARRANGE DATA NEW TO OLD

function arrangeData(results){
    for (let tempCountry in results) 
        results[tempCountry].reverse();
}

//END ARRANGE DATA NEW TO OLD


//GET REGION DATA
function getWorldData(results){
    let total;
    let regionTotalConfirmed = 0;
    let regionTotalDeaths = 0;
    let regionTotalRecovered = 0;

    //Needed a random country to test the end of the array length.
    for(let day = 0; day < results['Trinidad and Tobago'].length; day++){

        regionTotalConfirmed = 0;
        regionTotalDeaths = 0;
        regionTotalRecovered = 0;

        for (let region in results){
            regionTotalConfirmed += results[region][day].confirmed;
            regionTotalDeaths += results[region][day].deaths;
            regionTotalRecovered += results[region][day].recovered;
        }

        let statsObject = {
            date : results['Trinidad and Tobago'][day].date,
            confirmed : regionTotalConfirmed,
            deaths : regionTotalDeaths,
            recovered : regionTotalRecovered
        }

        worldResults.push(statsObject);
    }
}


//END GET REGION DATA

//DRAW TABLE
function drawTable(results, userSelection){
    console.log(`Country: ${userSelection}`);
    console.log(`Date: ${results[userSelection][0].date}`);
    console.log(`Confirmed: ${results[userSelection][0].confirmed}`);
    console.log(`Deaths: ${results[userSelection][0].deaths}`);
    console.log(`Recovered: ${results[userSelection][0].recovered}`);

    cTableElement.innerHTML = '<p>The results of the query are shown below!</p>';
    cTableElement.innerHTML +=
    `
    <h2>${userSelection}</h2>
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

    selectedCountry = results[userSelection];

    let previousDay = 0;

    for(let day = 0; day < selectedCountry.length; day++){
        let dataDate = Date.parse(selectedCountry[day].date);
        let resultDate = new Date(dataDate);

        let displayDate = Intl.DateTimeFormat("en-TT", globalDateFormat).format(resultDate);

        previousDay = {...selectedCountry[day+1]}

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

//END DRAW TABLE

//FORMAT DATA FOR GRAPH
function formatData(results, countries, selectedCountry){
    for(let item in formattedData){
        formattedData['date'].pop();
        formattedData['deaths'].pop();
        formattedData['confirmed'].pop();
        formattedData['recovered'].pop();
        formattedData['piechart'].pop();
    }

    for(let item in results[selectedCountry]){
        let formattedDate = Date.parse(results[selectedCountry][item].date);
        formattedDate = new Intl.DateTimeFormat("en-TT", globalDateFormat).format(formattedDate);

        formattedData['date'].push(formattedDate);
        formattedData['deaths'].push(results[selectedCountry][item].deaths);
        formattedData['confirmed'].push(results[selectedCountry][item].confirmed);
        formattedData['recovered'].push(results[selectedCountry][item].recovered);
        
    }

    let confirmedCases;
    let confirmedCountryCode;
    for (let currentCountry in countries){
        try {
            confirmedCases =  parseInt(results[currentCountry][0].confirmed);
            confirmedCountryCode = countries[currentCountry].code;
        } catch {}

        writeCountryData(currentCountry, confirmedCases, confirmedCountryCode);
    }

    formattedData['piechart'].push(formattedData['confirmed'][0]);
    formattedData['piechart'].push(formattedData['deaths'][0]);
    formattedData['piechart'].push(formattedData['recovered'][0]);

    formattedData.country = selectedCountry;
    selectedCountryCode = countries[userSelection].code;
}

//END FORMAT DATA FOR GRAPH

//WRITE COUNTRY DATA TO ARRAY
function writeCountryData(currentCountry, n, cCode){
    let activeCountry;
    let tempCountryData = [];

    try {
        tempCountryData.pop();
        tempCountryData.pop();

        let tempCode = cCode;
        let tempConfirmed = n;

        tempCountryData[0] = tempCode;
        tempCountryData[1] = tempConfirmed;
        
        if(tempConfirmed !== -1)
            formattedData.heatmap.push(tempCountryData);
    } catch(error) {
        console.log(error);
    }

}
//END WRITE COUNTRY DATA TO ARRAY

//CORONA LINE GRAPH
let coronaGraphContext = document.querySelector('#coronaLineGraph').getContext('2d');
coronaGraphContext.canvas.width = document.documentElement.clientWidth;
coronaGraphContext.canvas.height = document.documentElement.clientHeight;
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
                left: 50,
                right: 10,
                top: 0,
                bottom: 0
            }
        },
        title: {
            display: true,
            text: "CORONA VIRUS STATISTICAL LINE GRAPH",
            fontSize: 36,
            fontColor: "#66FCF1",
            fontFamily:"'Share Tech Mono', monospace"
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
                    min: 0
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
                    reverse: true
                }
            }]
        }
    }
});
//END CORONA LINE GRAPH

//CORONA PIE CHART

let coronaPieContext = document.querySelector('#coronaPieChart').getContext('2d');
coronaPieContext.canvas.width = document.documentElement.clientWidth;
coronaPieContext.canvas.height = document.documentElement.clientHeight;
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
                left: 50,
                right: 10,
                top: 50,
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
        title: {
            display: true,
            text: "CORONA VIRUS STATISTICAL PIE CHART",
            fontSize: 36,
            fontColor: "#66FCF1",
            fontFamily:"'Share Tech Mono', monospace"
        }
    }
});

//END CORONA PIE CHART

//UPDATES GRAPHS AND CHARTS
function updateGraph(){
    coronaPie.update();
    coronaGraph.update();
    drawRegionsMap();
}


//GOOGLE GEO MAPS API
google.charts.load('current', {'packages':['geochart']});
google.charts.setOnLoadCallback(drawRegionsMap);

//DRAW WORLD REGION MAP
function drawRegionsMap() {
    let data = formattedData.heatmap;

    data = google.visualization.arrayToDataTable(data);

    let options = {
        region: selectedCountryCode,
        displayMode: "region"
    };

    let chart = new google.visualization.GeoChart(document.querySelector('.coronaMapRegion'));

    chart.draw(data, options);
    document.querySelector('.coronaMapRegion').style.border = "2px solid black";
    document.querySelector('.coronaMapRegion').style.height = "80vh";
}
//END DRAW WORLD REGION MAP

window.addEventListener("resize", drawRegionsMap);