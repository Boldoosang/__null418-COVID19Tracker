 document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, {});
  });

  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.dropdown-trigger');
    var instances = M.Dropdown.init(elems, {});
  });

  async function navigate(title, url){
    document.title = title;
    let content = document.querySelector('#content');
    if(url === null){
      content.innerHTML = "";
    }else{
      let response = await fetch(url);
      content.innerHTML = await response.text();
    }
  }
  
  function handleClick(event){
    event.preventDefault();
    event.stopPropagation();
    
    let a = event.target.innerText;

    navigate(a, "coronaTracker.html");
  }
  
  function handleClick1(event){
    event.preventDefault();
    event.stopPropagation();
    
    let a = event.target.innerText;

    navigate(a, "homepage.html");
  }

  function handleClick2(event){
    event.preventDefault();
    event.stopPropagation();
    
    let a = event.target.innerText;

    navigate(a, "measures.html");
  }

  const menu = document.querySelector('#dropdown1');
  menu.addEventListener('click', handleClick, false);
  
  const menu1 = document.querySelector('#homeButt');
  menu1.addEventListener('click', handleClick1, false); 

  const menu2 = document.querySelector('#measures');
  menu2.addEventListener('click', handleClick2, false);

window.onload=handleClick1;

document.addEventListener('DOMContentLoaded', function() {
  let elems = document.querySelectorAll('select');
  let instances = M.FormSelect.init(elems, options);
});
