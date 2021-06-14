const fetch = require("node-fetch");
var https = require('follow-redirects').https;
var base='https://fourtytwowords.herokuapp.com/'; 
var API_KEY= 'fb8007781a73a8884e3821dc8f330cf2949b422d2a4be2bac9f1d5def50213d48f04cf2869255230d8e5adc4bee08ed27035a7a65745b5184b37848e93a691c099b93b1b072f24ad7908352ed10947e3';
var commands = {};
var guess='';
const prompt = require('prompt-sync')();
var defhint,synhint,anthint,hintExhaust;
var score=0;
var synonyms=[];
var i;
  commands.def=async function (parsedWord,j) {
    const api_url = base+'word/'+parsedWord+'/definitions?api_key='+API_KEY;
    const response = await fetch(api_url);
    const data = await response.json();
    console.log("Definition");
    
    if (typeof data[j] === "undefined") {
      console.log("No more definitions available,choose other hint");
      hintExhaust++;
      score+=3;
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
   var rl=data[0].relationshipType;
   var n = rl.localeCompare('antonym');
   
   if(n==0){
      for(i = 0; typeof data[1].words[i] != "undefined"; i++){
        synonyms[i]=data[1].words[i];
      }
    if (typeof data[1].words[j] === "undefined") {
      console.log("No more synonyms available,choose other hint");
      hintExhaust++;
      score+=3;
      menu(2,parsedWord);
    }
    else{
      console.log("Synonym for the given word: "+synonyms[j]);
      synRemove(synonyms[j]);
   guess = prompt('Guess the word');
   check(guess,parsedWord);
    }
     
   }
   else{
    for(i = 0; typeof data[0].words[i] != "undefined"; i++){
      synonyms[i]=data[0].words[i];
    }
     if (typeof data[0].words[j] === "undefined") {
      console.log("No more synonyms available,choose other hint");
      hintExhaust++;
      score+=3;
      menu(2,parsedWord);
    }
    else{
      console.log("Synonym for the given word: "+synonyms[j]);
      synRemove(synonyms[j]);
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
      console.log("No more antonyms available,choose other hint");
      hintExhaust++;
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
     hintExhaust++;
     menu(2,parsedWord);
   }
   
  }

  function synRemove(guessword2){
    for(i = 0; i < synonyms.length; i++){
      if(synonyms[i].localeCompare(guessword2) == 0){
        synonyms.splice(i,1);
      }
    }
  } 

  function synCompare(guessword1){
    var flag=synonyms.includes(guessword1);
    if(flag==1){
      synRemove(guessword1);
      return flag; 
    }
    else{
      return flag;
    }
  }

 function check(guessword,apiword){
   if(guessword.localeCompare(apiword)==0){
     console.log("correct");
     score+=10;
     console.log("Your score= "+score);
     gameplay();
   }
   else if(synCompare(guessword) == 1){
     console.log("Syn correct");
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

 function scramble(a){
   a=a.split("");
   for(var b=a.length-1;0<b;b--){
     var c=Math.floor(Math.random()*(b+1));
     d=a[b];
     a[b]=a[c];
     a[c]=d
    }
    return a.join("")
  }



function menu(option,apiword1){
  if(option ==1){
    var guess = prompt('Guess the word');
    console.log(guess);
    check(guess,apiword1);
  }
  else if(option==2)
  {
    if(hintExhaust==3){
      console.log("jumbled word");
      console.log(scramble(apiword1));
      var guess = prompt('Guess the word');
    console.log(guess);
    check(guess,apiword1);
    }
    else{
    var hintopt = prompt('What hint do you want--1.Definition--2.Synonyms--3.Antonyms');
    if(hintopt==1){
    score-=3;
    console.log("Your score= "+score);
    commands.def(apiword1,defhint);
    defhint++;
    }
    else if(hintopt==2){
      score-=3;
      console.log("Your score= "+score);
      commands.syn(apiword1,synhint);
      synhint++;
      }
      else if(hintopt==3){
        score-=3;
        console.log("Your score= "+score);
        commands.ant(apiword1,anthint);
        anthint++;
        }
     }
    }


  else if(option==3){
    console.log(apiword1);
  }
}

  async function gameplay()  {
    defhint=1;synhint=0;anthint=0,hintExhaust=0;
    const api_url = base+'words/randomWord?api_key='+API_KEY;
    const response = await fetch(api_url);
    const data = await response.json();
    var mainWord=data.word;
    var i=0;
    console.log(mainWord);
    commands.def(mainWord,0);

  }
 


module.exports = { gameplay };
