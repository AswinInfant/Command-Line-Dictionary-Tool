const fetch = require("node-fetch");
var https = require('follow-redirects').https;
var fs = require('fs');
var base='https://fourtytwowords.herokuapp.com/'; 
var API_KEY= 'fb8007781a73a8884e3821dc8f330cf2949b422d2a4be2bac9f1d5def50213d48f04cf2869255230d8e5adc4bee08ed27035a7a65745b5184b37848e93a691c099b93b1b072f24ad7908352ed10947e3';
var commands = {};
var guess='';
const prompt = require('prompt-sync')();
var defhint,synhint,anthint;
var score=0;


  commands.def=async function (parsedWord,j) {
    const api_url = base+'word/'+parsedWord+'/definitions?api_key='+API_KEY;
    const response = await fetch(api_url);
    const data = await response.json();
    console.log("Definition");
    
    if (typeof data[j] === "undefined") {
      console.log("No more definitions available,choose other hint");
      menu(2,parsedWord);
    }
    else{
      console.log(data[j]);
   guess = prompt('Guess the word');
   check(guess,parsedWord);
    }
    
  }

    commands.syn=async function (parsedWord,j) {
    const api_url = base+'word/'+parsedWord+'/relatedWords?api_key='+API_KEY;
    const response = await fetch(api_url);
    const data = await response.json();
    console.log("Synonyms");
   var rl=data[0].relationshipType;
   var n = rl.localeCompare('antonym');
   if(n==0){
    if (typeof data[1].words[j] === "undefined") {
      console.log("No more synonyms available,choose other hint");
      menu(2,parsedWord);
    }
    else{
      console.log("Synonym for the given word: "+data[1].words[j]);
   guess = prompt('Guess the word');
   check(guess,parsedWord);
    }
     
   }
   else{
     if (typeof data[0].words[j] === "undefined") {
      console.log("No more synonyms available,choose other hint");
      score+=3;
      menu(2,parsedWord);
    }
    else{
      console.log("Synonym for the given word: "+data[0].words[j]);
   guess = prompt('Guess the word');
   check(guess,parsedWord);
    }
   }
  }


  commands.ant=async function (parsedWord,j) {
    const api_url = base+'word/'+parsedWord+'/relatedWords?api_key='+API_KEY;
    const response = await fetch(api_url);
    const data = await response.json();
    console.log("Antonym");
   rl=data[0].relationshipType;
   var n = rl.localeCompare('antonym');
   if(n==0){
    if (typeof data[0].words[j] === "undefined") {
      console.log("No more synonyms available,choose other hint");
      score+=3;
      menu(2,parsedWord);
    }
    else{
      console.log("Antonym for the given word: "+data[0].words[j]);
   guess = prompt('Guess the word');
   check(guess,parsedWord);
    }
     
   }
   else{
     console.log("No antonyms present, try another hint");
     score+=3;
     menu(2,parsedWord);
   }
   
  }



 function check(guessword,apiword){
   if(guessword.localeCompare(apiword)==0){
     console.log("correct");
     score+=10;
     console.log("Your score= "+score);
     gameplay();
   }
   else{
     console.log("wrong");
     score-=2;
     console.log("Your score= "+score);
    var opt = prompt('Press a number for hint---1.Try again---2.Hint---3.SKip');
    menu(opt,apiword);
   }
 }

function menu(option,apiword1){
  if(option ==1){
    var guess = prompt('Guess the word');
    console.log(guess);
    check(guess,apiword1);
  }
  else if(option==2)
  {
    var hintopt = prompt('What hint do you want--1.Definition--2.Synonyms--3.Antonyms');
    if(hintopt==1){
    score-=3;
    commands.def(apiword1,defhint);
    defhint++;
    }
    else if(hintopt==2){
      score-=3;
      commands.syn(apiword1,synhint);
      synhint++;
      }
      else if(hintopt==3){
        score-=3;
        commands.ant(apiword1,anthint);
        anthint++;
        }
  }
  else if(option==3){
    console.log(apiword1);
  }
}

  async function gameplay()  {
    defhint=1;synhint=0;anthint=0;
    const api_url = base+'words/randomWord?api_key='+API_KEY;
    const response = await fetch(api_url);
    const data = await response.json();
    var mainWord=data.word;
    var i=0;
    console.log(mainWord);
    commands.def(mainWord,0);

  }
 


module.exports = { gameplay };