const app = Vue.createApp({})

app.component('gameBoard', {
    data() {
        return {
            websocketVUE: new WebSocket("ws://localhost:9000/websocket"),
            data: {},
            playerA_Spielerstapel_Value: " ",
            playerA_Spielerstapel_Size: 0,
            playerB_Spielerstapel_Value: " ",
            playerB_Spielerstapel_Size: 0,
            ablageStapel1: " ",
            ablageStapel2: " ",
            ablageStapel3: " ",
            ablageStapel4: " ",
            current_Player: " ",
            gameState: " ",
            statusmessage: " ",
        }
    },
    created() {
        this.getData();
        this.connectWebSocket();
    },
    computed: {
        loadFirst() {
            if (current_Player === "Player A") {
                return getCardImage(this.data.playerA_HelpStacks_0);
            } else {
                return getCardImage(this.data.playerB_HelpStacks_0);
            }
        },
        loadSecond() {
            if (current_Player === "Player A") {
                return getCardImage(this.data.playerA_HelpStacks_1);
            } else {
                return getCardImage(this.data.playerB_HelpStacks_1);
            }
        },
        loadThird() {
            if (current_Player === "Player A") {
                return getCardImage(this.data.playerA_HelpStacks_2);
            } else {
                return getCardImage(this.data.playerB_HelpStacks_2);
            }
        },
        loadFourth() {
            if (current_Player === "Player A") {
                return getCardImage(this.data.playerA_HelpStacks_3);
            } else {
                return getCardImage(this.data.playerB_HelpStacks_3);
            }
        },
    },
    methods: {
        connectWebSocket() {
            this.websocketVUE.onopen = function (event) {
                this.websocketVUE.send("Trying to connect to Server");
            }

            this.websocketVUE.onclose = function () {
                console.log("closed")
            };

            this.websocketVUE.onerror = function (error) {
            };

            this.websocketVUE.onmessage = function (e) {
                if (typeof e.data === "string") {
                    data = JSON.parse(e.data)
                    updateGameNoAjax()
                }
            };
        },

        processCmdWS(cmd, data1, data2) {
            console.log("process " + cmd + ",   " + data1 + ".    " + data2)
            websocket.send(cmd + "|" + data1 + "|" + data2)
        },

        processCommand(cmd, data, data2) {
            console.log("CMD: " + cmd + " data1: " + data + " data2: " + data2);
            post("POST", "/command", { "cmd": cmd, "data1": data, "data2": data2 }).then(() => {
                getData().then(() => {
                    updateInputPanel();
                    updateGameBoard();
                    //refreshOnClickEvents();
                })
            })
        },

        post(method, url, data) {
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
        },

        getData() { // hier nochmal drüberschauen !!!!!!!!!!!!!!!!!!
            return $.ajax({
                method: "GET",
                url: "/status",
                dataType: "json",
                success: function (response) {
                    data = response;
                }
            });
        },

        updateGameBoard() {
            let playerA_Spielerstapel_Value = this.data.playerA_Spielerstapel_Value;
            let playerA_Spielerstapel_Size = this.data.playerA_Spielerstapel_Size;
            let playerB_Spielerstapel_Value = this.data.playerB_Spielerstapel_Value;
            let playerB_Spielerstapel_Size = this.data.playerB_Spielerstapel_Size;
            let ablageStapel1 = this.data.ablageStapel_0;
            let ablageStapel2 = this.data.ablageStapel_1;
            let ablageStapel3 = this.data.ablageStapel_2;
            let ablageStapel4 = this.data.ablageStapel_3;
            let current_Player = this.data.current_Player;
            let gameState = this.data.gamestate;
            let statusmessage = this.data.statusmessage;

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

        },

        getCardImage(cardValue) {
            switch (cardValue) {
                case "1":
                    return "firstCard.png";
                case "2":
                    return "secondCard.png";
                case "3":
                    return "thirdCard.png";
                case "4":
                    return "fourthCard.png";
                case "5":
                    return "fifthCard.png";
                case "6":
                    return "sixthCard.png";
                case "7":
                    return "seventhCard.png";
                case "8":
                    return "eightCard.png";
                case "9":
                    return "ninethCard.png";
                case "10":
                    return "tenCard.png";
                case "11":
                    return "elevenCard.png";
                case "12":
                    return "twelveCard.png";
                case "J":
                    return "jokerCard.png";
                case "":
                    return "leer";
                default:
                    console.log("Du Opfer");
                    break;
            }
        },

        hand_Ablagestapel_click() {
            let whichCard = $('#whichCard').val();
            let whichCardToInt = parseInt(whichCard);
            let whereCard = $('#whereCard').val();
            let whereCardToInt = parseInt(whereCard);
            console.log(whereCard + " " + whichCard);
            //processCommand("hand_Ablagestapel", whichCardToInt, whereCardToInt);
            processCmdWS("hand_Ablagestapel", whichCardToInt, whereCardToInt);
        },
        hand_Hilfestapel_click() {
            let whichCard = $('#whichCard').val();
            let whichCardToInt = parseInt(whichCard);
            let whereCard = $('#whereCard').val();
            console.log(whereCard + " " + whichCard);
            let whereCardToInt = parseInt(whereCard);
            //processCommand("hand_Hilfestapel", whichCardToInt, whereCardToInt);
            processCmdWS("hand_Hilfestapel", whichCardToInt, whereCardToInt);
        },
        hilfestapel_Ablagestapel_click() {
            let whichCard = $('#whichCard').val();
            let whichCardToInt = parseInt(whichCard);
            let whereCard = $('#whereCard').val();
            let whereCardToInt = parseInt(whereCard);
            console.log(whereCard + " " + whichCard);
            //processCommand("hilfestapel_Ablagestapel", whichCardToInt, whereCardToInt);
            processCmdWS("hilfestapel_Ablagestapel", whichCardToInt, whereCardToInt);
        },
        spielerstapel_Ablagestapel_click(whereCard) {
            whereCard = $('#whereCard').val();
            whereCardToInt = parseInt(whereCard);
            console.log(whereCard + " " + whichCard);
            //processCommand("spielerstapel_Ablagestapel", whereCardToInt, "");
            processCmdWS("spielerstapel_Ablagestapel", whereCardToInt, "");
        },
    },
    template: `
    <p> HilfeStapel: </p>
    `,
})
app.component('Action-Components', {
    template: `
    <div class="col-xl-3">
        <button class="gameButton" id="hand_Ablagestapel"> 
            Karte von Hand auf Ablagestapel
        </button>
    </div>
    <div class="col-xl-3">
        <button class="gameButton" id="hand_Hilfestape">
            Karte von Hand auf Hilfestapel
        </button>
    </div>
    <div class="col-xl-3">
        <button class="gameButton" id="hilfestapel_Ablagestapel">
            Karte von Hilfestapel auf Ablagestapel
        </button>
    </div>
    <div class="col-xl-3">
        <button class="gameButton" id="spielerstapel_Ablagestapel">
            Karte vom Spielerstapel auf Ablagestapel
        </button>
    </div>
    `
}
)

app.mount('#Skip_Bo_Game')