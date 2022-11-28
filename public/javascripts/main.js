$(document).ready(function () {
    getData().then(() => {
        //updateInputPanel();
        updateGameBoard();
        refreshOnClickEvents();
    })
}
)

let data = {}; //Game data from controller

function getData() {
    return $.ajax({
        method: "GET",
        url: "/status",
        dataType: "json",
        success: function (response) {
            data = response;
        }
    });
}


function post(method, url, data) {
    return $.ajax({
        method: method,
        url: url,
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json",

        success: function (response) {
            data = response;
        },
        error: function (response) {
            console.log("Error")
            console.error(response);
        }
    });
}

function processCommand(cmd, data) {
    post("POST", "/command", { "cmd": cmd, "data": data }).then(() => {
        getData().then(() => {
            updateInputPanel();
            updateGameBoard();
            refreshOnClickEvents()
        })
    })
}

function updateGameBoard() {
    let playerA_Hand = data.playerA_Hand;
    let playerA_SpielerStapel = data.playerA_SpielerStapel;
    let playerA_HelpStack = data.playerA_HelpStack;
    let playerB_Hand = data.playerB_Hand;
    let playerB_SpielerStapel = data.playerB_SpielerStapel;
    let playerB_HelpStack = data.playerB_HelpStack;
    let ablageStapel = data.ablageStapel;
    let current_Player = data.current_Player;
    let gameState = data.gamestate;
    let statusmessage = data.statusmessage;
}

function updateInputPanel() {
    const parent = $('#input-panel-group').get(0);
    parent.innerHTML = sHandToAblage + sHandToHilfe + sHilfeToAblage + sSpielerToAblage + "</div>";
}

let sHandToAblage = "<div class=\"col-xl-3\">\n" +
    "   <button class=\"gameButton\" id=\"hand_Ablagestapel\">\n" +
    "Karte " +
    "von Hand auf " +
    "Ablagestapel" +
    "</button> \n" +
    "</div> \n"


let sHandToHilfe = "<div class=\"col-xl-3\">\n" +
    "   <button class=\"gameButton\" id=\"hand_Hilfestapel\">\n" +
    "Karte " +
    "von Hand auf " +
    "Ablagestapel" +
    "</button> \n" +
    "</div> \n"

let sHilfeToAblage = "<div class=\"col-xl-3\">\n" +
    "   <button class=\"gameButton\" id=\"hilfestapel_Ablagestapel\">\n" +
    "Karte " +
    "von Hand auf " +
    "Ablagestapel" +
    "</button> \n" +
    "</div> \n"

let sSpielerToAblage = "<div class=\"col-xl-3\">\n" +
    "   <button class=\"gameButton\" id=\"spielerstapel_Ablagestapel\"> " +
    "Karte " +
    "von Hand auf " +
    "Ablagestapel" +
    "</button> \n" +
    "</div> \n"


function refreshOnClickEvents() {
    $('#hand_Ablagestapel').click(function () {
        hand_Ablagestapel_click()
    });
    $('#hand_Hilfestapel').click(function () {
        hand_Hilfestapel_click()
    });
    $('#hilfestapel_Ablagestapel').click(function () {
        hilfestapel_Ablagestapel_click()
    });
    $('#spielerstapel_Ablagestapel').click(function () {
        spielerstapel_Ablagestapel_click()
    });
}

function hand_Ablagestapel_click() {
    /*
    console.log("erste Methode: " + whichCard + " | " + whereCard);
    whichCardInt = parseInt(whichCard) - 1;
    whereCardInt = parseInt(whereCard) - 1;
    window.location.href = "/hand_Ablagestapel/" + whichCardInt + "/" + whereCardInt;
    */
    whichCard = $.getElementById('whichCard').value;
    whichCardToInt = parseInt(whichCard);
    whereCard = $.getElementById('whereCard').value;
    whereCardToInt = parseInt(whereCard);
    processCommand("hand_Ablagestapel", new Array(whichCardInt, whereCardToInt));
}
function hand_Hilfestapel_click() {
    /*
    console.log("zweite Methode: " + whichCard + " | " + whereCard);
    whichCardInt = (parseInt($.getElementById('whichCard').value)) - 1;
    whereCardInt = (parseInt($.getElementById('whereCard').value)) - 1;
    window.location.href = "/hand_Hilfestapel/" + whichCardInt + "/" + whereCardInt;
    */
    whichCard = $.getElementById('whichCard').value;
    whichCardToInt = parseInt(whichCard);
    whereCard = $.getElementById('whereCard').value;
    whereCardToInt = parseInt(whereCard);
    processCommand("hand_Hilfestapel", new Array(whichCardInt, whereCardToInt));
}
function hilfestapel_Ablagestapel_click() {
    /*
    console.log("dritte Methode:");
    whichCardInt = (parseInt($.getElementById('whichCard').value)) - 1;
    whereCardInt = (parseInt($.getElementById('whereCard').value)) - 1;
    window.location.href = "/hilfestapel_Ablagestapel/" + whichCardInt + "/" + whereCardInt;
    */
    whichCard = $.getElementById('whichCard').value;
    whichCardToInt = parseInt(whichCard);
    whereCard = $.getElementById('whereCard').value;
    whereCardToInt = parseInt(whereCard);
    processCommand("hilfestapel_Ablagestapel", new Array(whichCardInt, whereCardToInt));
}
function spielerstapel_Ablagestapel_click(whereCard) {
    /*
    console.log("Hallo " + whereCard);
    card = parseInt(whereCard) - 1;
    window.location.href = "/spielerstapel_Ablagestapel/" + card;
    */
    whereCard = $.getElementById('whereCard').value;
    whereCardToInt = parseInt(whereCard);
    processCommand("spielerstapel_Ablagestapel", whereCardToInt);
}