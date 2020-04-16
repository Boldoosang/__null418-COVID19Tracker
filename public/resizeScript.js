let cBut;
let height = 0;

console.log("Gotten!");

$(document).ready(function(){
    cBut = document.querySelector("#coronaSubmit-btn");
    cBut.addEventListener("click", function (){
        let body = document.body,
        html = document.documentElement;

        setTimeout(function(){
            height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
                
            console.log(height);
        }, 500)
    })

    console.log(height);

    function getHeight() {
        return height;
    }
})