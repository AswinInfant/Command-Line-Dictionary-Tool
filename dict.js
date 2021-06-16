const lib = require("./game.js");
const fetch = require("node-fetch");
var https = require('follow-redirects').https;
var base='https://fourtytwowords.herokuapp.com/'; 
var API_KEY= 'fb8007781a73a8884e3821dc8f330cf2949b422d2a4be2bac9f1d5def50213d48f04cf2869255230d8e5adc4bee08ed27035a7a65745b5184b37848e93a691c099b93b1b072f24ad7908352ed10947e3';
const type = process.argv[2] ;
const argument = process.argv[3];
var commands = {};
var data;

async function apiCall(parsedWord, commandType) {
  if(commandType.localeCompare('definition') == 0) {
    const api_url = base + 'word/' + parsedWord + '/definitions?api_key=' + API_KEY;
    const response = await fetch(api_url);
    data = await response.json();
    console.log(data);
  }
  else if(commandType.localeCompare('synonyms') == 0) {
    const api_url = base + 'word/' + parsedWord + '/relatedWords?api_key=' + API_KEY;
    const response = await fetch(api_url);
    const data = await response.json();
    console.log("Synonyms of " + parsedWord);
    var relationType = data[0].relationshipType;
    var isAntonym = relationType.localeCompare('antonym');
    if(isAntonym == 0) {
      console.log(data[1]);
    }
    else {
    console.log(data[0]);
    }
  }
  else if(commandType.localeCompare('antonyms') == 0) {
    const api_url = base + 'word/' + parsedWord + '/relatedWords?api_key=' + API_KEY;
    const response = await fetch(api_url);
    const data = await response.json();
    var relationType = data[0].relationshipType;
    var isAntonym = relationType.localeCompare('antonym');
    if(isAntonym == 0) {
      console.log("Antonyms of " + parsedWord);
      console.log(data[0]);
    }
    else {
      console.log("No antonyms present");
    }
  }
  else if(commandType.localeCompare('examples') == 0) {
    const api_url = base + 'word/' + parsedWord + '/examples?api_key=' + API_KEY;
    const response = await fetch(api_url);
    const data = await response.json();
    console.log("Examples of " + parsedWord);
    console.log(data);
  }
}

//definitions of a word entered
commands.def = async function (parsedWord) {
  console.log("Definitons of " + parsedWord);
  apiCall(parsedWord, 'definition'); 
}
  
//synonyms of a word entered
commands.syn = async function (parsedWord) {
  console.log("Synonyms of " + parsedWord);
  apiCall(parsedWord, 'synonyms');
}

//anotnyms of a word entered
commands.ant = async function (parsedWord) {
  apiCall(parsedWord, 'antonyms');
}

  //examples of a word entered
commands.ex = async function (parsedWord) {
  apiCall(parsedWord, 'examples'); 
}

  //entire dictionary of a word entered
commands.dict = function (parsedWord)  {
  apiCall(parsedWord, 'definition');
  apiCall(parsedWord, 'synonyms');
  apiCall(parsedWord, 'antonyms');
  apiCall(parsedWord, 'examples'); 
  
}
commands.play = function ()  {
  console.log("game starts");
  lib.gameplay();
}

 
  //random word of the day's dictionary 
async function day() {
  const api_url = base + 'words/randomWord?api_key=' + API_KEY;
  const response = await fetch(api_url);
  const data = await response.json();  
  var mainWord = data.word;
  console.log("Word of the day is:" + mainWord + "\n");
  commands.dict(mainWord);
}

if (typeof commands[type] === 'function') {
  commands[type](argument)
}
if (typeof commands[type] === "undefined") {
  day();
}
