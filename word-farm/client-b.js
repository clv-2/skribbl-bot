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
			post({req: "answer", data: ws[0]});
			didLogWords = true;
		}else{
			didLogWords = false;
		}
	}, 100);
}


bc.onmessage = function(evt){
	let msg = evt.data;
	if(msg.req == "join"){
		window.history.pushState("", "", msg.data);
		document.getElementById("inputName").value = Math.random();
		documnet.getElementById("buttonAvatarCustomizerRandomize").click();
		document.getElementById("formLogin").children[2].click();
		setTimeout(start, 1000);
	}else if(msg.req == "answer"){
		sendWrd(msg.data);
	}
}

