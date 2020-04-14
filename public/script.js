
 document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, {});
  });

  
  async function navigate(title, url){
    document.title = title;
    let content = document.querySelector('#content');
    if(url === null){
      content.innerHTML = "";
    }else{
      let response = await fetch(url);
      content.innerHTML = await response.text();
      console.log(title);
    }
  }
  
  function handleClick(event){
    event.preventDefault();
    event.stopPropagation();
    
    let a = event.target.innerText;

    navigate(a, "coronaTracker.html");
  }
  
  const menu = document.querySelector('#dropdownNav');
  menu.addEventListener('click', handleClick, false);
  