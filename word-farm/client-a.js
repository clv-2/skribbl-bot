let newWords = [];
let bc = new BroadcastChannel("skribbl_word_farm");
let invite;
let invLoop;
let didLogWords;

function post(msg){
	bc.postMessage(msg);
}

document.getElementById("buttonLoginCreatePrivate").click();

invLoop = setInterval(()=>{
	let inv = document.getElementById("invite");
	let plrs = document.getElementById("containerLobbyPlayers");
	if(inv && inv.value && inv.value.length > 0){
		invite = inv.value.match(/\/\?(.*)/g)[0];
		document.getElementById("lobbySetRounds").value = "10";
		post({req: "join", data: invite});
	}
	if(inv && plrs.children.length > 1){
		start();
		clearInterval(invLoop);
	}
},500);

function isInLobby(){
	let e = document.getElementById("buttonLobbyPlay");
	return e.offsetWidth > 0 && e.offsetHeight > 0;
}
function isPicking(){
	let words = document.getElementsByClassName("wordContainer")[0].children;
	return words.length > 0 && words[0].offsetWidth > 0 && words[0].offsetHeight > 0;
}
function getWordsForTurn(){
	let w = document.getElementsByClassName("wordContainer")[0].children;
	return [w[0].innerText, w[1].innerText, w[2].innerText];
}
function filter(words){
	let newW = [];
	for(var i = 0;i < words.length; i++){
		let t = words.pop();
		if(newWords.indexOf(t) == -1){
			newW.push(t);
		}
	}
	return newW;
}
function sendWord(wrd){
    const element = document.getElementById("inputChat")
    element.value = wrd.toLowerCase();    
    element.focus();
    $(element).submit();
}


function start(){
	setInterval(()=>{
		if(isPicking() && !didLogWords){
			didLogWords = true;
			let ws = getWordsForTurn();
			document.getElementsByClassName("wordContainer")[0].children[0].click();
			newWords.push(...filter(ws));
			setTimeout(()=>{post({req:"answer", data: ws[0]})}, 2000);
		}else{
			didLogWords = false;
		}
		if(isInLobby()){
			document.getElementById("buttonLobbyPlay").click();
		}
	}, 500);
}

bc.onmessage = function(evt){
	let msg = evt.data;
	if(msg.req == "getInv"){
		post({req: "invite", data: invite});
	}else if(msg.req == "logWords"){
		newWords.push(...filter(msg.data));
	}else if(msg.req == "answer"){
		sendWord(msg.data);
	}
}
