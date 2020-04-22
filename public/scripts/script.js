 // Materialize sidenav initialization
 document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, {});
  });

  //Fetch and inject a webpage into the content section of index.html
  async function navigate(title, url){
    document.title = "__null418 COVID19 - " + title;
    let content = document.querySelector('#content'); //create object of content
    if(url === null){
      content.innerHTML = "Unable to load content!";
    } else {
      let response = await fetch(url); //fetch content from url
      content.innerHTML = await response.text(); //update the contents of content to response
    }
  }
  //replace default handling of click event with page redirect
  function handleCountryClick(event){
    event.preventDefault();
    event.stopPropagation(); 
    
    let a = event.target.innerText;

    history.pushState({title:"AFFECTED COUNTRIES", url: "coronaPage.html"}, null, "coronaPage.html");

    navigate(a, "coronaPage.html");
  }

  //replace default handling of click event with page redirect
  function handleHomeClick(event){
    event.preventDefault();
    event.stopPropagation();
    
    let a = event.target.innerText;

    history.pushState({title:"HOME", url: "homepage.html"}, null, "homepage.html");

    navigate(a, "homepage.html");
  }

  //replace default handling of click event with page redirect
  function handleMeasureClick(event){
    event.preventDefault();
    event.stopPropagation();
    
    let a = event.target.innerText;

    history.pushState({title:"PREVENTATIVE MEASURES", url: "measures.html"}, null, "measures.html");

    navigate(a, "measures.html");
  }

  //load content of "affected countries" menu button into object
  const menu = document.querySelector('#countries');

  //wait for a click to call the handleclick function
  menu.addEventListener('click', handleCountryClick, false);

   //load content of "home" menu button into object
  const menu1 = document.querySelector('#homeButt');
  //wait for a click to call the handleclick function
  menu1.addEventListener('click', handleHomeClick, false); 

   //load content of "preventative measures" menu butt
  const menu2 = document.querySelector('#measures');

  //wait for a click to call the handleclick function
  menu2.addEventListener('click', handleMeasureClick, false);

//load homepage on page load
window.onload = function() {
  event.preventDefault();
  event.stopPropagation();

  history.pushState({title:"HOME", url: "homepage.html"}, null, "homepage.html");

  navigate("HOME", "homepage.html");
};

//stores the history in a stack and pops the history when the back button is clicked
function handleBack(event){
  if(event.state == null){
    navigate("HOME", "homepage.html");
  } else {
    //Popped history is navigated to.
    navigate(event.state.title, event.state.url);  
  }
}

window.addEventListener('popstate', handleBack);//attach event handler to back navigation