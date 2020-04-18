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

    navigate(a, "coronaPage.html");
  }

  //replace default handling of click event with page redirect
  function handleHomeClick(event){
    event.preventDefault();
    event.stopPropagation();
    
    let a = event.target.innerText;

    navigate(a, "homepage.html");
  }

  //replace default handling of click event with page redirect
  function handleMeasureClick(event){
    event.preventDefault();
    event.stopPropagation();
    
    let a = event.target.innerText;

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
  
  navigate("HOME", "homepage.html");
};
