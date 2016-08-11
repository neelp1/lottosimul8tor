//$(document).ready(function(){
		//script will perform the calculations for the simulation
		/*
		d3.js for visualizations
		*/

		var winningNums = [1,2,3,4,5,6,7]; //temporary code whilst working on scraping method
		var suppNums = [8,9];
		var divisionTally = [0,0,0,0,0,0,0,0];//else, div 1 count, div 2 count,.., div 7 count
		var divisionTotal = [0,0,0,0,0,0,0,0];//0, 352, 423,..,21000000
		var costPerGames = 1.10;
		var costPerGameSystem = [1.1,10.8,48.6,162,445.5,1069.2,2316.6,4633.2,8687.25];
		var numOfGames = 0;
		var profits = 0;
		var totalCost = 0;
		var totalProfits = 0;
		var netProfit = 0;
		var justGames = true;
		var formBInit = false;
		var $indexPage;//jQuery object
		var $buttons;

		/**
		* Form A validation
		*/
		function checkValid(){
			var $theForm = $('#formA');

			if($theForm.valid()){
				simulate();
			}else{
				console.log("Form not valid");
			}
		}

		/**
		* Form B validation
		*/
		function checkWeeksValid(){
			var $theForm = $('#formB');

			if($theForm.valid()){
				simulateWeeks();
			}else{
				console.log("Form not valid");
			}

		}

		/**
		* Main Method for single week
		*/
		function simulate(){
			var winningArray = [];
			var gameArray = [];
			var gameArrayCheck = [];
			profits = 0;

			winningArray = getRandomNumbers(1, 9);
			winningNums = winningArray.slice(0,7);
			suppNums = winningArray.slice(7);

			//insert draw number table
			$('#drawNumbers').remove();
			var template = $('#test_tmpl').html();
			$('#cost').after(template);

			printArray(winningArray);

			numOfGames = $('#numberOfGames').val();

			var cost = (numOfGames * costPerGames).toFixed(2);
			totalCost += (numOfGames * costPerGames);
			$('#cost').text('Cost: $' + cost);

			//TODO: change to a template
			//insert games table
			$('#gamesTable').remove();
			$('#drawNumbers').after('<table id="gamesTable"><caption>Game Results</caption></table>');
			$('#gamesTable').append('<tr><th>Game #</th><th>Mains</th><th>Supplementaries</th><th>Division Won</th></tr>');

			gameArray = getRandomNumbers(numOfGames, 7);
			for(var i = 0; i < numOfGames; i++){
				gameArrayCheck[i] = gameArray.slice(i*7, (i*7)+7);
			}

			//display division tally/table
			initialiseMultipleWeekTable();
			checkResults(gameArrayCheck);
			//update view of tally
			updateDivisionTableView();

			$('#profit').text('Profit: $' + profits);
			$('#total').text('Net (this week): $' + (profits - cost));

			updateSummary();
		}

		function updateSummary(){
			totalProfits += profits;
			$('#totalLosses').text('Gross Cost: $' + (totalCost).toFixed(2));
			$('#totalProfits').text('Gross Profits: $' + (totalProfits).toFixed(2));
			netProfit = totalProfits - totalCost;
			$('#summary').text('Net Profit: $' + (netProfit).toFixed(2));
		}

		/*
		* TODO: Simulate system 8 to 15
		*/
		function simulate_variable_system(system, numOfGames){
			var winningArray = [];
			var gameArray = [];
			var gameArrayCheck = [];//array of arrays
			profits = 0;

			winningArray = getRandomNumbers(1, 9);
			winningNums = winningArray.slice(0,7);
			suppNums = winningArray.slice(7);

			console.log('Winning numbers: ');
			console.log(winningNums);
			console.log('supplementary numbers: ');
			console.log(suppNums);

			var cost = (numOfGames * costPerGameSystem[system - 7]).toFixed(2);
			totalCost += (numOfGames * costPerGameSystem[system - 7]);
			console.log('Cost: ' + cost);

			gameArray = getRandomNumbers(numOfGames, system);
			console.log('Draw Numbers: ');
			for(var i = 0; i < numOfGames; i++){
				gameArrayCheck[i] = gameArray.slice(i*system, (i*system)+system);
				console.log(gameArrayCheck[i]);
			}

			console.log('Game#\tMains\tSupplementaries\tDivisionWon');
			checkResultsVariableSystem(gameArrayCheck);
			updateDivisionTableView();
			console.log('Profit: $' + profits);
			console.log('Net (this week): $' + (profits - cost));
			updateSummaryVariableSystem();
		}

		function updateSummaryVariableSystem(){
			totalProfits += profits;
			console.log('Gross Cost: $' + (totalCost).toFixed(2));
			console.log('Gross Profits: $' + (totalProfits).toFixed(2));
			netProfit = totalProfits - totalCost;
			console.log('Net Profit: $' + (netProfit).toFixed(2));
		}

		/**
		* Main method for multiple weeks
		*/
		function simulateWeeks(){
			var winningArray = [];
			var winningArraySliced = [];
			var gameArray = [];
			var gameArrayCheck = [];
			profits = 0;

			var numOfGames2 = $('#numberOfGames2').val();
			var numOfWeeks = $('#numberOfWeeks').val();

			totalCost += ((numOfGames2 * numOfWeeks) * costPerGames);

			//separate into number of weeks
			winningArray = getRandomNumbers(numOfWeeks, 9);

			for(var i = 0; i < numOfWeeks; i++){
				winningArraySliced[i] = winningArray.slice(i*9, (i*9)+9);
			}

			//separates all games
			gameArray = getRandomNumbers(numOfGames2 * numOfWeeks, 7);

			for(var i = 0; i < numOfGames2 * numOfWeeks; i++){
				gameArrayCheck[i] = gameArray.slice(i*7, (i*7)+7);
			}

			//run simulation
			var thisWeek = [];
			var simulationResults = [];

			//display division tally/table
			initialiseMultipleWeekTable();

			for(var i = 0; i < numOfWeeks; i++){
				winningNums = winningArraySliced[i].slice(0,7);
				suppNums = winningArraySliced[i].slice(7);
				for(var j = 0; j < numOfGames2; j++){
					thisWeek[j] = gameArrayCheck[(i * numOfGames2) + j];
				}

				checkResultsForMultiple(thisWeek);
				//update view of tally
				updateDivisionTableView();
				updateSummary();
				profits = 0;
			}
		}

		/**
		* display division tally/table
		*/
		function initialiseMultipleWeekTable(){
			if(!formBInit){
				$('#MultipleWeeksTable').remove();
				var template = $('#multiple_tmpl').html();
				$('#insertTable').after(template);
				formBInit = true;
			}
		}

		/**
		* Creates tables when main page link is clicked. Saved main element
		* reloaded
		*/
		function indexPagedClicked(){
			console.log('Returning to index page');
		}

		function aboutPagedClicked(){
			console.log('Opening about page');
		}


		/**
		* Update division tally/table
		*/
		function updateDivisionTableView(){
			$('#division1Wins').text(divisionTally[1]);
			$('#division2Wins').text(divisionTally[2]);
			$('#division3Wins').text(divisionTally[3]);
			$('#division4Wins').text(divisionTally[4]);
			$('#division5Wins').text(divisionTally[5]);
			$('#division6Wins').text(divisionTally[6]);
			$('#division7Wins').text(divisionTally[7]);

			$('#division1Amount').text('$' + divisionTotal[1]);
			$('#division2Amount').text('$' + divisionTotal[2]);
			$('#division3Amount').text('$' + divisionTotal[3]);
			$('#division4Amount').text('$' + divisionTotal[4]);
			$('#division5Amount').text('$' + divisionTotal[5]);
			$('#division6Amount').text('$' + divisionTotal[6]);
			$('#division7Amount').text('$' + divisionTotal[7]);
		}

		/**
		* Backup function which produces random numbers
		*/
		function randomGame(noOfSets, amountOfNumbers){
			var numArray = [];
			var num = 0;
			var nestedNumArray = [];

			for(var i = 0; i < noOfSets; i++){
				for(var j = 0; j < amountOfNumbers;){
					num = Math.floor(Math.random() * 45) + 1;

					if(numArray.indexOf(num) === -1){
						numArray[j] = num;
						j++;
					}
				}
				nestedNumArray = nestedNumArray.concat(numArray);
			}

			return nestedNumArray;
		}

		/**
		* Scrapes random numbers from online random number generator
		*
		* noOfSets * amountOfNumbers < 1425
		*/
		function getRandomNumbers(noOfSets, amountOfNumbers){
			var numArray = [];
			var subStr;
			var stringArr;
			var seqArr;
			//try sequential ajax -> http://taskjs.org/
			//or https://www.npmjs.com/package/random-js

			jQuery.ajax({
				url: 'https://www.random.org/integer-sets/?sets=' + noOfSets + '&num=' + amountOfNumbers + '&min=1&max=45&seqnos=on&commas=on&sort=off&order=index&format=html&rnd=new',
				success: function(data) {
				  $stringArr = $(data).find('.data > li');
					subStr = $stringArr.text();
					seqArr = subStr.split("Set ");

					for(var i = 1; i < seqArr.length; i++){
						subStr = seqArr[i].split(": ");
						numArray = numArray.concat(subStr[1].split(", "));
					}

					numArray = numArray.map(function(item){
						return parseInt(item, 10);
					});
				},
				error: function(){
					numArray = randomGame(noOfSets, amountOfNumbers);

					numArray = numArray.map(function(item){
						return parseInt(item, 10);
					});
				},

				async:false
			});

			return numArray;
		}

		/**
		* Prints main numbers and supplement numbers seperately
		*/
		function printArray(arrayToPrint){
			for(var i = 0; i < arrayToPrint.length; i++){
				$('#draw' + (i + 1)).text(arrayToPrint[i] + '');
			}
		}


		/**
		* checks last weeks lotto numbers against generated games
		*/
		function checkResults(gameArr){
			var oneGame = [];
			var count = [];
			var division = [];

			for(var k = 0; k < gameArr.length; k++){
				oneGame = gameArr[k];
				count = checkGame(oneGame);
				division = countProfit(count);
				$('#gamesTable tr:last').after('<tr><td>'+(k+1)+'</td><td>'+count[0]+'</td><td>'+count[1]+'</td><td>'+division[0]+'</td></tr>');

				divisionTally[division[1]] += 1;
				divisionTotal[division[1]] += division[2];
			}
		}

		/**
		* TODO: check results for variable systems for each game
		*/
		function checkResultsVariableSystem(gameArr){
			var oneGame = [];
			var count = [];
			var division = [];

			for(var k = 0; k < gameArr.length; k++){
				oneGame = gameArr[k];
				count = checkGame(oneGame);
				division = countProfit(count);
				console.log((k+1)+'\t'+count[0]+'\t'+count[1]+'\t'+division[0]);

				divisionTally[division[1]] += 1;
				divisionTotal[division[1]] += division[2];
			}
		}

		function checkResultsForMultiple(gameArr){
			var oneGame = [];
			var count = [];
			var division = [];

			for(var k = 0; k < gameArr.length; k++){
				oneGame = gameArr[k];
				count = checkGame(oneGame);
				division = countProfit(count);

				divisionTally[division[1]] += 1;
				divisionTotal[division[1]] += division[2];
			}

		}

		function checkGame(game){
			var matchCount = 0;
			var suppCount = 0;
			var count = [];

			for(var a = 0; a < game.length; a++){
				if(winningNums.indexOf(game[a]) > -1){
					matchCount++;
				}
			}

			for(var a = 0; a < game.length; a++){
				if(suppNums.indexOf(game[a]) > -1){
					suppCount++;
				}
			}

			count = [matchCount, suppCount];

			return count;
		}

		/**
		* Switch statement which adds up the profits
		* This method return an array with [division won as a string, division won as an int, amount won]
		*/
		function countProfit(countArr){
			var divisionWon = '';
			var returnArray = [];

			if(countArr[0] === 3 && countArr[1] > 0){
				divisionWon = '7: ~$14';
				profits += 14;
				returnArray = [divisionWon, 7, 14];
			}else if(countArr[0] === 4){
				divisionWon = '6: ~$21';
				profits += 21;
				returnArray = [divisionWon, 6, 21];
			}else if(countArr[0] === 5){
				divisionWon = '5: ~$41';
				profits += 41;
				returnArray = [divisionWon, 5, 41];
			}else if(countArr[0] === 5 && countArr[1] > 0){
				divisionWon = '4: ~$321';
				profits += 321;
				returnArray = [divisionWon, 4, 321];
			}else if(countArr[0] === 6){
				divisionWon = '3: ~$4150';
				profits += 4150;
				returnArray = [divisionWon, 3, 4150];
			}else if(countArr[0] === 6 && countArr[1] > 0){
				divisionWon = '2: ~$16400';
				profits += 16400;
				returnArray = [divisionWon, 2, 16400];
			}else if(countArr[0] === 7){
				divisionWon = '1: ~$2000000';
				profits += 2000000;
				returnArray = [divisionWon, 1, 2000000];
			}else{
				returnArray = ['', 0, 0];
			}

			return returnArray;
		}

//});
