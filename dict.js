const fetch = require("node-fetch");
var https = require('follow-redirects').https;
var fs = require('fs');
var base='https://fourtytwowords.herokuapp.com/'; 
var API_KEY= 'fb8007781a73a8884e3821dc8f330cf2949b422d2a4be2bac9f1d5def50213d48f04cf2869255230d8e5adc4bee08ed27035a7a65745b5184b37848e93a691c099b93b1b072f24ad7908352ed10947e3';
const type = process.argv[2] 
const argument = process.argv[3]
  var commands = {}


  
  commands.def=async function (parsedWord) {
    const api_url = base+'word/'+parsedWord+'/definitions?api_key='+API_KEY;
    const response = await fetch(api_url);
    const data = await response.json();
   console.log(data);
   
  }
  
  
commands.syn=async function (parsedWord) {
  const api_url = base+'word/'+parsedWord+'/relatedWords?api_key='+API_KEY;
  const response = await fetch(api_url);
  const data = await response.json();
 console.log(data);
 
}


  commands.ex=async function (parsedWord) {
    const api_url = base+'word/'+parsedWord+'/examples?api_key='+API_KEY;
    const response = await fetch(api_url);
    const data = await response.json();
   console.log(data);
   
  }


  commands.dict = function (parsedWord)  {
    commands.def(parsedWord);
    commands.syn(parsedWord);
    commands.ex(parsedWord);
   
  }

 
  
  async function day() {
    const api_url = base+'words/randomWord?api_key='+API_KEY;
    const response = await fetch(api_url);
    const data = await response.json();
   var mainWord=data.word
   commands.dict(mainWord);
    }

  if (typeof commands[type] === 'function') {
    commands[type](argument)
  }
  if (typeof commands[type] === "undefined") {
    day();
  }