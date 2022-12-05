$(document).ready(function () {
    getData().then(() => {
        updateInputPanel();
        updateGameBoard();
        refreshOnClickEvents();
        connectWebSocket();
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
            //refreshOnClickEvents();
        })
    })
}

function updateGameBoard() {
    let playerA_Spielerstapel_Value = data.playerA_Spielerstapel_Value;
    let playerA_Spielerstapel_Size = data.playerA_Spielerstapel_Size;
    let playerB_Spielerstapel_Value = data.playerB_Spielerstapel_Value;
    let playerB_Spielerstapel_Size = data.playerB_Spielerstapel_Size;
    let ablageStapel1 = data.ablageStapel_0;
    let ablageStapel2 = data.ablageStapel_1;
    let ablageStapel3 = data.ablageStapel_2;
    let ablageStapel4 = data.ablageStapel_3;
    let current_Player = data.current_Player;
    let gameState = data.gamestate;
    let statusmessage = data.statusmessage;

    $('#playerLabel').empty();
    $('#playerLabel').append(current_Player);

    $('#statusText').empty();
    $('#statusText').append(statusmessage);

    const playerStack = $('#spielerStapel').get(0);
    playerStack.innerHTML = "";
    if (current_Player === "Player A") {
        $('#playerIcon').attr("src", "/assets/images/playerA.png");
        playerStack.innerHTML = playerStack.innerHTML + `<p>Spielerstapel: | ${playerA_Spielerstapel_Value} |
                                                                                -
                                                                                verbleibende Karten:
                                                                                ${playerA_Spielerstapel_Size} </p>`;
    } else if (current_Player === "Player B") {
        $('#playerIcon').attr("src", "/assets/images/playerB.png");
        playerStack.innerHTML = playerStack.innerHTML + `<p>Spielerstapel: | ${playerB_Spielerstapel_Value} |
                                                                                        -
                                                                                        verbleibende Karten:
                                                                                        ${playerB_Spielerstapel_Size} </p>`;
    }

    const parenHandKartenStack = $('#HandKartenID').get(0);
    parenHandKartenStack.innerHTML = "<p> Handkarten: ";
    if (current_Player === "Player A") {
        if (data.playerA_Hand_0 === "" && data.playerA_Hand_1 === "" && data.playerA_Hand_2 === "" && data.playerA_Hand_3 === "" && data.playerA_Hand_4 === "") {
            parenHandKartenStack.innerHTML += "| 0 | | 0 | | 0 | | 0 | | 0 |";
        } else {
            if (data.playerA_Hand_0 !== "") {
                parenHandKartenStack.innerHTML += "| " + data.playerA_Hand_0 + " | ";
            }
            if (data.playerA_Hand_1 !== "") {
                parenHandKartenStack.innerHTML += "| " + data.playerA_Hand_1 + " | ";
            }
            if (data.playerA_Hand_2 !== "") {
                parenHandKartenStack.innerHTML += "| " + data.playerA_Hand_2 + " | ";
            }
            if (data.playerA_Hand_3 !== "") {
                parenHandKartenStack.innerHTML += "| " + data.playerA_Hand_3 + " | ";
            }
            if (data.playerA_Hand_4 !== "") {
                parenHandKartenStack.innerHTML += "| " + data.playerA_Hand_4 + " | ";
            }
            parenHandKartenStack.innerHTML += "</p>";
        }
    } else {
        if (data.playerB_Hand_0 === "" && data.playerB_Hand_1 === "" && data.playerB_Hand_2 === "" && data.playerB_Hand_3 === "" && data.playerB_Hand_4 === "") {
            parenHandKartenStack.innerHTML += "| 0 | | 0 | | 0 | | 0 | | 0 |";
        } else {
            if (data.playerB_Hand_0 !== "") {
                parenHandKartenStack.innerHTML += "| " + data.playerB_Hand_0 + " | ";
            }
            if (data.playerB_Hand_1 !== "") {
                parenHandKartenStack.innerHTML += "| " + data.playerB_Hand_1 + " | ";
            }
            if (data.playerB_Hand_2 !== "") {
                parenHandKartenStack.innerHTML += "| " + data.playerB_Hand_2 + " | ";
            }
            if (data.playerB_Hand_3 !== "") {
                parenHandKartenStack.innerHTML += "| " + data.playerB_Hand_3 + " | ";
            }
            if (data.playerB_Hand_4 !== "") {
                parenHandKartenStack.innerHTML += "| " + data.playerB_Hand_4 + " | ";
            }
            parenHandKartenStack.innerHTML += "</p>";
        }
    }

    const parentHelpStack = $('#helpStackID').get(0);
    parentHelpStack.innerHTML = "<p>Hilfestapel:</p>";
    if (current_Player === "Player A") {
        if (data.playerA_HelpStacks_0 === "") {
            parentHelpStack.innerHTML += "<p>| leer |</p>";
        } else {
            parentHelpStack.innerHTML += "<p>|" + data.playerA_HelpStacks_0 + "|</p>"
        }
        if (data.playerA_HelpStacks_1 === "") {
            parentHelpStack.innerHTML += "<p>| leer |</p>";
        } else {
            parentHelpStack.innerHTML += "<p>|" + data.playerA_HelpStacks_1 + "|</p>"
        }
        if (data.playerA_HelpStacks_2 === "") {
            parentHelpStack.innerHTML += "<p>| leer |</p>";
        } else {
            parentHelpStack.innerHTML += "<p>|" + data.playerA_HelpStacks_2 + "|</p>"
        }
        if (data.playerA_HelpStacks_3 === "") {
            parentHelpStack.innerHTML += "<p>| leer |</p>";
        } else {
            parentHelpStack.innerHTML += "<p>|" + data.playerA_HelpStacks_3 + "|</p>"
        }
    } else {
        if (data.playerB_HelpStacks_0 === "") {
            parentHelpStack.innerHTML += "<p>| leer |</p>";
        } else {
            parentHelpStack.innerHTML += "<p>|" + data.playerB_HelpStacks_0 + "|</p>"
        }
        if (data.playerB_HelpStacks_1 === "") {
            parentHelpStack.innerHTML += "<p>| leer |</p>";
        } else {
            parentHelpStack.innerHTML += "<p>|" + data.playerB_HelpStacks_1 + "|</p>"
        }
        if (data.playerB_HelpStacks_2 === "") {
            parentHelpStack.innerHTML += "<p>| leer |</p>";
        } else {
            parentHelpStack.innerHTML += "<p>|" + data.playerB_HelpStacks_2 + "|</p>"
        }
        if (data.playerB_HelpStacks_3 === "") {
            parentHelpStack.innerHTML += "<p>| leer |</p>";
        } else {
            parentHelpStack.innerHTML += "<p>|" + data.playerB_HelpStacks_3 + "|</p>"
        }
    }

    const parent = $('#AblageStapelID').get(0);
    parent.innerHTML = "<p>AblageStapel: | " + data.ablagestapel_0 + " | " + data.ablagestapel_1 + " | " + data.ablagestapel_2 + " | " + data.ablagestapel_3 + " |</p>";

}

function updateInputPanel() {
    const parent = $('#input-panel-group').get(0);
    parent.innerHTML = sHandToAblage + sHandToHilfe + sHilfeToAblage + sSpielerToAblage + "</div>";
}

let sHandToAblage = "<div class=\"col-xl-3\">\n" +
    "   <button class=\"gameButton\" id=\"hand_Ablagestapel\">\n" +
    "Karte von Hand auf Ablagestapel" +
    "</button> \n" +
    "</div> \n"


let sHandToHilfe = "<div class=\"col-xl-3\">\n" +
    "   <button class=\"gameButton\" id=\"hand_Hilfestapel\">\n" +
    "Karte " +
    "von Hand auf " +
    "Hilfstapel" +
    "</button> \n" +
    "</div> \n"

let sHilfeToAblage = "<div class=\"col-xl-3\">\n" +
    "   <button class=\"gameButton\" id=\"hilfestapel_Ablagestapel\">\n" +
    "Karte von Hilfestapel auf Ablagestapel" +
    "</button> \n" +
    "</div> \n"

let sSpielerToAblage = "<div class=\"col-xl-3\">\n" +
    "   <button class=\"gameButton\" id=\"spielerstapel_Ablagestapel\"> " +
    "Karte vom Spielerstapel auf Ablagestapel" +
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

//----------------------------------------- WEBSOCKET

function updateGameNoAjax(){
    updateInputPanel();
    updateGameBoard();
    refreshOnClickEvents();
}

function processCmdWS(cmd, data1, data2) {
    console.log("process " + cmd + ",   " + data1 + ".    " + data2)
    websocket.send(cmd + "|" + data1 + "|" + data2)
}


let websocket = new WebSocket("ws://localhost:9000/websocket");
window.onbeforeunload = function () {
    websocket.onclose = function () {
        console.log("closed beforeunlaod")
    };
    websocket.close();
};

function connectWebSocket() {

    websocket.onopen = function (event) {
        websocket.send("Trying to connect to Server");
    }

    websocket.onclose = function () {
        console.log("closed")
    };

    websocket.onerror = function (error) {
    };

    websocket.onmessage = function (e) {
        if (typeof e.data === "string") {
            data = JSON.parse(e.data)
            updateGameNoAjax()
        }
    };
}
//-------------------------------------------------------------------------------------

function hand_Ablagestapel_click() {
    let whichCard = $('#whichCard').val();
    let whichCardToInt = parseInt(whichCard);
    let whereCard = $('#whereCard').val();
    let whereCardToInt = parseInt(whereCard);
    console.log(whereCard + " " + whichCard);
    //processCommand("hand_Ablagestapel", whichCardToInt, whereCardToInt);
    processCmdWS("hand_Ablagestapel", whichCardToInt, whereCardToInt);
}
function hand_Hilfestapel_click() {
    let whichCard = $('#whichCard').val();
    let whichCardToInt = parseInt(whichCard);
    let whereCard = $('#whereCard').val();
    console.log(whereCard + " " + whichCard);
    let whereCardToInt = parseInt(whereCard);
    //processCommand("hand_Hilfestapel", whichCardToInt, whereCardToInt);
    processCmdWS("hand_Hilfestapel", whichCardToInt, whereCardToInt);
}
function hilfestapel_Ablagestapel_click() {
    let whichCard = $('#whichCard').val();
    let whichCardToInt = parseInt(whichCard);
    let whereCard = $('#whereCard').val();
    let whereCardToInt = parseInt(whereCard);
    console.log(whereCard + " " + whichCard);
    //processCommand("hilfestapel_Ablagestapel", whichCardToInt, whereCardToInt);
    processCmdWS("hilfestapel_Ablagestapel", whichCardToInt, whereCardToInt);
}
function spielerstapel_Ablagestapel_click(whereCard) {
    whereCard = $('#whereCard').val();
    whereCardToInt = parseInt(whereCard);
    console.log(whereCard + " " + whichCard);
    //processCommand("spielerstapel_Ablagestapel", whereCardToInt, "");
    processCmdWS("spielerstapel_Ablagestapel", whereCardToInt, "");
}
