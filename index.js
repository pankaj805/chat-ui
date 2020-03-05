const API_URL_BASE = "http://localhost:30006";
const GET_ALL_MSGS = "/messages";
const GET_MSG = "/message";

let chatbox = document.querySelector("#chat-box");


function loadAllMsgs() {
    console.log(" $$$$$$$$ Here")
    let request = new XMLHttpRequest();
    let url = API_URL_BASE + GET_ALL_MSGS;
    console.log("url:",url);
    request.addEventListener("load", function () {
        if (request.status == 200) {
            console.log("request.readyState:",request.readyState);
            console.log("request.responseText:",request.responseText);
            if (request.readyState == XMLHttpRequest.DONE) {
                var data = JSON.parse(request.responseText);
                let allMsgs = data.response;
                for(let msg of allMsgs){
                    drawMessage(msg);
                }
            }
        } else {
            alert("issue connecting server")
        }
    });
    request.open("GET", url, true);
    request.send();
    requestNewMessage();
}

function drawMessage(message){
    var node = document.createElement("div");
    node.innerHTML = `<div class="sender-name">${message.u}</div>: <div class="msg-text">${message.m}</div>`;
    chatbox.appendChild(node);
}

window.onload = function() {
    loadAllMsgs();
}

function requestNewMessage(){
    let request = new XMLHttpRequest();
    let url = API_URL_BASE + GET_MSG;
    console.log("url:",url);
    request.open("GET", url, true);
    request.timeout = 120000;
    request.addEventListener("load", function () {
        if (request.status == 200) {
            if (request.readyState == XMLHttpRequest.DONE) {
                var data = JSON.parse(request.responseText);
                let msg = data.response;
                drawMessage(msg);
            }
        } else {
            alert("issue connecting server")
        }
        setTimeout(()=>{requestNewMessage()},0);
    });
    request.addEventListener("timeout", function () {
        setTimeout(()=>{requestNewMessage()},0);
    })

    request.send();
}

function sendMessage(){
    var message = {};
    message.u = document.querySelector("#sender").value || "Anonymous";
    message.m = document.querySelector("#new-msg").value || "";

    console.log(" ##### message:",message);
    if(message.m == ""){
        return;
    }
  
    let request = new XMLHttpRequest();
    let url = API_URL_BASE + GET_MSG;
    console.log("url:",url);
    request.addEventListener("load", function () {
        console.log("msg sent")
    });
    request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(message));
    
  
  }