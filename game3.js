/*******************************************************************
 * File:    game3.js
 * Project: CMSC 433 - Project 2 - Oregon Trail
 * Author : Krunal Hirpara, Arvin Siva, Marcus Milbourne, Phuoc Nguyen
 * Date   : 05/16/17
 * Section: 01		
 * E-mail:  kz79934@umbc.edu, sivaar1@umbc.edu, mmilbo1@umbc.edu,
 *          ej77536@umbc.edu
 *
 *   Misc. functions that help regulate the game. Includes random events.
 *   
 ******************************************************************/

//Adds health to every person in the crew. Things like filling rations and resting use this function.
function addTeamHP(num){
	var i;
	for(i = 0; i < hp.length; i++){
		if(hp[i] > 0 && hp[i] < 100){
			hp[i] += num;
			if(hp[i] > 100) hp[i] = 100;
		}
	}
}

//Reduces health from the entire crew. Things such as not enough clothing, fast pace, and small rations use this function.
//Uses some random number generation so everyone does not die at the same time.
function reduceTeamHP(num){
	var randNum = 0;
	var i;
	for(i = 0; i < hp.length; i++){
		if(hp[i] > 0){
			randNum = Math.floor(Math.random() * 3) + num;
			hp[i] -= randNum;
			if(hp[i] <= 0) {numCharacters--; alert(characters[i]+" has died!");}
		}
	}
}

//Reduces the health of an individual person. Things like diseases use this function.
function reduceCharHP(index, num){ 
	hp[index] -= num;
	if(hp[index] <= 0) {numCharacters--; alert(characters[index]+" has died!");}
}

//Adjusts the date of the game after incrementing day. Switches month if the day count exceeds the days of that current month.
function setDate(){
    if (day > monthDays[month]) {
        day = day % monthDays[month];
        if (month == 11) {
            month = 0;
            year++;
        }
        else month++;
    }
}

//Sets the overall crew health based on the combined total of HP	
function setHealth(){
	var totalHP = 0;
	var i;
	for(i = 0; i < hp.length; i++) {if(hp[i] > 0) totalHP += hp[i];}
	if(totalHP >= 350) {gameStatus[HEALTH] = GOOD; currHealth = "Good";}
	else if(totalHP >= 250) {gameStatus[HEALTH] = FAIR; currHealth = "Fair";}
	else if(totalHP >= 150) {gameStatus[HEALTH] = POOR; currHealth = "Poor";}
	else {gameStatus[HEALTH] = VERYPOOR; currHealth = "Very Poor";}
}

//Subtracts from the users food supply and either adds or reduces health based on ration option. Food depletion varies based on rations.
function eatFood(){
	if(supplies[FOOD] == 0) reduceTeamHP(10);
	else{
		var num;
		if(gameStatus[RATIONS] == FILLING) {num = 3; addTeamHP(1);}
		else if(gameStatus[RATIONS] == MEAGER) {num = 2; reduceTeamHP(2);}
		else if(gameStatus[RATIONS] == BAREBONES) {num = 1; reduceTeamHP(4);}
		var pounds = num * numCharacters;
		if(pounds > supplies[FOOD]) supplies[FOOD] = 0;
		else supplies[FOOD] -= pounds;
	}
}

//Changes the weather of the game based on random number generation. Algorithm changes based on time of year.
function changeWeather(){
	var num = Math.floor(Math.random() * (10));
	//Weather patterns based on months
	//Mostly Cold
	if(month >= 9 || month <= 1){
		if(num >= 4 && num <= 6) {currWeather = "Cold"; gameStatus[WEATHER] = COLD;}
		else if(num >= 7 && num <= 9) {currWeather = "Cool"; gameStatus[WEATHER] = COOL;}
		else if(num == 2) {currWeather = "Rainy"; gameStatus[WEATHER] = RAINY;}
		else if(num == 0) {currWeather = "Warm"; gameStatus[WEATHER] = WARM;}
		else if(num == 1) {currWeather = "Hot"; gameStatus[WEATHER] = HOT;}
		else if(num == 3) {currWeather = "Very Rainy"; gameStatus[WEATHER] = VERYRAINY;}
	}
	//Mostly Hot
	else if(month >= 4 && month <= 7){
		if(num == 0) {currWeather = "Cold"; gameStatus[WEATHER] = COLD;}
		else if(num == 1) {currWeather = "Cool"; gameStatus[WEATHER] = COOL;}
		else if(num == 2) {currWeather = "Rainy"; gameStatus[WEATHER] = RAINY;}
		else if(num >= 4 && num <= 6) {currWeather = "Warm"; gameStatus[WEATHER] = WARM;}
		else if(num >= 7 && num <= 9) {currWeather = "Hot"; gameStatus[WEATHER] = HOT;}
		else if(num == 3) {currWeather = "Very Rainy"; gameStatus[WEATHER] = VERYRAINY;}
	}
	//In Between
	else{
		if(num == 0) {currWeather = "Cold"; gameStatus[WEATHER] = COLD;}
		else if(num == 1 || num == 6 || num == 9) {currWeather = "Cool"; gameStatus[WEATHER] = COOL;}
		else if(num == 2 || num == 7) {currWeather = "Rainy"; gameStatus[WEATHER] = RAINY;}
		else if(num == 3 || num == 8) {currWeather = "Warm"; gameStatus[WEATHER] = WARM;}
		else if(num == 4) {currWeather = "Hot"; gameStatus[WEATHER] = HOT;}
		else if(num == 5) {currWeather = "Very Rainy"; gameStatus[WEATHER] = VERYRAINY;}
	}
}

//Generates a random even based on random chance. Certain events have high chance of happening based on conditions.
//Ex: If it is very rainy, higher chance that there is a severe storm. If overall health is poor, higher chance of disease.
function randomEvent(){
	var rand = 6;
	if(gameStatus[WEATHER] == RAINY) rand += 3;
	else if(gameStatus[WEATHER] == VERYRAINY) rand += 6;
	var num = Math.floor(Math.random() * (rand));
	//Lose days on the trail
	if(num == 0){
		if(Math.floor(Math.random() * 2)){
			randMsg = "You get lost on the trail! Lose 1 day.";
			eatFood();
			day++;
		}
		else{
			var randDay = Math.floor(Math.random() * 3) + 3;
			randMsg = "The trail is very rough! Lose "+randDay+" days."
			var i;
			for(i = 0; i < randDay; i++) eatFood();
			day += randDay;
		}
	}
	//Individual character diseases and other ailments
	else if(num == 1 || gameStatus[HEALTH] == VERYPOOR || gameStatus[HEALTH] == POOR){
		var tempMsg = "";
		var diseases = ["Typhoid Fever", "Cholera", "Dysentery", "Measles", "Diphtheria", "exhaustion", "a fever", "a broken arm", "a broken leg"];
		var tempIndicies = [];
		for(i = 0; i < hp.length; i++) {if(hp[i] > 0) tempIndicies.push(i);}
		var randIndex = Math.floor(Math.random() * (tempIndicies.length));
		if(hp[tempIndicies[randIndex]] < 40 || Math.floor(Math.random() * (2)) == 1){
			tempMsg += characters[tempIndicies[randIndex]] + " has " + diseases[Math.floor(Math.random() * (9))] + ".";
			reduceCharHP(tempIndicies[randIndex], 25);
		}

		randMsg = tempMsg;
	}
	//A part on the wagon broke
	else if(num == 2){
		brokenPart = Math.floor(Math.random() * (3));
		var tempMsg;
		if(brokenPart == WHEEL) tempMsg = "The wagon's wheel broke!";
		else if(brokenPart == AXLE) tempMsg = "The wagon's axle broke!";
		else if(brokenPart == TONGUE) tempMsg = "The wagon's tongue broke!";
		randMsg = tempMsg;
	}
	//A thief steals supplies
	else if(num == 3){
		var randThief = Math.floor(Math.random() * (4));
		if(randThief == 0 && supplies[OXEN] > 0){
			var sOxen = Math.floor(Math.random() * (3)) + 1;
			if(sOxen > supplies[OXEN]) sOxen = supplies[OXEN];
			supplies[OXEN] -= sOxen;
			randMsg = "A thief stole " + sOxen + " oxen while you were sleeping!";
		}
		else if(randThief == 1 && supplies[CLOTHING] > 0){
			var sClothing = Math.floor(Math.random() * (5)) + 2;
			if(sClothing > supplies[CLOTHING]) sClothing = supplies[CLOTHING];
			supplies[CLOTHING] -= sClothing;
			randMsg = "A thief stole " + sClothing + " sets of clothes while you were sleeping!";
		}
		else if(randThief == 2 && supplies[FOOD] > 0){
			var sFood = Math.floor(Math.random() * (151)) + 50;
			if(sFood > supplies[FOOD]) sFood = supplies[FOOD];
			supplies[FOOD] -= sFood;
			randMsg = "A thief stole " + sFood + " pounds of food while you were sleeping!";
		}
	}
	//Salvage items from abandoned wagons
	else if(num == 4){
		randMsg = "You spot an abandoned wagon";
		var randPart = Math.floor(Math.random() * (6))
		if(randPart == WHEEL){parts[WHEEL]++; supplies[PARTS]++; randMsg += ". It has a spare wheel.";}
		else if(randPart == AXLE){parts[AXLE]++; supplies[PARTS]++; randMsg += ". It has a spare axle.";}
		else if(randPart == TONGUE){parts[TONGUE]++; supplies[PARTS]++; randMsg += ". It has a spare tongue.";}
		else randMsg += ", but it is empty.";
	}
	//Find extra food
	else if(num == 5){randMsg = "You find wild fruit."; supplies[FOOD] += 50;}
	//Storms only happen if it is raining.
	else{
		var randDay = Math.floor(Math.random() * (2)) + 2;
		randMsg = "There is a severe storm! Lose "+randDay+" days";
		var i;
		for(i = 0; i < randDay; i++) eatFood();
		day += randDay;
		if(soundOn) rain.play();
	}
}

//Checks if the user has an unfixed broken part and/or no oxen. If they do, they cannot continue on trail until they address the issue.
function checkMove(){
	if(supplies[OXEN] <= 0) {alert("You have no oxen to pull your wagon!"); return 0;}
	else if(brokenPart == WHEEL) {alert("Your wagon cannot move with a broken wheel!"); return 0;}
	else if(brokenPart == AXLE) {alert("Your wagon cannot move with a broken axle!"); return 0;}
	else if(brokenPart == TONGUE) {alert("Your wagon cannot move with a broken tongue!"); return 0;}
	return 1;
}