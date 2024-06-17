const choose=document.querySelectorAll("#choose > .forms > div");
let adds=Array.from(choose);

const forms=document.querySelectorAll("form");

const uploadBtn=document.querySelector("#fileButton");
const uploadLable=document.querySelector(".upload");

const select=document.querySelectorAll("select");
const name=document.querySelectorAll(".n");



let selected=true;
// handle function 
function handle(eve){
   
    if(eve=="two" && selected==true){    
selected=false;
adds[0].classList.remove("selected");
adds[1].classList.add("selected");

forms[1].classList.remove("hide");
forms[0].classList.add("hide");



    }
    else if(eve=="one" && selected==false){
        selected=true;
    adds[1].classList.remove("selected");
    adds[0].classList.add("selected");

    forms[0].classList.remove("hide");
    forms[1].classList.add("hide");
    }
}



function uploadHandler(){
    if(uploadBtn.value!=""){
        
        uploadLable.style.background="#fc4747";
        console.log(uploadBtn.value);
        }
    
}