$(document).ready(function () {
    getData().then(() => {
        updateInputPanel();
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
    console.log(data);
    return $.ajax({
        method: method,
        url: url,
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json",

        success: function (response) {
            data = response;
            console.log(data);
        },
        error: function (response) {
            console.log("Error");
            console.error(response);
        }
    });
}

function processCommand(cmd, data, data2) {
    console.log("CMD: " + cmd + " data1: " + data + " data2: " + data2);
    post("POST", "/command", { "cmd": cmd, "data1": data, "data2": data2 }).then(() => {
        getData().then(() => {
            updateInputPanel();
            updateGameBoard();
            refreshOnClickEvents();
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

    console.log(current_Player);
    $('#TestLabel').empty();
    $('#TestLabel').append(current_Player);

    //$('#' + current_Player).text(current_Player);
    console.log($('#' + "TestLabel").text());

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
    let whichCard = $('#whichCard').val();
    let whichCardToInt = parseInt(whichCard);
    let whereCard = $('#whereCard').val();
    let whereCardToInt = parseInt(whereCard);
    console.log(whereCard + " " + whichCard);
    processCommand("hand_Ablagestapel", whichCardToInt, whereCardToInt);
}
function hand_Hilfestapel_click() {
    let whichCard = $('#whichCard').val();
    let whichCardToInt = parseInt(whichCard);
    let whereCard = $('#whereCard').val();
    console.log(whereCard + " " + whichCard);
    let whereCardToInt = parseInt(whereCard);
    processCommand("hand_Hilfestapel", whichCardToInt, whereCardToInt);
}
function hilfestapel_Ablagestapel_click() {
    let whichCard = $('#whichCard').val();
    let whichCardToInt = parseInt(whichCard);
    let whereCard = $('#whereCard').val();
    let whereCardToInt = parseInt(whereCard);
    console.log(whereCard + " " + whichCard);
    processCommand("hilfestapel_Ablagestapel", whichCardToInt, whereCardToInt);
}
function spielerstapel_Ablagestapel_click(whereCard) {
    whereCard = $('#whereCard').val();
    whereCardToInt = parseInt(whereCard);
    console.log(whereCard + " " + whichCard);
    processCommand("spielerstapel_Ablagestapel", whereCardToInt, "");
}