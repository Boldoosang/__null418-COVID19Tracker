let stats = "https://pomber.github.io/covid19/timeseries.json";
let countryList = "https://raw.githubusercontent.com/pomber/covid19/master/docs/countries.json";
let countries;
let results;
let selectedCountry;
let formattedData = {
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
let userSelection = "Trinidad and Tobago";

//GET CORONA RESULTS AND CORONA COUNTRIES
async function getCoronaData(stats){
    try {
        let response = await fetch(stats);
        results = await response.json();

        response = await fetch(countryList);
        countries = await response.json();

        //console.log(results);
        //console.log(countries);

        arrangeData(results);
        getWorldData(results, userSelection);
        formatData(results, countries, userSelection);
        drawTable(results, userSelection);

    } catch(error) {
        coronaTrackerArea.innerHTML = `<p style="text-align: center;"><b>No results found!</b></p>`
        console.log(error);
    }
}

//NEEDS TO BE TRIGGERED BY SOMETHING
getCoronaData(stats);

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
            confirmedCases = parseInt(results[currentCountry][0].confirmed);
            confirmedCountryCode = countries[currentCountry].code;
        } catch(error) {
            console.log(error);
        }

        console.log(confirmedCases);
        console.log(confirmedCountryCode);

        //writeCountryData(currentCountry, confirmedCases, confirmedCountryCode);
    }




    formattedData['piechart'].push(formattedData['confirmed'][0]);
    formattedData['piechart'].push(formattedData['deaths'][0]);
    formattedData['piechart'].push(formattedData['recovered'][0]);



    console.log(formattedData);



}

//END FORMAT DATA FOR GRAPH



//CORONA LINE GRAPH
let coronaGraphContext = document.querySelector('#coronaLineGraph').getContext('2d');
//coronaGraphContext.canvas.width = document.documentElement.clientWidth;
//coronaGraphContext.canvas.height = document.documentElement.clientHeight;
let coronaGraph = new Chart(coronaGraphContext, {
    type: 'line',
    data: {
        labels: [1,2,3,4,5],
        datasets: [{
            label: 'Confirmed Cases',
            data: [2,5,7,8],
            borderColor:'#19AADE',
            fill: false,
            lineTension: 0
        },{
            label: 'Recovered',
            data: [2,4,1,3],
            borderColor: '#7D3AC1',
            fill: false,
            lineTension: 0
        },{
            label: 'Deaths',
            data: [21,3,5,2],
            borderColor: '#C02323',
            fill: false,
            lineTension: 0
        }
    ]},
    options: {
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
            },
        },
        scales: {
            yAxes: [{
                position: "left",
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

