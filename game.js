//global variable for minefield
var field = [];
var time;
var score = 100000;

function init(){
  //0 = clear, 1 = mine and -1 = opened
  var mine;
  //create clear field
  for (var i = 0; i< 25; i++){
    field[i] = 0;
  }
  //put mines on the field
  for (var j = 0; j< 5; j++){
    mine = Math.floor((Math.random() * 5));
    field[(j*5)+mine] = 1;
  }
  document.getElementById("menu").style.display = "none";
  document.getElementById("game").style.display = "block";
  var buttons = document.querySelectorAll("div.game button");
  for (var v = 0; v<buttons.length-2; v++){
    buttons[v].style.background = "black";
    if(buttons[v].disabled == true){
      buttons[v].disabled = false;
    }
  }
  time = new Date();
}

function makeMove(x, y, identifyer){
  //define max values for x and y and check if inputs are valid.
  if(x > 4 || y > 4){return;}
  //check coordinates from field array

  //if spot on array is 0 set it to -1
  if(field[(y*5)+x] == 0){
    var cleared = 1;
    var nearbyMines = 0;
    field[(y*5)+x] = -1;

    for(var m = 0; m<25; m++){
      if(field[m] == 0){
        cleared = 0;
        break;
      }
    }
    if(cleared == 1){
      window.alert("Minefield cleared!");
      var endTime = new Date();
      //score is 100000 - time elapsed in milliseconds
      score = score - (endTime.getTime() - time.getTime());
      //minimum score is 0
      if(score < 0){score = 0;}
      var empty;
      var message = {
        "messageType": "SAVE",
        "gamestate": {
          "field": empty,
          "score": 100000
        }
      };
      window.parent.postMessage(message, "*");
      document.getElementById("menu").style.display = "block";
      document.getElementById("game").style.display = "none";
      var message={
        "messageType": "SCORE",
        "score": score
      };
      window.parent.postMessage(message, "*");
    }

    document.getElementById(identifyer).style.background = 'white';
    document.getElementById(identifyer).style.color = 'black';
    if(y != 0){if(field[((y-1)*5)+x] == 1){nearbyMines++;}}
    if(y != 4){if(field[((y+1)*5)+x] == 1){nearbyMines++;}}
    if(x != 0){if(field[((y*5)+x)-1] == 1){nearbyMines++;}}
    if(x != 4){if(field[((y*5)+x)+1] == 1){nearbyMines++;}}
    document.getElementById(identifyer).innerHTML = nearbyMines;
    document.getElementById(identifyer).disabled = true;
    return;
    //disable button, which value is -1
  }
  //else if spot on array is 1 -> game over
  else if (field[(y*5)+x] == 1) {
    window.alert("Game over!");
    //return to main menu
    document.getElementById("menu").style.display = "block";
    document.getElementById("game").style.display = "none";
  }
  //else do nothing
}

function save(){
  //store current minefield
  var message = {
    "messageType": "SAVE",
    "gamestate": {
      "field": field,
      "score": score
    }
  };
  window.parent.postMessage(message, "*");
  document.getElementById("menu").style.display = "block";
  document.getElementById("game").style.display = "none";
}

function load(){
  var message ={
    "messageType":"LOAD_REQUEST"
  };
  window.parent.postMessage(message, "*");
}

function scores(){
  var message={
    "messageType":"HIGHSCORES"
  };
  window.parent.postMessage(message, "*");
}

window.addEventListener("message", function(event) {
  if(typeof(event) != 'undefined'){
    if(event.data.messageType == "LOAD"){

      field = event.data.gamestate.field;
      if(typeof(field) === 'undefined'){
        field = [];
        window.alert("An error was occured while loading gamestate");
      }
      else{
        score = event.data.gamestate.score;
        //set game as active view
        document.getElementById("menu").style.display = "none";
        document.getElementById("game").style.display = "block";
        //reset buttons
        var buttons = document.querySelectorAll("div.game button");
        for (var v = 0; v<buttons.length-2; v++){
          buttons[v].style.background = "black";
          if(buttons[v].disabled == true){
            buttons[v].disabled = false;
          }
        }
        var buttons = document.querySelectorAll("div.game button");
        for (var v = 0; v<buttons.length-2; v++){
          if(field[v] != -1){
            buttons[v].style.background = "black";
            if(buttons[v].disabled === true){
              buttons[v].disabled = false;
            }
          }
          else{
            var nearbyMines = 0;
            buttons[v].style.background = 'white';
            buttons[v].style.color = 'black';
            if(v%5 != 0){if(field[v-1] === 1){nearbyMines++;}}
            if(v%5 != 4){if(field[v+1] === 1){nearbyMines++;}}
            if(v > 5){if(field[v-5] === 1){nearbyMines++;}}
            if(v < 20){if(field[v+5] === 1){nearbyMines++;}}
            buttons[v].innerHTML = nearbyMines;
            if(buttons[v].disabled === false){
              buttons[v].disabled = true;
            }
          }
        }
        time = new Date();
      }
    }
    else if (event.data.messageType == "ERROR") {
      window.alert(event.data.info);
    }
    else if (event.data.messageType == "SCORES"){

    }
  }
});
