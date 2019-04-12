/*******************************************************************
 * File:    mainGame.js
 * Project: CMSC 433 - Project 2 - Oregon Trail
 * Author : Krunal Hirpara, Arvin Siva, Marcus Milbourne, Phuoc Nguyen
 * Date   : 05/16/17
 * Section: 01		
 * E-mail:  kz79934@umbc.edu, sivaar1@umbc.edu, mmilbo1@umbc.edu,
 *          ej77536@umbc.edu
 *
 *   The main game file that has the game travel loop. Also checks
 *   for end game (win or lose), has the travel animation for wagon, 
 *	 and checks for tombstones.
 ******************************************************************/

//The main travel logic of the game. Will increment the day, eatFood, changeWeather, etc. and increase miles traveled based on pace.
//Also in charge of determining if random event happens, location is reached, and/or game is over
function travelTrail() {
	randMsg = "";
    day++;
	eatFood();
	//No clothing and bad weather
	if(gameStatus[WEATHER] == COLD || gameStatus[WEATHER] == VERYRAINY){
		if(supplies[CLOTHING] < 5) reduceTeamHP(2*(5-supplies[CLOTHING]));
	}
    if (gameStatus[PACE] == STEADY) {//if the pace is steady the travel distance is short for that day, but you have time to rest so you gain a small amount of health
        totalTraveled += 20;
        tempTraveled += 20;
        addTeamHP(1);
    }
    else if (gameStatus[PACE] == STRENUOUS) {//if pace is strenuous the travel distance is long for that day but you don't have much rest time so you lose some health 
        totalTraveled += 30;
        tempTraveled += 30;
		reduceTeamHP(2);
    }
    else if (gameStatus[PACE] == GRUELING) {//if pace is grueling the travel distance is very long for that day, but you don't have any time to rest and lose a lot of health
        totalTraveled += 40;
        tempTraveled += 40;
		reduceTeamHP(5);
    }
	//Random event; 20% chance something bad happened to your party beyond your control; random even function is called to decide which event it is. if the even
	// is a broken wagon part then the wagon parts are checked to see if you have any spare to replace the wagon part
	if(Math.floor(Math.random() * (5)) == 0){
		randomEvent();
		if(brokenPart < 3){
			if(parts[brokenPart] > 0) {parts[brokenPart]--; supplies[PARTS]--; brokenPart = 3; randMsg += "<br>You replace it with a spare part.";}
			else randMsg+= "<br>You have no spare parts to replace it!";
		}
	}
	//For injured and dying oxen. determines if an oxen loses or gains health. The chances are higher that you heal the cattle if you chose cowboy 
	else{
		var rand = 8;
		var heal = 5;
		if(job == "Cowboy") {rand+=2; heal-=2;}
		if(Math.floor(Math.random() * (heal)) == 0) oxenInjured = 0;
		if(Math.floor(Math.random() * (rand)) == 0){
			if(oxenInjured) {randMsg = "One of your oxen has died!"; supplies[OXEN]--; oxenInjured = 0;}
			else {oxenInjured = 1; randMsg = "One of your oxen is injured!"}
		}
	}
	changeWeather();
	//Check if they lost
	if(numCharacters == 0) lostGame();
    else if (tempTraveled >= distance[0]) {
		//Check if they won
		if(locType[0] == END){gameDone = 1; currLocation = "Willamette Valley"; displayLocation();}
		else{
			//Ask if they wish to stop here
			totalTraveled = totalTraveled - (tempTraveled - distance[0]);
			checkTombstone(1);//checks if a tombstone is in the area
		}
	}
	else if (!gameDone) checkTombstone();
}


//Shows the tombstone with the leader's name and their message
function displayTombstone(index, num){
	var t = "<div class='imageContainer'> <div class='side1'> <p1>"+tombName[index]+"</p1> <br><br>\
			<p>"+tombMsg[index]+"</p></div></div>" + spaceTxt;
	
	document.getElementsByClassName("container")[0].innerHTML = t;
	$(document).keypress(function (e) {
        if (e.keyCode == SPACEBAR) {
            $(this).unbind();
            tombMsg.splice(index, 1);
			tombName.splice(index, 1);
			tombPrev.splice(index, 1);
			tombNext.splice(index, 1);
			tombMiles.splice(index, 1);
			checkTombstone(num);//check for other tombstones after this 
        }
    });
}

//Asks user if they want to look at the tombstone
function askTombstone(index, num){
	document.getElementsByClassName("container")[0].innerHTML = "<p>You pass over a grave. Would you like to take a closer look?<br><br>\
	<button id='tombYes' class='button'><span>Yes</span></button><br><button id='tombNo' class='button'><span>No</span></button></p>";
	$("#tombYes").click(function(){//if yes then displaytombstone is called and the grave is shown
		$(this).unbind();
		$("#tombNo").unbind();
		displayTombstone(index, num);
	});
	$("#tombNo").click(function(){//if no then display tombstone is not called and more tomstones are checked for
		$(this).unbind();
		$("#tombYes").unbind();
		tombMsg.splice(index, 1);
		tombName.splice(index, 1);
		tombPrev.splice(index, 1);
		tombNext.splice(index, 1);
		tombMiles.splice(index, 1);
		checkTombstone(num);
	});
}

//Checks to see if the user is passing any tombstones
function checkTombstone(num = 0){
	var i;
	for(i = 0; i < tombMiles.length; i++){
		if(tombPrev[i] == prevLocation && tombNext[i] == locations[0]){
			if(tombMiles[i] <= tempTraveled){ askTombstone(i, num); return;}
		}
	}
	//If the tombstone is next to a town/river/other
	if(num){
		tempTraveled = 0;
		currLocation = locations.shift();
		currType = locType.shift();
		distance.shift();
		stopLocation();
	}
	//If the tombstone is somewhere along the trail
	else mainGame();
}

//Shows the travel animation. The wheels on the wagon rotate and the oxen walk.
function walk(){
	$(document).ready(function(){
	if(!checkMove()){ mainGame(); return;}
	document.getElementById("msg").innerHTML = "";
	var f = 0;
	var pace = .5;
	//pace determines the speed of the animation. the pace is determined by the gameStatus[PACE]. the fast the in game pace, the faster the animation
	if(gameStatus[PACE] == STEADY)
		pace == 2;
	else if (gameStatus[PACE] == STRENUOUS)
		pace == 1;
	else if (gameStatus[PACE] == GRUELING)
		pace == .5;
	var id = setInterval(frame, 5);
    function frame() {//every 50*pace iterations the frame is changed. it goes through 2 loops before stopping
		if (f == 0 || f == 200* pace){
			$("#ok").attr("src", "image/Frame1.png");
		}
		else if (f == (50 * pace) || f == (250 * pace)){
			$("#ok").attr("src", "image/Frame2.png");
		}
		else if (f == (100 * pace)|| f == (300 * pace)){
			$("#ok").attr("src", "image/Frame1.png");
		}
		else if (f == (150 * pace)|| f == (350 * pace)){
			$("#ok").attr("src", "image/Frame4.png");
		}
        if (f == 400 * pace) {//interval clears and travel trail is called once finished
			$("#ok").attr("src", "image/Frame1.png");
            clearInterval(id);
			travelTrail();
        } 
		else {
			f ++;
        }
    }
	});
}

//The main game screen that displays the status of the game and the area in which the walk animation takes place
function mainGame() {
	if(soundOn){//stops river music if music is on
		river.pause();
		river.load();
	}
	//If all crew members die
	if(numCharacters == 0){lostGame(); return;}
	setDate();
	setHealth();
	var backImg;
	if(gameStatus[WEATHER] == RAINY || gameStatus[WEATHER] == VERYRAINY) backImg = "image/rainy.jpg";
	else backImg = "image/mountain.JPG";
    var t = "<p id='msg'>"+randMsg+"</p>\
			<button class='button' id='checkOptions'><span>Check Options</span></button>\
			<p id='info' style='text-align: center;'>Date: " + months[month] + " " + day + ", " + year + "<br>\
			Weather: " + currWeather + "<br>\
			Health: " + currHealth + "<br>\
			Food: " + supplies[FOOD] + " pounds<br>\
			Next Landmark: " + (distance[0] - tempTraveled) + "<br>\
			Miles Traveled: " + totalTraveled + "</p>\
			" + spaceTxt + "\
			<div id='walking'><img src="+backImg+" id = 'col' alt='Mountain View' style='width:900px; height:350px; left:45%; margin-left: -350; position:absolute; background-color: black;'>\
			<img src='image/Frame1.png' id='ok' style = 'position:absolute; width: 180px; length: 180px; left: 50%; margin-left:-50px; margin-top:200px' alt='Mountain View'><div>";
    document.getElementsByClassName("container")[0].innerHTML = t;
    $(document).keypress(function (e) {//when space button is clicked you travel and go to the next day
        if (e.keyCode == SPACEBAR) {
			$("#checkOptions").unbind();
            $(this).unbind();
			walk();
        }
    });
    $("#checkOptions").click(function () {
        $(this).unbind();
        $(document).unbind();
        locationInfo();
    });
}

//Function is called when everyone dies. Gives you an input box to input a message on your tombstone for other players to see.
function lostGame(){
	if(soundOn){//plays lost music if music is on
			dead.play();
	}
	//Store totalTraveled in the database with the player's name and his tombstone msg that comes from user input, the leaders name is at characters[0]
	document.getElementsByClassName("container")[0].innerHTML = "<h1>YOU LOSE!!!</h1><p>Enter a message for your grave.</p>\
	<form name='form2' action='tombstone.php' method='post'><input type='hidden' name='tempTraveled'></input><input type='hidden' name='leaderName'></input><input type='hidden' name='nextLocation'></input><input type='hidden' name='prevLocation'></input><input type='text' val='' name='messageInput' id='messageInput'></input><br><input type='submit' name='submitButton' class='button'></input></form>";															
	
	//once message is input, the data is sumbitted to the database
	var msgInput = document.getElementById('messageInput').value;
	document.form2.prevLocation.value = prevLocation;
	document.form2.nextLocation.value = locations[0];
	document.form2.leaderName.value = characters[0];
	document.form2.tempTraveled.value = tempTraveled;
	
}

//Function is called when you reach Oregon. Calculates your score based on your supplies and class. Gives you an input box to put in a name for your score.
function endGame() {
	var scoreMult = 0;
	if(job == "Banker") scoreMult = 1;
	else if(job == "Carpenter" || job == "Fisher" || job == "Cowboy" || job == "Merchant") scoreMult = 2;
	else if(job == "Farmer") scoreMult = 3;
	else if(job == "Batman") scoreMult = 0;
	var t= "<h1>YOU WIN!!!</h1><p>Calculating your score:<br><br>Money - $"+(supplies[MONEY]).toFixed(2)+":  "+Math.floor(supplies[MONEY])+" points<br><br>";
	score += Math.floor(supplies[MONEY]);
	t += "Food - "+supplies[FOOD]+" pounds:  "+Math.floor(supplies[FOOD]/10)+" points<br><br>";
	score += Math.floor(supplies[FOOD]/10);
	t += "Clothes - "+supplies[CLOTHING]+" sets:  "+(supplies[CLOTHING] * 10)+" points<br><br>";
	score += (supplies[CLOTHING] * 10);
	t += "Bait - "+supplies[BAIT]+":  "+Math.floor(supplies[BAIT]/10)+" points<br><br>";
	score += Math.floor(supplies[BAIT]/10);
	t += "Oxen - "+supplies[OXEN]+":  "+(supplies[OXEN] * 50)+" points<br><br>";
	score += (supplies[OXEN] * 50);
	t += "Spare Parts - "+supplies[PARTS]+" parts:  "+(supplies[PARTS] * 10)+" points<br><br>\
		Number of Survivors - "+numCharacters+":  "+(numCharacters*300)+" points<br><br>Score Multiplier:  "+scoreMult+"<br><br>";
	score += (supplies[PARTS] * 10);
	score += (numCharacters * 300);
	score *= scoreMult;
	t += "Total Score:  "+score+"<br><br>Enter a name for your score.</p>"
	t += "<form name='form1' action='high_score.php' method='post'><input type='hidden' name='scorePage'></input><input type='text' val='' name='pageInput' id='pageInput'></input><br><input type='submit' class='button'></input></form>";
	document.getElementsByClassName("container")[0].innerHTML = t;
	//score and type name
	var inputName = document.getElementById('pageInput').value;
	document.form1.scorePage.value = score;
	document.form1.pageInput.value = inputName;
}