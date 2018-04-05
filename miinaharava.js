var mines = [];//List of mines
var rows = document.getElementsByClassName("rivi");//Mainly a placeholder
var buttons =[];//List of buttons
var openedFields = [];//List of already clicked buttons
var score;

//When the game is started, it sends the setting message
var message = {
  messageType:"SETTING",
  options:{
    "width": 400,
    "height": 400
  }
};
window.parent.postMessage(message, "*");

//Initialisation function. This creates the minefield
function init(){

  //List of the play area buttons (or minefield). This is used as a database when accessing buttons,
  //like in the button function
  for(i = 0; i< rows.length; i++){
    temp = rows[i].getElementsByTagName("button");
    for(j = 0; j < temp.length; j++){
      buttons.push(temp[j]);
    }
  }
  //Score is resetted to 0
  score = 0;
  document.getElementById("score").innerHTML = score;
  //Random number (between 5 and 10) of mines is generated
  var mine = Math.floor(Math.random () * (10-5)) + 5;
  mines = [];
  openedFields=[];
  //Mine position are randomised. Each button has 2 coordinates that are its id,
  //ex. 11, 53, 33 etc. Each coordinate is random and they are combined in the end
  for (var i = 0; i < mine; i++){
    var first = Math.floor(Math.random () * (7-1)) + 1;
    var second = Math.floor(Math.random () * 6);
    var id = first.toString() + second.toString();
    //Mines are pushed into a list. If a id is already there, it is ignored.
    if (mines.includes(id) == false){
      mines.push(id);
      var button = document.getElementById(id)
    }
  }

  //Buttons are enabled and previous numbers and colors are removed
  for(i = 0; i< buttons.length; i++){
      buttons[i].style.background = "white";
      buttons[i].disabled = false;

      buttons[i].innerText = "";
  }
  document.getElementById("text").innerHTML = "Game in progress";
}

//Button pressing function. It takes the id of pressed button as argument
function button(id){
  //For when you hit a mine. The button turns red, all buttons are disabled and the game is over
  if(mines.includes(id)){
    document.getElementById(id).style.background = "red";
    document.getElementById("text").innerHTML = "You lost";
    document.getElementById("score").innerHTML = score;
    for(i = 0; i< buttons.length; i++){
      buttons[i].disabled = true;
    }
    //Score is sent to the parentwindow
    var message={
      messageType: "SCORE",
      "score": score
    };
    window.parent.postMessage(message, "*");
  }
  //Otherwise the button is free of mines. It turns green, it shows nearby mines
  //and you get points
  else{
    document.getElementById(id).style.backgroundColor = "#ABFE84";
    document.getElementById(id).innerText = nearbyMines(id);
    openedFields.push(id);
    score = score + 100;
    document.getElementById("score").innerHTML = score;
    document.getElementById(id).disabled = true;
    //Check about remaining mine-free buttons. If you hit the last free button, you win.
    //Buttons are disabled etc.
    if(openedFields.length + mines.length == buttons.length){
      document.getElementById("text").innerHTML = "You won";
      for(i = 0; i< buttons.length; i++){
        buttons[i].disabled = true;
    }
    //Score is sent to the parentwindow
    var message={
      messageType: "SCORE",
      "score": score
    };
    window.parent.postMessage(message, "*");

    }
  }
}

//Function that checks nearby mines. Checking is done by comparing the id:s of the
// buttons with mines to the pressed buttons id. Mine on the left would have id
//one smaller than the buttons id, one on the right one greater. Mine on top of the
// button would have the first digit one smaller, or buttons id minus 10.
function nearbyMines(id){
  var i = 0;
  var numero = parseInt(id);
  var temp = (numero-1).toString();
  if(mines.includes(temp)){i++}
  var temp = (numero+1).toString();
  if(mines.includes(temp)){i++}
  var temp = (numero-10).toString();
  if(mines.includes(temp)){i++}
  var temp = (numero+10).toString();
  if(mines.includes(temp)){i++}
  var temp = (numero-11).toString();
  if(mines.includes(temp)){i++}
  var temp = (numero+11).toString();
  if(mines.includes(temp)){i++}
  var temp = (numero-9).toString();
  if(mines.includes(temp)){i++}
  var temp = (numero+9).toString();
  if(mines.includes(temp)){i++}
  return i;
}

//Load request. Loads a gameState from the parent window
function load(){
  var message ={
    messageType:"LOAD_REQUEST"
  };
  window.parent.postMessage(message, "*");
}

//Save function. Sends the gamestate to the parentwindow
function save(){
  var message ={
    messageType:"SAVE",
    gameState:{
      "score":score,
      "mines": mines,
      "openedFields":openedFields
    }
  };
  window.parent.postMessage(message, "*");
}

//Eventlistener for the game
window.addEventListener("message", function(event) {
  //If the game is loaded, the gamestate is the data of the message.
  //Similarly to the init- function, all buttons are enabled ond returned to white
  if(event.data.messageType == "LOAD"){
    mines = event.data.gameState.mines;
    openedFields = event.data.gameState.openedFields;
    score = event.data.gameState.score;
    document.getElementById("score").innerHTML = score;
    for(i = 0; i< buttons.length; i++){
        buttons[i].style.background = "white";
        buttons[i].disabled = false;
        buttons[i].innerText = "";
    }
    //Mines are put into their positions
    for(i = 0; i< mines.length; i++){
      var button = document.getElementById(mines[i])

    }
    //Already opened fields are disabled, turned to green and nearby mines are calculated
    for(i = 0; i< openedFields.length; i++){
      var button = document.getElementById(openedFields[i])
      button.style.backgroundColor = "#ABFE84";
      button.innerText = nearbyMines(openedFields[i]);
      button.disabled = true;
    }
  }
  //If the event is an error, the errormessage is shown as windowalert
  else if (event.data.messageType == "ERROR") {
    window.alert(event.data.info);
  }
});
