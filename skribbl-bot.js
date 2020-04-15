let wordDatabase = require("./wordlist.json");
let lastProcessedChat = "";

document.getElementsByClassName("container-fluid")[0].style["max-width"] = "1700px";
let realChat = document.getElementById("boxMessages");
let sidebar = document.getElementById("containerSidebar");
let wordStorageBox = sidebar.cloneNode();
let wordStorage = sidebar.children[1].cloneNode();
let votekick = document.getElementById("votekickCurrentplayer");

votekick.parentElement.setAttribute("data-original-title", "")

let copyWords = votekick.cloneNode();
votekick.parentElement.appendChild(copyWords);
copyWords.innerText = "Copy updated wordlist";
copyWords.setAttribute("onclick", "copyList()");
copyWords.style["background-color"] = "#00bdab";
copyWords.style["border-color"] = "#00bdab";

document.getElementsByClassName("containerGame")[0].appendChild(wordStorageBox);

wordStorageBox.appendChild(wordStorage);

wordStorage.style["overflow-y"] = "auto";

function copyList(){
	copyToClipboard("let wordDatabase = "+JSON.stringify(wordDatabase));
	output("Copied word database");
}
function output(text){
	let p = document.createElement("p");
	p.style.color = "rgb(255, 0, 240)";
	p.style["font-weight"] = "bold";
	p.innerText = "[Scribot] "+text;
	realChat.appendChild(p);
	realChat.scrollTop = realChat.scrollHeight;
}

function copyToClipboard(str){
  const el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};
function getWordssForTurn(){
	let w = document.getElementsByClassName("wordContainer")[0].children;
	return [w[0].innerText, w[1].innerText, w[2].innerText];
}
function getUser(){
	plrs = document.getElementById("containerGamePlayers").children;
	for(var i = 0;i<plrs.length;i++){
		if(plrs[i].children[1].children[0].style.cssText == "color: rgb(0, 0, 255);"){
			return plrs[i].children[1].children[0].innerText.replace(" (You)","");
		}
	}
}
function isTurn(){
	return currentWord().indexOf("_") == -1;
}

function currentWord(){
	return (document.getElementById("currentWord") && document.getElementById("currentWord").innerText) || "_";
}
function mostRecentChat(){
	let msgs = document.getElementById("boxMessages");
	if(msgs.children.length>0){
		return msgs.children[msgs.children.length-1].innerText;
	}
}

function isLogged(word){
	for(var i = 0; i < wordDatabase.length; i++){
		if(wordDatabase[i].toLowerCase() == word.toLowerCase()){
			return true;
		}
	}
}
function wordPossibilities(word){
	let ret = []
	for(var i = 0; i < wordDatabase.length; i++){
		let could = wordDatabase[i];
		if(could.length == word.length){ // they are the same length
			if(could.indexOf(" ") == word.indexOf(" ") && could.indexOf(".") == word.indexOf(".") && could.indexOf("\"") == word.indexOf("\"")){
				let regex = new RegExp(word.replace(/_/g, ".")); // replace underscores wiht any character
				if(could.match(regex)){
					ret.push(could);
				}
			}
		}
	}
	return ret;
}
function sendWord(wrd){
    const element = document.getElementById("inputChat")
    element.value = wrd.toLowerCase();    
    element.focus();
    $(element).submit();
}

setInterval(()=>{
	copyWords.removeAttribute("disabled")
	if(!didLogWords && isTurn()){
		didLogWords = true;
		let words = getWordssForTurn();
		for(var i = 0; i < words.length; i++){
			if(!isLogged(words[i])){
				wordDatabase.push(words[i]);
				output("Added word ""+words[i]+"" to database");
			}
		}
	}else if(!isTurn()){
		didLogWords = false;
		let possible = wordPossibilities(currentWord());
		let found = [];
		for(var i = 0;i<wordStorage.children.length;i++){
			let wrd = wordStorage.children[i].innerText;
			if(possible.indexOf(wrd) != -1){
				found.push(wrd.toLowerCase());
			}else{
				wordStorage.children[i].remove();
			}
		}
		for(var x = 0; x < possible.length; x++){
			if(found.indexOf(possible[x].toLowerCase()) == -1){
				let btn = document.createElement("button");
				wordStorage.appendChild(btn);
				btn.innerText = possible[x];
				btn.style.width = "100%";
				btn.setAttribute("onclick","sendWord(""+possible[x]+"")");
			}
		}
		let cleanup = {}
		for(var i = 0;i<wordStorage.children.length;i++){
			let wrd = wordStorage.children[i].innerText;
			if(cleanup[wrd]){
				wordStorage.children[i].remove();
			}
			cleanup[wrd]=true;
		}
	}
	let chat = mostRecentChat();
	if(lastProcessedChat != chat && chat){
		lastProcessedChat = chat;
		let hasWrd = chat.match(/The word was "(.*)"/);
		if(hasWrd){
			let word = hasWrd[1];
			if(!isLogged(word)){
				wordDatabase.push(word);
				output("Added word ""+word+"" to database");
			}
		}
	}
}, 10);

output("Initiated, total words in database: "+wordDatabase.length);