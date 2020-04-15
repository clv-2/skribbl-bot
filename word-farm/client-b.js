let bc = new BroadcastChannel("skribbl_word_farm");
let invite;
let invLoop;
let didLogWords;

function post(msg){
	bc.postMessage(msg);
}


function isPicking(){
	let words = document.getElementsByClassName("wordContainer")[0].children;
	return words.length > 0 && words[0].offsetWidth > 0 && words[0].offsetHeight > 0;
}
function getWordsForTurn(){
	let w = document.getElementsByClassName("wordContainer")[0].children;
	return [w[0].innerText, w[1].innerText, w[2].innerText];
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
			post({req: "logWords", data: ws});
			setTimeout(()=>{post({req:"answer", data: ws[0]})}, 2000);
			didLogWords = true;
		}else{
			didLogWords = false;
		}
	}, 500);
}
function enter(inv){
	if(invite) return;
	window.history.pushState("skribbl", "skribbl", inv);
	invite = inv;
	document.getElementById("inputName").value = Math.random();
	document.getElementById("buttonAvatarCustomizerRandomize").click();
	document.getElementById("formLogin").children[2].click();
	console.log("joining");
	setTimeout(start, 1000);
}

bc.onmessage = function(evt){
	let msg = evt.data;
	if(msg.req == "join"){
		enter(msg.data);
	}else if(msg.req == "answer"){
		sendWord(msg.data);
	}else if(msg.req == "invite"){
		enter(msg.data);
	}
}

post({req: "getInv"});
