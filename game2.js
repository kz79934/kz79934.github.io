/*******************************************************************
 * File:    game2.js
 * Project: CMSC 433 - Project 2 - Oregon Trail
 * Author : Krunal Hirpara, Arvin Siva, Marcus Milbourne, Phuoc Nguyen
 * Date   : 05/16/17
 * Section: 01		
 * E-mail:  kz79934@umbc.edu, sivaar1@umbc.edu, mmilbo1@umbc.edu,
 *          ej77536@umbc.edu
 *
 *   Contains all the options for location (Ex: towns and rivers),
 *   pace, ration, etc. Also has the fishing mini game.
 ******************************************************************/

//Outputs how many supplies you have in each category
function checkSupplies() {
    var t = "<p>Your Supplies:<br>\
			Oxen: " + supplies[OXEN] + "<br>\
			Sets of Clothing: " + supplies[CLOTHING] + "<br>\
			Bait: " + supplies[BAIT] + "<br>\
			Wagon Wheels: " + parts[WHEEL] + "<br>\
			Wagon Axles: " + parts[AXLE] + "<br>\
			Wagon Tongues: " + parts[TONGUE] + "<br>\
			Pounds of Food: " + supplies[FOOD] + "<br>\
			Money Left: $" + (supplies[MONEY]).toFixed(2) + "</p>\
			" + spaceTxt;
    document.getElementsByClassName("container")[0].innerHTML = t;
    $(document).keypress(function (e) {
        if (e.keyCode == SPACEBAR) {
            $(this).unbind();
            locationInfo();
        }
    });
}

//Outputs the differences in the three pace options.
function paceInfo() {
    var t = "<p>Steady: You travel about 8 hours a day, taking requent rests. You take care not to get too tired<br><br>\
			Strenuous: You travel about 12 hours a day, starting just after sunrise and stopping shortly before sunset.<br>\
			You stop to rest only when necessary. You finish each day feeling very tired.<br><br>\
			Grueling: You travel about 16 hours a day, starting before sunrise and continuing until dark. You almost never stop to rest.<br>\
			You do not get enough sleep at night. You finish each day feeling absolutely exhausted, and your health suffers.</p>" + spaceTxt;
    document.getElementsByClassName("container")[0].innerHTML = t;
    $(document).keypress(function (e) {
        if (e.keyCode == SPACEBAR) {
            $(this).unbind();
            changePace();
        }
    });
}

//Sets the game pace based on what the user selected
function setPace(pace) {
    currPace = pace;
    if (pace == "Steady") gameStatus[PACE] = STEADY;
    else if (pace == "Strenuous") gameStatus[PACE] = STRENUOUS;
    else if (pace == "Grueling") gameStatus[PACE] = GRUELING;
    locationInfo();
}

//Gives user the option to change their pace
function changePace() {
    var t = "<div id='paceOptions'><p>Change pace<br>\
			(currently: " + currPace + ")<br><br>\
			The pace at which you travel can change.<br>\
			Your choices are:</p><br>\
			<button class='button' value='Steady' onclick='setPace(this.value)'><span>Steady</span></button><br>\
			<button class='button' value='Strenuous' onclick='setPace(this.value)'><span>Strenuous</span></button><br>\
			<button class='button' value='Grueling' onclick='setPace(this.value)'><span>Grueling</span></button><br>\
			<button class='button' onclick='paceInfo()'><span>Pace Information</span></button></div>"
    document.getElementsByClassName("container")[0].innerHTML = t;
}

//Changes the game rations based on what the user selected
function setRations(rations) {
    currRations = rations;
    if (rations == "Filling") gameStatus[RATIONS] = FILLING;
    else if (rations == "Meager") gameStatus[RATIONS] = MEAGER;
    else if (rations == "Bare Bones") gameStatus[RATIONS] = BAREBONES;
    locationInfo();
}

//Gives the user the option to change their rations. Also gives a brief description of each option
function changeRations() {
    var t = "<div id='foodOptions'><p>Change food rations<br>\
			(currently: " + currRations + ")<br><br>\
			The amount of food the people in your party eat each day can change.</p><br>\
			<button class='button' value='Filling' onclick='setRations(this.value)'><span>Filling</span></button> <p>- Meals are large and generous.</p><br>\
			<button class='button' value='Meager' onclick='setRations(this.value)'><span>Meager</span></button> <p>- Meals are small, but adequate.</p><br>\
			<button class='button' value='Bare Bones' onclick='setRations(this.value)'><span>Bare Bones</span></button> <p>- Meals are very small; everyone stays hungry.</p><br>\</div>";
    document.getElementsByClassName("container")[0].innerHTML = t;
}

//Gets the index of the supplies global array based on the string argument (Helper Function)
function getIndex(str){
	if(str == "OXEN") return OXEN;
	if(str == "CLOTHING") return CLOTHING;
	if(str == "BAIT") return BAIT;
	if(str == "FOOD") return FOOD;
	if(str == "WHEEL") return WHEEL;
	if(str == "AXLE") return AXLE;
	if(str == "TONGUE") return TONGUE;
	if(str == "PARTS") return OXEN;
}

//Gets the user input of the amount of the supply they want. Also checks if the input is valid and if they have enough money
function buyItem(item){
	var index = getIndex(item);
	var amount = document.getElementById("buy").value;
	var patt = /^\d+$/;
	if(!(patt.test(amount)))
		document.getElementById("errMsg").innerHTML = "Please enter a number!";
	else if(item == "WHEEL" || item == "AXLE" || item == "TONGUE"){
		amount = parseInt(amount);
		if((price[WAGON_COST]*amount) <= supplies[MONEY]){
			supplies[PARTS] += amount;
			parts[index] += amount;
			supplies[MONEY] -= (price[WAGON_COST]*amount);
			if(brokenPart == index){supplies[PARTS]--; parts[index]--; brokenPart = 3;}
			buySupplies();
		}
		else
			document.getElementById("errMsg").innerHTML = "You do not have enough money to do that!";
	}
	else{
		amount = parseInt(amount);
		var priceIndex;
		if(item == "OXEN")
			priceIndex = OXEN_COST;
		else if(item == "CLOTHING")
			priceIndex = CLOTHING_COST;
		else if(item == "BAIT"){
			priceIndex = BAIT_COST;
			amount *= 20;
		}
		else if(item == "FOOD")
			priceIndex = FOOD_COST;
		if((price[priceIndex]*amount) <= supplies[MONEY]){
			supplies[index] += amount;
			supplies[MONEY] -= (price[priceIndex]*amount);
			buySupplies();
		}
		else
			document.getElementById("errMsg").innerHTML = "You do not have enough money to do that!";
	}
}

//Displays an input box for the user to enter in the amount they want of the option they chose
function setItem(item){
	if(item == "OXEN") 
		document.getElementById("selectItem").innerHTML = "<label>How many oxen?</label><br><br><input id='buy' type='text' value='' placeholder='Oxen' onkeypress='return itemValidation(event)'></input><br><button class='button' value='OXEN' onclick='buyItem(this.value)'><span>Buy It!</span></button><br>";
	else if(item == "CLOTHING") 
		document.getElementById("selectItem").innerHTML = "<label>How many sets?</label><br><br><input id='buy' type='text' value='' placeholder='Sets' onkeypress='return itemValidation(event)'></input><br><button class='button' value='CLOTHING' onclick='buyItem(this.value)'><span>Buy It!</span></button><br>";
	else if(item == "BAIT") 
		document.getElementById("selectItem").innerHTML = "<label>How many buckets?</label><br><br><input id='buy' type='text' value='' placeholder='Buckets' onkeypress='return itemValidation(event)'></input><br><button class='button' value='BAIT' onclick='buyItem(this.value)'><span>Buy It!</span></button><br>";
	else if(item == "WHEEL") 
		document.getElementById("selectItem").innerHTML = "<label>How many wheels?</label><br><br><input id='buy' type='text' value='' placeholder='Wheels' onkeypress='return itemValidation(event)'></input><br><button class='button' value='WHEEL' onclick='buyItem(this.value)'><span>Buy It!</span></button><br>";
	else if(item == "AXLE") 
		document.getElementById("selectItem").innerHTML = "<label>How many axles?</label><br><br><input id='buy' type='text' value='' placeholder='Axles' onkeypress='return itemValidation(event)'></input><br><button class='button' value='AXLE' onclick='buyItem(this.value)'><span>Buy It!</span></button><br>";
	else if(item == "TONGUE") 
		document.getElementById("selectItem").innerHTML = "<label>How many tongues?</label><br><br><input id='buy' type='text' value='' placeholder='Tongues' onkeypress='return itemValidation(event)'></input><br><button class='button' value='TONGUE' onclick='buyItem(this.value)'><span>Buy It!</span></button><br>";
	else if(item == "FOOD") 
		document.getElementById("selectItem").innerHTML = "<label>How many pounds?</label><br><br><input id='buy' type='text' value='' placeholder='Food' onkeypress='return itemValidation(event)'></input><br><button class='button' value='FOOD' onclick='buyItem(this.value)'><span>Buy It!</span></button><br>";
}

//The menu for the fort stores. Each fort that you can stop at along the trail has this kind of store
function buySupplies(){
	var t = "<h2>"+currLocation+"<br>"+months[month]+" "+day+", "+year+"</h2>\
			<p>You may buy:</p><br>\
            <div class='side'>\
			<button class='button button1' value='OXEN' onclick='setItem(this.value)'><span>Oxen</span></button><label1>1. $20 per ox</label1><br>\
			<button class='button button1' value='CLOTHING' onclick='setItem(this.value)'><span>Clothing</span></button><label1>2. $10 per set</label1><br>\
			<button class='button button1' value='BAIT' onclick='setItem(this.value)'><span>Bait</span></button><label1>3. $2 per bucket</label1><br>\
			<button class='button button1' value='WHEEL' onclick='setItem(this.value)'><span>Wagon Wheels</span></button><label1>4. $10 per wheel</label1></div>\
            <div class='side'>\
			<button class='button button1' value='AXLE' onclick='setItem(this.value)'><span>Wagon Axles</span></button><label1>5. $10 per axle</label1><br>\
			<button class='button button1' value='TONGUE' onclick='setItem(this.value)'><span>Wagon Tongues</span></button><label1>6. $10 per tongue</label1><br>\
			<button class='button button1' value='FOOD' onclick='setItem(this.value)'><span>Food</span></button><label1>7. $0.20 per pound</label1><br>\
			<button class='button button1' onclick='locationInfo()'><span>Leave</span></button></div><br>\
			<div><label2>You have $"+ (supplies[MONEY]).toFixed(2) +" to spend.</label2></div><br>\
			<div id='selectItem'><label2>What would you like to buy?</label2></div>\
			<label2 id='errMsg'></label2>";
	document.getElementsByClassName("container")[0].innerHTML = t;
}

//Checks what the user lost based on random number generation
//0 means called from ford or float wagon. 1 means called from columbia river game
function riverLoss(num = 0){
	var msg = "What you lost:";
	if((num == 1 && numCharacters > 1) || num == 0){
		if(num == 1 || Math.floor(Math.random() * 2) == 0){
			var tempIndicies = [];
			var i;
			for(i = 0; i < hp.length; i++){if(hp[i] > 0) tempIndicies.push(i);}
			var charIndex = tempIndicies[Math.floor(Math.random() * (tempIndicies.length))];
			hp[charIndex] = 0;
			numCharacters--;
			msg += "\n" + characters[charIndex] + " (drowned)";
		}
	}
	if(supplies[OXEN] > 0){supplies[OXEN]--; msg += "\n1 ox";}
	var lostPart = Math.floor(Math.random() * 3);
	var partStr
	if(lostPart == WHEEL) partStr = "wheel";
	else if(lostPart == AXLE) partStr = "axle";
	else if(lostPart == TONGUE) partStr = "tongue";
	if(parts[lostPart] > 0){parts[lostPart]--; supplies[PARTS]--; msg += "\n1 wagon " + partStr;}
	if(Math.floor(Math.random() * 2) == 0 && supplies[FOOD] > 0){
		var foodLoss = Math.floor(Math.random() * 100) + 101;
		if(foodLoss > supplies[FOOD]) foodLoss = supplies[FOOD];
		supplies[FOOD] -= foodLoss;
		msg += "\n" + foodLoss + " pounds of food";
	}
	else if(Math.floor(Math.random() * 2) == 0 && supplies[BAIT] > 0){
		var baitLoss = Math.floor(Math.random() * 100) + 51;
		if(baitLoss > supplies[BAIT]) baitLoss = supplies[BAIT];
		supplies[BAIT] -= baitLoss;
		msg += "\n" + baitLoss + " bait";
	}
	else if(Math.floor(Math.random() * 2) == 0 && supplies[CLOTHING] > 0){
		var clothingLoss = Math.floor(Math.random() * 4) + 2;
		if(clothingLoss > supplies[CLOTHING]) clothingLoss = supplies[CLOTHING];
		supplies[CLOTHING] -= clothingLoss;
		msg += "\n" + clothingLoss + " sets of clothing";
	}
	return msg;
}

//Displays the fording animation. Success or fail is based on random number generation that can vary based on river depth
function ford(){
		if(soundOn){//plays river sounds if music is on
			river.loop = true;
			river.play();
		}	
		prevLocation = currLocation;
		currLocation = "";
        var t = "<img src='image/Ford.JPG' id='bkg' style = 'position:absolute; width:100%; height:100%;' alt='Mountain View'>\
        <img src='image/Cross.png' id='ok' style = 'position:absolute; width: 180px; length: 300px; bottom:20px; left: 80%;' alt='Mountain View'>";
        document.getElementsByClassName("container")[0].innerHTML = t;
        var death = 10;
		var cross;
		if(riverDepth < 4) cross = 10;
		else if(riverDepth < 5) cross = 8;
		else if(riverDepth < 6) cross = 5;
		else if(riverDepth < 7) cross = 3;
		else cross = 0;
		var msg;
        $(document).ready(function(){
			death = (Math.floor(Math.random()*10));
            if(death < cross){
				if(Math.floor(Math.random()*2) == 0) msg = "You made it across perfectly fine!";
				else {msg = "Your supplies got wet. Lose 1 day."; day++; changeWeather(); eatFood();}
                $("#ok").animate({left: '10%'},10000,function(){alert(msg); tempTraveled++; totalTraveled++; mainGame();});
            }
			else{
				msg = "You were unable to ford the river! " + riverLoss();
                $("#ok").animate({left: '600px'},5000,function(){$("#ok").attr("src", "image/Capsize.png"); tempTraveled++; totalTraveled++; alert(msg);});//add who dies and what supplies are lost here
                $("#ok").delay(3000).animate({left: '10%'},10000,function(){mainGame();});
            }
        });
		riverDepth = 0; riverWidth = 0; ferryWait = 0; riverChange = 2;
}

//Displays float wagon animation. Success or fail is based on random number generation
function floatWagon(){
	if(soundOn){//plays river sounds if music is on
			river.loop = true;
			river.play();
		}	
	prevLocation = currLocation;
	currLocation = "";
        var t = "<img src='image/Ford.JPG' id='bkg' style = 'position:absolute; width:100%; height:100%;' alt='Mountain View'>\
        <img src='image/Cross.png' id='ok' style = 'position:absolute; width: 180px; length: 300px; bottom:20px; left: 80%;' alt='Mountain View'>";
        document.getElementsByClassName("container")[0].innerHTML = t;
        var death = 10;
		var msg;
        $(document).ready(function(){
			death = (Math.floor(Math.random()*10));
            if(death < 6){
				msg = "You made it across perfectly fine!";
                $("#ok").animate({left: '10%'},10000,function(){alert(msg); tempTraveled++; totalTraveled++; mainGame();});
            }
			else{
				msg = "Your wagon tipped over! " + riverLoss();
                $("#ok").animate({left: '600px'},5000,function(){$("#ok").attr("src", "image/Capsize.png"); tempTraveled++; totalTraveled++; alert(msg);});//add who dies and what supplies are lost here
                $("#ok").delay(3000).animate({left: '10%'},10000,function(){mainGame();});
            }
        });
		riverDepth = 0; riverWidth = 0; ferryWait = 0; riverChange = 2;
}

var timeLeft;

//function to show amount of fish caught
function fishResults(){
	timeLeft = 0;
	$('body').css('cursor', 'default');
	document.getElementsByClassName("container")[0].innerHTML = "<p>You were able to get "+(supplies[FOOD]-tempSupplies[FOOD])+" pounds of food from fishing." + spaceTxt + "</p>";
	$(document).keypress(function(e){
		if(e.keyCode == SPACEBAR){
			$(this).unbind();
			locationInfo();
		}
	});
}

//function to let user with options to fish or not to fish
function fish(){
	if(supplies[BAIT] <= 0) {document.getElementsByClassName("container")[0].innerHTML = "<p>You have no bait to fish. You must buy some first.</p> <button onclick='locationInfo()' class='button'><span>Back</span></button>"; return;}
	tempSupplies[FOOD] = supplies[FOOD];
	var t = "<p>Amount of bait left: <span id='baitAmt'>"+supplies[BAIT]+"</span><br>\
			<label id='fishMsg'></label></p>\
			<p>To catch fish: Simply drag and drop the fish using your hook on to the bucket</p>\
			<button onclick='catchfish()' id='contFish' class='button'><span>Attempt to Fish</span></button><br>\
			<button onclick='fishResults()' id='stopFish' class='button'><span>Stop Fishing</span></button>"
	document.getElementsByClassName("container")[0].innerHTML = t;
}

//user decides to fish
//functions to animate movement of fish and capture fish using drag and drop ability
function catchfish(){
	
	var animate, fish = 0, left=0, imgObj=null;
	var right=1800, imbObj1=null;
	var right2=150, imbObj2=null;

	var fishcount = 0;
	var smallfish = 0, mediumfish = 0, largefish = 0;
	
	var t ="<style>\
			.droptarget {\
				float: left; \
				width: 100%; \
				height: 80%;\
				background: url(image/fishbackground.png);\
				background-repeat: no-repeat;\
				background-size: 100%;\
			}\
			#basket{\
				margin:0% 50%;\
				height:120px;\
				width:120px;\
				//border: 1px solid #aaaaaa;\
			}\
			#clicktarget{\
				height: 90px;\
				width: 90px;\
			}\
			#clicktarget1{\
				height: 90px;\
				width: 90px;\
			}	\
			#clicktarget2{\
				height: 90px;\
				width: 90px;\
			}	\
			#fishbasket{\
				height: 100%;\
				width: 100%;\
			}	\
			div{\
				color: yellow;\
			}\
			</style>\
			<div align='center' style='text-align:center'>\
				<div id='fishcount'></div>\
				<div id='fishsort'></div>\
				<div id='fishsupply'></div>\
				<div id='timer'></div>\
			</div>\
			<div class='droptarget'>\
				<div id='basket' >\
					<img id='fishbasket' src='image/fishbasket.png'>\
				</div>\
				<img id='clicktarget' src='image/fish1.gif'>\
				<img id='clicktarget1' src='image/fish2.gif'>\
				<img id='clicktarget2' src='image/fish3.gif'>\
			</div>\
			<button onclick='fishResults()' id='stopFish2' class='button'><span>Stop Fishing</span></button>";
			
	document.getElementsByClassName("container")[0].innerHTML = t;
				
	//change cursor to a hook			
	document.getElementsByTagName("body")[0].style.cursor = "url('http://userpages.umbc.edu/~mmilbo1/cursor.cur'), auto";

	//set timer of 15 seconds
	timeLeft = 15;
	var elem = document.getElementById('timer');

	//countdown time
	var timerId = setInterval(countdown, 1000);

	//function to jump to result page to get amount of fish calculated when time is zero
	//or continue to countdown
	function countdown() {
		if (timeLeft == 0) {
			clearTimeout(timerId);
			fishResults();
		} 
		else {
			document.getElementById('timer').innerHTML ="Time Remaining: " + timeLeft + " seconds";
			timeLeft--;
		}
	}
	
	//start fish animation function
	initfish();
	
	function initfish(){
		
		//check for bait available
		if(supplies[BAIT] == 0){
			alert("You do not have any bait to fish");
			fishResults();
		}
		
		//set position of fish1 show up at random
	   $("#clicktarget").show();
	   imgObj = document.getElementById('clicktarget');
	   imgObj.style.position= 'absolute';
	   imgObj.style.top = (Math.floor(Math.random()*(500-150+1)+150) +'px');
	   imgObj.style.left = '0px';
	   imgObj.style.visibility='hidden';

		//set position of fish2 show up at random
	   $("#clicktarget1").show();
	   imgObj1 = document.getElementById('clicktarget1');
	   imgObj1.style.position= 'absolute';
	   imgObj1.style.top = (Math.floor(Math.random()*(500-150+1)+150) +'px');
	   imgObj1.style.left = '1800px';
	   imgObj1.style.visibility='hidden';
	   
	   //set position of fish3 show up at random
	   $("#clicktarget2").show();
	   imgObj2 = document.getElementById('clicktarget2');
	   imgObj2.style.position= 'absolute';
	   imgObj2.style.top = (Math.floor(Math.random()*(500-150+1)+150) +'px');
	   imgObj2.style.left = '1800px';
	   imgObj2.style.visibility='hidden';
	   
	   //move the fish across the screen
	   movefish();
	}
	
	function movefish(){
		left = parseInt(imgObj.style.left, 10);
		right = parseInt(imgObj1.style.left, 10);
		right2 = parseInt(imgObj2.style.left, 10);
		
		//if moving left is not 1800 px ye
		if (1800>= left) {

			//fish1 move right 5 pix
			imgObj.style.left = (left + 5) + 'px';
			imgObj.style.visibility='visible';
			
			//fish2 move left 5 pix
			imgObj1.style.left = (right - 5) + 'px';
			imgObj1.style.visibility='visible';
			
			//fish3 move left 10 pix
			imgObj2.style.left = (right2 - 10) + 'px';
			imgObj2.style.visibility='visible';
			
			animate = setTimeout(function(){movefish();},10); // call movefish  in 10msec
			
		}
		else {
				//continue to loop back fish function to spawn fish
				//otherwise end fish
				if(fish < 9999){
					left=0, imgObj=null;
					right=1800, imgObj1=null;
					right2=1800, imgObj2=null;
					fish = fish +1;
					$("#clicktarget").hide();
					$("#clicktarget1").hide();
					$("#clicktarget2").hide();
					initfish();
				}	
				else{
				
					imgObj.style.visibility='hidden';
					imgObj1.style.visibility='hidden';
					imgObj2.style.visibility='hidden';
					stopfish();
				}
		}

	}

	function stopfish(){
	   clearTimeout(animate);
	}

	//display count and amount of fish and time
	document.getElementById('fishcount').innerHTML ="Number of fish caught: " + fishcount;
	document.getElementById('fishsort').innerHTML ="Small fish: " + smallfish +"  | Medium fish: " + mediumfish +"  | Large fish: " + largefish;
	document.getElementById('fishsupply').innerHTML ="Amount of bait left: " + supplies[BAIT];
	document.getElementById('timer').innerHTML ="Time Remaining: " + timeLeft + " seconds";
	
	
	//drag and drop function
	$(function() {
		
		//set fish1,2,3 as able to drag
		$( "#clicktarget" ).draggable();
		$( "#clicktarget1" ).draggable();
		$( "#clicktarget2" ).draggable();
		
		//set basket as able to drop
		$( "#basket" ).droppable({
		
			//drop event
			drop: function( event, ui ) {
				//get fish id that is dropped
				var id = ui.draggable.attr("id");
				
				//when fish1 is dropped it will disappear
				//increase small fish caught as well as supplies
				if(id == "clicktarget"){
					$("#clicktarget").hide();
					smallfish++;
					if(job == "Fisher") supplies[FOOD] += 5;
					else supplies[FOOD] += 3;
				}	
				//when fish3 is dropped it will disappear
				//increase medium fish caught as well as supplies
				else if(id == "clicktarget1"){
					$("#clicktarget1").hide();
					mediumfish++;
					if(job == "Fisher") supplies[FOOD] += 8;
					else supplies[FOOD] += 5;
				}
				//when fish3 is dropped it will disappear
				//increase large fish caught as well as supplies
				else{
					$("#clicktarget2").hide();
					largefish++;
					if(job == "Fisher") supplies[FOOD] += 15;
					else supplies[FOOD] += 10;
				}
			
			
				fishcount++;
				supplies[BAIT]--;
				
				//display count and amount of fish and time
				document.getElementById('fishcount').innerHTML ="Number of fish caught: " + fishcount;
				document.getElementById('fishsort').innerHTML ="Small fish: " + smallfish +" Medium fish: " + mediumfish +" Large fish: " + largefish;
				document.getElementById('fishsupply').innerHTML ="Amount of bait left: " + supplies[BAIT];
				document.getElementById('timer').innerHTML ="Time Remaining: " + timeLeft + " seconds";
				
				//check bait available
				if(supplies[BAIT] == 0){
					fishResults();
				}
			}	

		
		});

	});
	
}

//Displays the animation for ferrying accross the river.
function ferryAnimation(){
	var t = "<img src='image/Ford.JPG' id='bkg' style = 'position:absolute; width:100%; height:100%;' alt='Mountain View'>\
	<img src='image/Cross.png' id='ok' style = 'position:absolute; width: 180px; length: 300px; bottom:20px; left: 80%;' alt='Mountain View'>";
	document.getElementsByClassName("container")[0].innerHTML = t;
	if(soundOn){//plays river sounds if music is on
			river.loop = true;
			river.play();
	}	
    $(document).ready(function(){$("#ok").animate({left: '10%'},10000,function(){alert("The ferry takes you across the river safely."); mainGame();});});
}

//Checks to see if you have enough money to ride the ferry, then increments the amount of days needed to wait. Also subtracts from food for each day
function ferryFinish(){
	if(supplies[MONEY] < 5) document.getElementsByClassName("container")[0].innerHTML = "<p>You do not have enough money to ride the ferry!"+spaceTxt+"</p>";
	else{
		document.getElementsByClassName("container")[0].innerHTML = "<p>You wait "+ferryWait+" days and take the ferry across the river."+spaceTxt+"</p>";
		changeWeather();
		var i;
		for(i = 0; i < ferryWait; i++) eatFood();
		ferryWait = 0; riverDepth = 0; riverWidth = 0; riverChange = 2;
	}
	$(document).keypress(function(e){
		if(e.keyCode == SPACEBAR){
			$(this).unbind();
			if(supplies[MONEY] < 5) riverOptions();
			else if(numCharacters == 0) lostGame();
			else {supplies[MONEY] -= 5; prevLocation=currLocation; currLocation=""; tempTraveled++; totalTraveled++; ferryAnimation();}
		}
	});
}

//Asks the user if they want to take a ferry. The number of days to wait is randomly generated from 1-5 days
function ferry(){
	if(ferryWait == 0) ferryWait = Math.floor(Math.random() * (5)) + 1;
	document.getElementsByClassName("container")[0].innerHTML = "<p>The ferry can take you across the river safely. It will cost $5, and you will have to wait for "+ferryWait+" days.<br>\
																Do you want to take the ferry?</p> <button onclick='ferryFinish()' class='button'><span>Yes</span></button><br><button onclick='riverOptions()' class='button'><span>No</span></button>";
}

//The user waits a day by the river to see if conditions change. River depth can increase/decrease based on weather
function riverWait(){
	document.getElementsByClassName("container")[0].innerHTML = "<p>You camp near the river for a day.</p>" + spaceTxt;
	day++; setDate(); eatFood(); changeWeather();
	if(numCharacters == 0){lostGame(); return;}
	if(gameStatus[WEATHER] == RAINY || gameStatus[WEATHER] == VERYRAINY){if(riverChange < 4) {Math.round((riverDepth += .2) * 10) / 10; Math.round((riverChange += .2) * 10) / 10;}}
	else{if(riverChange > 0){Math.round((riverDepth -= .2) * 10) / 10; Math.round((riverChange -= .2) * 10) / 10;}}
	$(document).keypress(function(e){
		if(e.keyCode == SPACEBAR){$(this).unbind(); riverOptions();}
	});
}

//Tells the user about the different options on the river menu
function riverInfo(){
	document.getElementsByClassName("container")[0].innerHTML = "<p>To ford a river means to pull your wagon across a <br>shallow part of the river, with the oxen still attached.</p>\
	<p>To caulk the wagon means to seal it so that no water can get in.<br>The wagon can then be floated across like a boat.</p>\
	<p>To use a ferry means to put your wagon on top of a flat boat that belongs to someone else.<br>The owner of the ferry will take your wagon across the river for a fee.</p>" + spaceTxt;
	$(document).keypress(function(e){
		if(e.keyCode == SPACEBAR){$(this).unbind(); riverOptions();}
	});
}

//Sets the river dimensions based on the river location
function setRiver(){
	if(currLocation == "Kansas River crossing") {riverWidth = 628; riverDepth = 4.8;}
	else if(currLocation == "Big Blue River crossing") {riverWidth = 235; riverDepth = 3.0;}
	else if(currLocation == "Green River crossing") {riverWidth = 400; riverDepth = 20.0;}
	else if(currLocation == "Snake River crossing") {riverWidth = 1000; riverDepth = 6.0;}
}

//Tells you information about the river before the main river menu
function preRiver(){
	randMsg = "";
	if(riverDepth == 0) setRiver();
	document.getElementsByClassName("container")[0].innerHTML = "<h2>" + currLocation + "<br>" + months[month] + " " + day + ", " + year + "</h2>\
																<p id='river'>You must cross the river in order to continue.<br>\
																The river at this point is currently "+riverWidth+" feet across, and "+riverDepth+" feet deep in the middle.<br><br>Press SPACE BAR to Continue</p>";
	$(document).keypress(function(e){
		if(e.keyCode == SPACEBAR){
			$(this).unbind();
			riverOptions();
		}
	});
}

//Displays all the options of the river location to the user
function riverOptions(){
	document.getElementsByClassName("container")[0].innerHTML = "<h2>" + currLocation + "<br>" + months[month] + " " + day + ", " + year + "</h2><p>Weather: "+currWeather+"<br>\
			River width: "+riverWidth+" feet <br>River depth: "+riverDepth.toFixed(1)+" feet<br>\
			You may: <br><br>\
			<button class='button' onclick='ford()'><span>Ford the River</span></button><br>\
			<button class='button' onclick='floatWagon()'><span>Float the Wagon</span></button><br>\
			<button class='button' onclick='ferry()'><span>Take a Ferry</span></button><br>\
			<button class='button' onclick='riverWait()'><span>Wait</span></button><br>\
			<button class='button' onclick='riverInfo()'><span>Get Information</span></button></p>";
}

//Increments the date based on the user input. The crew's overall health is increased per day of rest.
function rest(){
	var daysInput;
	var t = "<p>How many days would you like to rest?</p>\
			<input class='names' type='text' id='restDays' value='' maxlength='1' size='4' placeholder='Number of Days' onkeypress='return restInput(event)'><br>\
			<button id='rest' class='button'>Submit</button>";
			
	document.getElementsByClassName("container")[0].innerHTML = t;
		
		$("#rest").click(function(){
			daysInput = $("#restDays").val();
			if(daysInput == "") daysInput = 0;
			day += parseInt(daysInput);
			setDate();
			changeWeather();
			var i;
			for(i = 0; i < daysInput; i++) {eatFood(); addTeamHP(5); if(oxenInjured && Math.floor(Math.random() * (2)) == 0) oxenInjured = 0;}
			locationInfo();
		});	
}

//Validate input for rest input
function restInput(input){
	var key;
	document.getElementById ? key = input.keyCode: key = input.which;
	return ((key > 47 && key < 58) || key == 8 || key == 13);
}

//User accepted the trade offer. Makes the transaction.
function tradeAccept(type, amt, typePart){
	supplies[type[0]] += amt[0];
	supplies[type[1]] -= amt[1];
	if(type[0] == PARTS) {if(brokenPart == typePart[0]){brokenPart = 3; supplies[PARTS]--;} else parts[typePart[0]]++;}
	if(type[1] == PARTS) parts[typePart[1]]--;
	locationInfo();
}

//Checks to see if there is a trade offer based on random number generation, and also uses random number generation to determine
//what the trade offer is. The merchant class gets better offers here. Also increments a day.
function trade(){
	day++;
	eatFood();
	changeWeather();
	var canTrade = 1;
	var tradeAmt = [0,0];
	var tradeItem = ["",""];
	var rand = [0,0];
	var randPart = [0,0];
	//If 1 then someone wants to trade
	if(Math.floor(Math.random() * (2))){
		var i;
		//Generating the trade offer
		for(i = 0; i < 2; i++){
			rand[i] = Math.floor(Math.random() * (5)) + 1;
			if(i == 1){
				if(rand[1] == rand[0]){if(rand[1] == 5) rand[1]--; else rand[1]++;}
			}
			if(rand[i] == FOOD) {tradeAmt[i] = 100; tradeItem[i] = "pounds of food"; if(i == 0 && job == "Merchant") tradeAmt[i] += 50;}
			else if(rand[i] == BAIT) {tradeAmt[i] = 200; tradeItem[i] = "bait"; if(i == 0 && job == "Merchant") tradeAmt[i] += 100;}
			else if(rand[i] == OXEN) {tradeAmt[i] = 1; tradeItem[i] = "ox"; if(i == 0 && job == "Merchant") tradeAmt[i]++;}
			else if(rand[i] == CLOTHING) {tradeAmt[i] = 2; tradeItem[i] = "sets of clothing"; if(i == 0 && job == "Merchant") tradeAmt[i] += 2;}
			else if(rand[i] == PARTS){
				randPart[i] = Math.floor(Math.random() * (3))
				if(randPart[i] == WHEEL) {tradeAmt[i] = 1; tradeItem[i] = "wagon wheel"; if(i == 0 && job == "Merchant") tradeAmt[i]++;}
				else if(randPart[i] == AXLE) {tradeAmt[i] = 1; tradeItem[i] = "wagon axle"; if(i == 0 && job == "Merchant") tradeAmt[i]++;}
				else if(randPart[i] == TONGUE) {tradeAmt[i] = 1; tradeItem[i] = "wagon tongue"; if(i == 0 && job == "Merchant") tradeAmt[i]++;}
			}
		}
		//Make sure you have enough to trade
		if(rand[1] == PARTS){if(parts[randPart[1]] < 1) canTrade = 0;}
		else if(supplies[rand[1]] < tradeAmt[1]) canTrade = 0;
		var t = "<p>A fellow traveler would like to offer you " + tradeAmt[0] + " " + tradeItem[0] + " for " + tradeAmt[1] + " " + tradeItem[1];
		if(canTrade) t += ".<br>Do you accept the offer?</p> <button id='acceptTrade' class='button'>Yes</button><br><button id='back' class='button'>No</button>";
		else t += ",<br>but you do not have the supplies to trade.</p> <button id='back' class='button'>Back</button>";
		document.getElementsByClassName("container")[0].innerHTML = t;
	}
	//No one wants to trade
	else{
		document.getElementsByClassName("container")[0].innerHTML = "<p>There is no trade offer today.</p><button id='back' class='button'>Back</button>"
	}
	$("#acceptTrade").click(function() {$(this).unbind(); $("#back").unbind(); tradeAccept(rand, tradeAmt, randPart);});
	$("#back").click(function(){$(this).unbind(); $("#acceptTrade").unbind(); locationInfo();});
}

//The Route functions append different locations and distances to the global arrays based on what route the user chose
function firstDRoute1(){
	locations.push.apply(locations, ["Green River crossing", "Soda Springs", "Fort Hall", "Snake River crossing", "Fort Boise", "Blue Mountains"]);
	distance.push.apply(distance, [57, 143, 57, 182, 113, 160]);
	locType.push.apply(locType, [RIVER, 0, TOWN, RIVER, TOWN, DIVIDE2]);
	mainGame();
}
function firstDRoute2(){
	locations.push.apply(locations, ["Fort Bridger", "Soda Springs", "Fort Hall", "Snake River crossing", "Fort Boise", "Blue Mountains"]);
	distance.push.apply(distance, [125, 162, 57, 182, 113, 160]);
	locType.push.apply(locType, [TOWN, 0, TOWN, RIVER, TOWN, DIVIDE2]);
	mainGame();
}
function secondDRoute1(){
	locations.push.apply(locations, ["Fort Walla Walla", "The Dalles", "Willamette Valley"]);
	distance.push.apply(distance, [55, 120, 100]);
	locType.push.apply(locType, [TOWN, 0, END]);
	mainGame();
}
function secondDRoute2(){
	locations.push.apply(locations, ["The Dalles", "Willamette Valley"]);
	distance.push.apply(distance, [125, 100]);
	locType.push.apply(locType, [0, END]);
	mainGame();
}

//Displays the different dialogue based on the location the user is at
function talk(){
	var t;
	if(currLocation == "Independence") t = "<p>A town resident tells you:<br><br>\"Some folks seem to think that two oxen are enough to get them to Oregon!<br>\
	Two oxen can barely move a fully loaded wagon, and if one of them gets sick or dies,<br>you won't be going anywhere. I wouldn't go overland with less than six.\"";
	else if(currLocation == "Kansas River crossing") t = "<p>Aunt Rebecca Sims tells you:<br><br>\"With the crowds of people waiting to get on the ferry,<br>\
	we could be stranded here for days! Hope there's enough graze for all those animals --<br>not many people carry feed! I'd rather wait, though, than cross in a rickety wagon boat!\"";
	else if(currLocation == "Big Blue River crossing") t = "<p>A lady, Marnie Stewart, tells you:<br><br>\"This prairie is mighty pretty with all the wild flowers and tall grasses.<br>\
	But there's too much of it! I miss not having a town nearby. I wonder how many days until I see a town --<br>a town with real shops, a church, people...\"";
	else if(currLocation == "Fort Kearney") t = "<p>A fort soldier tells you:<br><br>\"The trails from the jumping off places -- Independence, St. Joseph, Council Bluffs --<br>\
	come together at Fort Kearney. This new fort was built by the U.S. Army<br>to protect those bound for California and Oregon.\"";
	else if(currLocation == "Chimney Rock") t = "<p>Celinda Hines tells you:<br><br>\"Chimney Rock by moonlight is awfully sublime. Many Indians came<br>\
	to our wagon with fish to exchange for clothing. We bought a number.<br>They understand \'swap\' and \'no swap.\' Seem most anxious to get shirts and socks.\"";
	else if(currLocation == "Fort Laramie") t = "<p>A woman traveler tells you:<br><br>\"Be warned, stranger. Don't dig a water hole! Drink only river water.<br>\
	Salty as the Platte River is -- it's better than the cholera. We buried my husband last week.<br>Could use some help with this harness, if you can spare the time.\"";
	else if(currLocation == "Independence Rock") t = "<p>Aunt Rebecca Sims tells you:<br><br>\"No butter or cheese or fresh fruit since Fort Laramie! Bless me,<br>\
	but I'd rather have my larder full of food back East then have our names carved on that rock!<br>Well, tis a sight more cheery than all the graves we passed.\"";
	else if(currLocation == "South Pass") t = "<p>An Arapho Indian tells you:<br><br>\"When the white man first crossed our lands their wagons were few.<br>\
	Now they crowd the trail in great numbers. The land is overgrazed with their many animals.<br>Do any white men still live in the East? My people talk of moving.\"";
	else if(currLocation == "Green River crossing") t = "<p>A young boy tells you:<br><br>\"My family didn't buy enough food in Independence. We have been eating very small rations since Fort Laramie.<br>\
	Because of that our health is poor. My sister has mountain fever, so we're stopped here for a while.\"";
	else if(currLocation == "Fort Bridger") t = "<p>A trader tells you:<br><br>\"This fort was built by Jim Bridger. Jim was a mountain man before<br>\
	he put in this blacksmith shop and small store to supply the overlanders.<br>Does a big trade in horses, Jim and his partner, Vasquez.\"";
	else if(currLocation == "Soda Springs") t = "<p>Celinda Hines tells you:<br><br>\"My, the Soda Springs are so pretty! Seem to spout at regular intervals.<br>\
	Felt good to just rest and not be jostled in the wagon all day. When I get to Oregon,<br>I'll have a soft feather bed and never sleep in a wagon again!\"";
	else if(currLocation == "Fort Hall") t = "<p>Aunt Rebecca tells you:<br><br>\"Hear there's mountain sheep around here. Enough water too, but hardly a stick of wood.<br>\
	Thank heaven for Fort Hall! But I'm real sorry to be saying goodbye to cousin Miles and all the folks heading for California.\"";
	else if(currLocation == "Snake River crossing") t = "<p>Big Louie tells you:<br><br>\"See that wild river? That's the Snake. Many a raft's been swamped in her foaming rapids.<br>\
	Her waters travel all the way to Oregon! We'll be crossing her soon,<br>and then again after Fort Boise. Take care at the crossing!\"";
	else if(currLocation == "Fort Boise") t = "<p>A trader with 6 mules tells you:<br><br>\"You'll not get yer wagon over them Blue Mountains, mister. Leave it!<br>\
	Cross yer goods over with pack animals. Get yerself a couple of good mules.<br>Pieces of wagons litter the trail -- left by them folks who don't heed good advice!\"";
	else if(currLocation == "Blue Mountains") t = "<p>Jacob Hofsteader tells you:<br><br>\"This valley of the Grande Ronde is the most beautiful sight in months.<br>\
	Water and graze in abundance! And if this valley is so fine,<br>the Willamette must be twice as fine! We'll be sittin' pretty in our new homestead!\"";
	else if(currLocation == "Fort Walla Walla") t = "<p>A Cayuse Indian tells you:<br><br>\"You ask about the Whitman massacre. I ask you why Doctor Whitman's<br>\
	medicine did not cure my people's children? Many caught measles from the strangers.<br>Why did the medicine poison our children and cure the children of white people?\"";
	else if(currLocation == "The Dalles") t = "<p>A mountain man tells you:<br><br>\"These last hundred miles to Willamette are the roughest -- either rafting down<br>\
	the swift and turbulent Columbia River or driving your wagon over<br>the steep Cascade Mountains. Hire an Indian guide if you take the river.\"";
	t += "</p>" + spaceTxt;
	document.getElementsByClassName("container")[0].innerHTML = t;
	$(document).keypress(function(e){
		if(e.keyCode == SPACEBAR){
			$(this).unbind();
			locationInfo();
		}
	});
}

//Checks to see if the user can pay the toll for the Barlow Road
function payToll(){
	if(supplies[MONEY] < 8.50) alert("You do not have enough money to pay the $8.50 toll for this road.");
	else {alert("You pay the toll of $8.50 to travel on this road."); supplies[MONEY] -= 8.50; mainGame()};
}

//Gives you instructions on how to navigate the Columbia River before the minigame starts
function columInfo(){
	var t = "<h1>The Columbia River</h1><p>Navigating the river is very dangerous! To safely reach the end, you need to avoid the obstacles along the way.<br>\
			Use the arrow keys to sail your wagon in different directions to avoid the oncoming rocks. If you make it, you will have reached Oregon! Good Luck!</p>" + spaceTxt;
	document.getElementsByClassName("container")[0].innerHTML = t;
	$(document).keypress(function(e){
		if(e.keyCode == SPACEBAR){
			$(this).unbind();
			columRiver();
		}
	})
}

//Displays the map of the Oregon Trail
function checkMap(num = 0){
	document.getElementsByClassName("container")[0].innerHTML = spaceTxt+ "<img src='image/Map.PNG' style='width:700px; height:400px; left:50%; margin-left: -350; position:absolute; background-color: black'></img>"
	$(document).keypress(function(e){
		if(e.keyCode == SPACEBAR){
			$(this).unbind();
			if(num) {currLocation = prevLocation; leaveTown();}
			else locationInfo();
		}
	});
}

//Leaves the location the user stopped at to continue on the trail. Also checks for diverging routes based on location.
function leaveTown(){
	if(supplies[OXEN] <= 0){alert("You need oxen to continue on the trail!"); return;}
	else if(brokenPart == WHEEL){alert("You need to replace your broken wheel to continue on the trail!"); return;}
	else if(brokenPart == AXLE){alert("You need to replace your broken axle to continue on the trail!"); return;}
	else if(brokenPart == TONGUE){alert("You need to replace your broken tongue to continue on the trail!"); return;}
	
	
	if(currType == DIVIDE1) document.getElementsByClassName("container")[0].innerHTML = "<p>There are two different routes to take.<br>Where would you like to go to next?<br><br>\
																						<button onclick='firstDRoute1()' class='button'><span>Green River crossing</span></button><br>\
																						<button onclick='firstDRoute2()' class='button'><span>Fort Bridger</span></button><br><button class='button' onclick='checkMap(1)'><span>See Map</span></button></p>";
	else if(currType == DIVIDE2) document.getElementsByClassName("container")[0].innerHTML = "<p>There are two different routes to take.<br>Where would you like to go to next?<br><br>\
																						<button onclick='secondDRoute1()' class='button'><span>Fort Walla Walla</span></button><br>\
																						<button onclick='secondDRoute2()' class='button'><span>The Dalles</span></button><br><button class='button' onclick='checkMap(1)'><span>See Map</span></button></p>";
	else if(currLocation == "The Dalles") document.getElementsByClassName("container")[0].innerHTML = "<p>There are two different routes to take.<br>Where would you like to go to next?<br><br>\
																						<button onclick='columInfo()' class='button'><span>The Columbia River</span></button><br>\
																						<button onclick='payToll()' class='button'><span>The Barlow Road</span></button><br>\
																						(There is a toll of $8.50 for this road.)<br><br>\
																						<button class='button' onclick='checkMap(1)'><span>See Map</span></button></p>";
	else{mainGame();}
	prevLocation = currLocation;
	currLocation = "";
	
}

//Displays the different options the user has based on location (fort, trail, river, etc.)
function locationInfo() {
	if(soundOn){//stops town music if music is on
		bkg.pause();
		bkg.load();
		land.pause();
		land.load();
		coast.pause();
		coast.load();
	}
	if(numCharacters == 0){lostGame(); return;}
	randMsg = "";
	setHealth();
	setDate();
    var t = "";
    //Checking if in town or on the trail
    if (currLocation != "") t += "<h2>" + currLocation + "<br>" + months[month] + " " + day + ", " + year + "</h2>";
    else t += "<h2>" + months[month] + " " + day + ", " + year + "</h2>"
    t += "<p>Weather: " + currWeather + "<br>\
			Health: " + currHealth + "<br>\
			Pace: " + currPace + "<br>\
			Rations: " + currRations + "<br>\</p>\
			<div id='townOptions'><p>You may:</p><br><br>\
			<div class='game_ctrls'>\
			<button class='button button3' onclick=''><span>Continue on trail</span></button>\
			<button class='button button3' onclick='checkSupplies()'><span>Check supplies</span></button>\
			<button class='button button3' onclick='checkMap()'><span>Look at map</span></button>\
			<button class='button button3' onclick='changePace()'><span>Change pace</span></button>\
			<button class='button button3' onclick='changeRations()'><span>Change food rations</span></button>\
			<button class='button button3' onclick='rest()'><span>Stop to rest</span></button>\
			<button class='button button3' onclick='trade()'><span>Attempt to trade</span></button>";
    if (currLocation != "") {
		t += "<button class='button button3' onclick='talk()'><span>Talk to people</span></button>";
		if(currType == TOWN) t += "<button class='button button3' onclick='buySupplies()'><span>Buy Supplies</span></button>";
		else if(currType == RIVER)t += "<button class='button button3' onclick='fish()'><span>Go Fishing</span></button>"
	}
    t += "</div> </div>";
    document.getElementsByClassName("container")[0].innerHTML = t;
	if (currLocation != "") {
		if(currType == RIVER && tempTraveled == 0) document.getElementsByClassName("button")[0].setAttribute("onclick", "preRiver()");
		else document.getElementsByClassName("button")[0].setAttribute("onclick", "leaveTown()");
	}
	else document.getElementsByClassName("button")[0].setAttribute("onclick", "mainGame()");
}

//Displays the location image if the user chooses to stop there. User wins if they get to the last location.
function displayLocation(){
	var locImg;
	if(currLocation == "Willamette Valley"){
		if(soundOn){//plays victory music if music is on
			victory.play();
		}
	}
	else if (currType == TOWN){
		if(soundOn){//plays town music if music is on
			bkg.loop = true;
			bkg.play();
		}
	}
	else if (currType == RIVER){
		if(soundOn){//plays town music if music is on
			coast.loop = true;
			coast.play();
		}
	}
	else{
		if(soundOn){
			land.loop = true;
			land.play();
		}
	}
	if(currLocation == "Kansas River crossing") locImg = "image/locations/Kansas_River.jpg";
	else if(currLocation == "Big Blue River crossing") locImg = "image/locations/Big_Blue_River.png";
	else if(currLocation == "Fort Kearney") locImg = "image/locations/Fort_Kearney.png";
	else if(currLocation == "Chimney Rock") locImg = "image/locations/Chimney_Rock.jpg";
	else if(currLocation == "Fort Laramie") locImg = "image/locations/Fort_Laramie.jpg";
	else if(currLocation == "Independence Rock") locImg = "image/locations/Independence_Rock.png";
	else if(currLocation == "South Pass") locImg = "image/locations/South_Pass.jpg";
	else if(currLocation == "Fort Hall") locImg = "image/locations/Fort_Hall.png";
	else if(currLocation == "Fort Bridger") locImg = "image/locations/Fort_Bridger.jpg";
	else if(currLocation == "Green River crossing") locImg = "image/locations/Green_River.png";
	else if(currLocation == "Soda Springs") locImg = "image/locations/Soda_Springs.jpg";
	else if(currLocation == "Snake River crossing") locImg = "image/locations/Snake_River.jpg";
	else if(currLocation == "Fort Boise") locImg = "image/locations/Fort_Boise.jpg";
	else if(currLocation == "Blue Mountains") locImg = "image/locations/Blue_Mountains.jpg";
	else if(currLocation == "Fort Walla Walla") locImg = "image/locations/Fort_Walla_Walla.jpg";
	else if(currLocation == "The Dalles") locImg = "image/locations/The_Dalles.jpg";
	else if(currLocation == "Willamette Valley") locImg = "image/locations/Willamette_Valley.png";
	var t = "<h2>" + currLocation + "<br>" + months[month] + " " + day + ", " + year + "</h2>\
			"+spaceTxt+"<img src='"+locImg+"' style='width:700px; height:400px; left:50%; margin-left: -350; position:absolute; background-color: black'></img>";
	document.getElementsByClassName("container")[0].innerHTML = t;
	$(document).keypress(function(e){
		if(e.keyCode == SPACEBAR){
			$(this).unbind();
			if(currLocation == "Willamette Valley") endGame();
			else locationInfo();
		}
	});
}

//Gives user the option to stop at a location (fort, river, other)
function stopLocation() {
	if(numCharacters == 0){lostGame(); return;}
    var t = "<p><label>"+randMsg+"</label><br>You have reached " + currLocation + ".<br> Do you want to look around?</p>\
			<button class='button' onclick='displayLocation()'><span>Yes</span></button>&nbsp<button class='button' onclick=''><span>No</span></button>";
    document.getElementsByClassName("container")[0].innerHTML = t;
	if(currType == RIVER) document.getElementsByClassName("button")[1].setAttribute("onclick", "preRiver()");
	else document.getElementsByClassName("button")[1].setAttribute("onclick", "leaveTown()");
	randMsg = "";
}