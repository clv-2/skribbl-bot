let newWords = [];
let bc = new BroadcastChannel("skribbl_word_farm");
let invite;
let invLoop;
let didLogWords;

function send(msg){
	bc.postMessage(msg);
}

document.getElementById("buttonLoginCreatePrivate").click();

invLoop = setTimeout(()=>{
	let inv = document.getElementById("invite");
	let plrs = document.getElementById("containerLobbyPlayers");
	if(inv){
		invite = inv.value();
		send({req: "join", data: invite});
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

function start(){
	document.getElementById("buttonLobbyPlay").click();
	setInterval(()=>{
		if(isPicking() && !didLogWords){
			let ws = getWordsForTurn();
			document.getElementsByClassName("wordContainer")[0].children[0].click();
			newWords.push(...filter(ws));
			post({req:"answer", data: ws[0]);
			didLogWords = true;
		}else{
			didLogWords = false;
		}
	}, 100);
}

bc.onmessage = function(evt){
	let msg = evt.data;
	if(msg.req == "getInv"){
		post({req: "invite", data: invite});
	}else if(msg.req == "logWords"){
		newWords.push(...filter(msg.data);
	}
}
