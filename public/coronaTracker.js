let stats = "https://pomber.github.io/covid19/timeseries.json";
let countryList = "https://raw.githubusercontent.com/pomber/covid19/master/docs/countries.json";
let countries;
let results;
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

        console.log(results);
        console.log(countries);

        arrangeData(results, userSelection);
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

function arrangeData(results, userSelection){
    results[userSelection].reverse();
}

//END ARRANGE DATA NEW TO OLD

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
        <hr style="border: 2px solid black;">
        <table id="coronaResultHeader">
            <tr>
                <td><b>Date</b></td>
                <td><b>Confirmed</b></td>
                <td><b>Recovered</b></td>
                <td><b>Deaths</b></td>
                <td><b>Increase</b></td>
            </tr>
        </table>
        <hr style="border: 2px solid black;">
        `;

}



//END DRAW TABLE
