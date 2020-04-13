let stats = "https://pomber.github.io/covid19/timeseries.json";
let countryList = "https://raw.githubusercontent.com/pomber/covid19/master/docs/countries.json";
let results;
let countries;
let coronaTrackerArea = document.querySelector(".coronaTracker");

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

    } catch(error) {
        coronaTrackerArea.innerHTML = `<p style="text-align: center;"><b>No results found!</b></p>`
        console.log(error);
    }
}

getCoronaData(stats);
console.log(results);


//END GET CORONA RESULTS AND CORONA COUNTRIES

//CORONA RESULT ELEMENTS
let cTableElement = coronaTrackerArea.querySelector(".coronaTableCountry");
let cPieElement = coronaTrackerArea.querySelector(".coronaPieChart");
let cMapWorld = coronaTrackerArea.querySelector(".coronaMapWorld");
let cMapRegion = coronaTrackerArea.querySelector(".coronaMapRegion");

console.log(coronaTrackerArea);
console.log(cTableElement);
console.log(cPieElement);
console.log(cMapWorld);
console.log(cMapRegion);

//END CORONA RESULT ELEMENTS

cTableElement.innerHTML = "<p>Hello</p>"

