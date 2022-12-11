const app = Vue.createApp({})

app.component('gameboard', {
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

            spielerStapel_Value: "",
            spielerStapel_Size: 0,

            spielerErsteKarte: "0",
            spielerZweiteKarte: "0",
            spielerDritteKarte: "0",
            spielerVierteKarte: "0",
            spielerFünfteKarte: "0",

            hilfeStapel1: "0",
            hilfeStapel2: "0",
            hilfeStapel3: "0",
            hilfeStapel4: "0",

            selectedCard: 0,
            whichStack: "",
            whichCard: null,

        }
    },
    computed() {
        this.loadPlayerCards();
        this.loadHelpStack();
        this.loadAblageStack();
        this.loadSpielerStack();
    },
    created() {
        this.getData();
        this.connectWebSocket();
    },
    methods: {
        connectWebSocket() {
            this.websocketVUE.onopen = (event) => {
                this.websocketVUE.send("Trying to connect to Server");
            }

            this.websocketVUE.onclose = (event) => {
                console.log("closed")
            };

            this.websocketVUE.onerror = (event) => {
            };

            this.websocketVUE.onmessage = (e) => {
                console.log("onmessage: ")
                console.log(e.data)
                if (typeof e.data === "string") {
                    this.data = JSON.parse(e.data)
                    this.getData();
                }
            };

        },
        loadPlayerCards() {
            if (this.current_Player === "Player A") {
                this.spielerErsteKarte = this.data.playerA_Hand_0;
                this.spielerZweiteKarte = this.data.playerA_Hand_1;
                this.spielerDritteKarte = this.data.playerA_Hand_2;
                this.spielerVierteKarte = this.data.playerA_Hand_3;
                this.spielerFünfteKarte = this.data.playerA_Hand_4;
            } else {
                this.spielerErsteKarte = this.data.playerB_Hand_0;
                this.spielerZweiteKarte = this.data.playerB_Hand_1;
                this.spielerDritteKarte = this.data.playerB_Hand_2;
                this.spielerVierteKarte = this.data.playerB_Hand_3;
                this.spielerFünfteKarte = this.data.playerB_Hand_4;
            }
        },

        loadHelpStack() {
            if (this.current_Player === "Player A") {
                this.hilfeStapel1 = this.data.playerA_HelpStacks_0;
                this.hilfeStapel2 = this.data.playerA_HelpStacks_1;
                this.hilfeStapel3 = this.data.playerA_HelpStacks_2;
                this.hilfeStapel4 = this.data.playerA_HelpStacks_3;
            } else {
                this.hilfeStapel1 = this.data.playerB_HelpStacks_0;
                this.hilfeStapel2 = this.data.playerB_HelpStacks_1;
                this.hilfeStapel3 = this.data.playerB_HelpStacks_2;
                this.hilfeStapel4 = this.data.playerB_HelpStacks_3;
            }
        },

        loadAblageStack() {
            this.ablageStapel1 = this.data.ablagestapel_0;
            this.ablageStapel2 = this.data.ablagestapel_1;
            this.ablageStapel3 = this.data.ablagestapel_2;
            this.ablageStapel4 = this.data.ablagestapel_3;
        },

        loadSpielerStack() {
            if (this.current_Player === "Player A") {
                this.spielerStapel_Value = this.data.playerA_Spielerstapel_Value;
                this.spielerStapel_Size = this.data.playerA_Spielerstapel_Size;
            } else {
                this.spielerStapel_Value = this.data.playerB_Spielerstapel_Value;
                this.spielerStapel_Size = this.data.playerB_Spielerstapel_Size;
            }
        },
        processCmdWS(cmd, data1, data2) {
            console.log("process " + cmd + "|" + data1 + "|" + data2)
            this.websocketVUE.send(cmd + "|" + data1 + "|" + data2)
        },

        processCommand(cmd, data, data2) {
            console.log("CMD: " + cmd + " data1: " + data + " data2: " + data2);
            post("POST", "/command", { "cmd": cmd, "data1": data, "data2": data2 }).then(() => {
                getData().then(() => {

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
                    this.data = response;
                    console.log(this.data);
                },
                error: function (response) {
                    console.log("Error");
                    console.error(response);
                }
            });
        },
        getData() {
            let that = this;
            return $.ajax({
                method: "GET",
                url: "/status",
                dataType: "json",
                success: function (response) {
                    that.data = response;
                    that.playerA_Spielerstapel_Value = response.playerA_Spielerstapel_Value;
                    that.playerA_Spielerstapel_Size = response.playerA_Spielerstapel_Size;
                    that.playerB_Spielerstapel_Value = response.playerB_Spielerstapel_Value;
                    that.playerB_Spielerstapel_Size = response.playerB_Spielerstapel_Size;
                    that.ablageStapel1 = response.ablagestapel_0;
                    that.ablageStapel2 = response.ablagestapel_1;
                    that.ablageStapel3 = response.ablagestapel_2;
                    that.ablageStapel4 = response.ablagestapel_3;
                    that.current_Player = response.current_Player;
                    that.gameState = response.gamestate;
                    that.statusmessage = response.statusmessage;
                    that.selectedCard = 0;
                    that.whichCard = null;
                    that.whichStack = "";
                    that.loadPlayerCards();
                    that.loadHelpStack();
                    that.loadAblageStack();
                    that.loadSpielerStack();
                }
            });
        },

        hand_Ablagestapel_click() {
            let whichCard = $('#whichCard').val();
            let whichCardToInt = parseInt(whichCard);
            let whereCard = $('#whereCard').val();
            let whereCardToInt = parseInt(whereCard);
            this.processCmdWS("hand_Ablagestapel", whichCardToInt, whereCardToInt);
        },

        hand_Hilfestapel_click() {
            let whichCard = $('#whichCard').val();
            let whichCardToInt = parseInt(whichCard);
            let whereCard = $('#whereCard').val();
            console.log(whereCard + " " + whichCard);
            let whereCardToInt = parseInt(whereCard);
            this.processCmdWS("hand_Hilfestapel", whichCardToInt, whereCardToInt);
        },
        hilfestapel_Ablagestapel_click() {
            let whichCard = $('#whichCard').val();
            let whichCardToInt = parseInt(whichCard);
            let whereCard = $('#whereCard').val();
            let whereCardToInt = parseInt(whereCard);
            console.log(whereCard + " " + whichCard);
            this.processCmdWS("hilfestapel_Ablagestapel", whichCardToInt, whereCardToInt);
        },
        spielerstapel_Ablagestapel_click(whereCard) {
            whereCard = $('#whereCard').val();
            whereCardToInt = parseInt(whereCard);
            console.log(whereCard + " " + whichCard);
            this.processCmdWS("spielerstapel_Ablagestapel", whereCardToInt, ".");
        },
        selectCard(stacktype, index) {
            console.log(stacktype);
            if(stacktype === 'Spielerstapel'){
                if (this.selectedCard == 1){
                    this.selectedCard = 0;
                    this.whichStack = "";
                } else {
                    this.selectedCard = 1;
                    this.whichStack = "Spielerstapel";
                    this.whichCard = index;
                }
            } else if (stacktype === 'Hand'){
                if(this.selectedCard == index + 1){
                    this.selectedCard = 0;
                    this.whichStack = "";
                    this.whichCard = null;
                } else {
                    this.selectedCard = index + 1;
                    this.whichStack = "Hand";
                    this.whichCard = index;
                }
            } else if (stacktype === 'Help'){
                if(this.selectedCard == 0){
                    if (index == 1){
                        if((this.whichCard == null && (this.hilfeStapel1 == "0"))){
                            return;
                        }
                    } else if (index == 2){
                        console.log(this.whichCard +"  " + this.hilfeStapel2);
                        if((this.whichCard == null && (this.hilfeStapel2 == "0"))){
                            return;
                        }
                    } else if (index == 3){
                        if((this.whichCard == null && (this.hilfeStapel3 == "0"))){
                            return;
                        }
                    } else if (index == 4){
                        if((this.whichCard == null && (this.hilfeStapel4 == "0"))){
                            return;
                        }
                    }
                    this.selectedCard = index + 6;
                    this.whichStack = "Help";
                    this.whichCard = index;
                } else if (this.selectedCard == index + 6){
                    this.selectedCard = 0;
                    this.whichStack = "";
                    this.whichCard = null;
                    console.log("hier");
                } else {
                    this.placeCard('Help', index);
                }
            }
        },
        placeCard(stacktype, index){
            console.log("whichCard: " + this.whichCard);
            console.log("whichStack: " + this.whichStack);
            console.log("selectedCard: " + this.selectedCard);
            if (this.whichCard == null){
                return;
            }
            if (stacktype === 'Help'){
                if (this.whichStack === "Spielerstapel"){
                    return;
                } else if (this.whichStack === "Hand"){
                    this.processCmdWS("hand_Hilfestapel", this.whichCard, index);
                }
            }
            if (stacktype === 'Ablage'){
                if (this.whichStack === "Spielerstapel"){
                    console.log("hiii");
                    this.processCmdWS("spielerstapel_Ablagestapel", index, ".");
                }
                if (this.whichStack === "Hand"){
                    this.processCmdWS("hand_Ablagestapel", this.whichCard, index);
                }
                if (this.whichStack === "Help"){
                    this.processCmdWS("hilfestapel_Ablagestapel", this.whichCard, index);
                }
            }
        }
    },
    template: `
    <div class="board">
    <div class ="flexContainer">
        <div class="firstChild">
            <span> Karten auf der Hand</span> 
            <br>
            <img v-if="spielerErsteKarte === '0'" v-bind:src="'/assets/images/' + spielerErsteKarte + 'Card.png'" class = "playerCards">
            <img v-else-if="selectedCard == 2" v-bind:src="'/assets/images/' + spielerErsteKarte + 'Card.png'" class = "playerCardsSelected" @click="selectCard('Hand',1)">
            <img v-else v-bind:src="'/assets/images/' + spielerErsteKarte + 'Card.png'" class = "playerCards" @click="selectCard('Hand',1)">

            <img v-if="spielerZweiteKarte === '0'" v-bind:src="'/assets/images/' + spielerZweiteKarte + 'Card.png'" class = "playerCards">
            <img v-else-if="selectedCard == 3" v-bind:src="'/assets/images/' + spielerZweiteKarte + 'Card.png'" class = "playerCardsSelected" @click="selectCard('Hand',2)">
            <img v-else v-bind:src="'/assets/images/' + spielerZweiteKarte + 'Card.png'" class = "playerCards" @click="selectCard('Hand',2)">

            <img v-if="spielerDritteKarte === '0'" v-bind:src="'/assets/images/' + spielerDritteKarte + 'Card.png'" class = "playerCards">
            <img v-else-if="selectedCard == 4" v-bind:src="'/assets/images/' + spielerDritteKarte + 'Card.png'" class = "playerCardsSelected" @click="selectCard('Hand',3)">
            <img v-else v-bind:src="'/assets/images/' + spielerDritteKarte + 'Card.png'" class = "playerCards" @click="selectCard('Hand',3)">

            <img v-if="spielerVierteKarte === '0'" v-bind:src="'/assets/images/' + spielerVierteKarte + 'Card.png'" class = "playerCards">
            <img v-else-if="selectedCard == 5" v-bind:src="'/assets/images/' + spielerVierteKarte + 'Card.png'" class = "playerCardsSelected" @click="selectCard('Hand',4)">
            <img v-else v-bind:src="'/assets/images/' + spielerVierteKarte + 'Card.png'" class = "playerCards" @click="selectCard('Hand',4)">

            <img v-if="spielerFünfteKarte === '0'" v-bind:src="'/assets/images/' + spielerFünfteKarte + 'Card.png'" class = "playerCards">
            <img v-else-if="selectedCard == 6" v-bind:src="'/assets/images/' + spielerFünfteKarte + 'Card.png'" class = "playerCardsSelected" @click="selectCard('Hand',5)">
            <img v-else v-bind:src="'/assets/images/' + spielerFünfteKarte + 'Card.png'" class = "playerCards" @click="selectCard('Hand',5)">
        </div>
        <div class="secondChild">
            <span> SpielerStapel </span>
            <br>
            <img v-if="selectedCard == 1" v-bind:src="'/assets/images/' + spielerStapel_Value + 'Card.png'" class = "playerCardsSelected" @click="selectCard('Spielerstapel', 0)">
            <img v-else v-bind:src="'/assets/images/' + spielerStapel_Value + 'Card.png'" class = "playerCards" @click="selectCard('Spielerstapel', 0)">
            <span>{{spielerStapel_Size}}</span>
        </div>
    </div>

    <p> Hilfekarten </p>
    <img v-if="selectedCard == 7 && whichStack === 'Help'" v-bind:src="'/assets/images/' + hilfeStapel1 + 'Card.png'" class = "playerCardsSelected" @click="selectCard('Help', 1)">
    <img v-else v-bind:src="'/assets/images/' + hilfeStapel1 + 'Card.png'" class = "playerCards" @click="selectCard('Help', 1)">

    <img v-if="selectedCard == 8 && whichStack === 'Help'" v-bind:src="'/assets/images/' + hilfeStapel2 + 'Card.png'" class = "playerCardsSelected" @click="selectCard('Help', 2)">
    <img v-else v-bind:src="'/assets/images/' + hilfeStapel2 + 'Card.png'" class = "playerCards" @click="selectCard('Help', 2)">

    <img v-if="selectedCard == 9 && whichStack === 'Help'" v-bind:src="'/assets/images/' + hilfeStapel3 + 'Card.png'" class = "playerCardsSelected" @click="selectCard('Help', 3)">
    <img v-else v-bind:src="'/assets/images/' + hilfeStapel3 + 'Card.png'" class = "playerCards" @click="selectCard('Help', 3)">

    <img v-if="selectedCard == 10 && whichStack === 'Help'" v-bind:src="'/assets/images/' + hilfeStapel4 + 'Card.png'" class = "playerCardsSelected" @click="selectCard('Help', 4)">
    <img v-else v-bind:src="'/assets/images/' + hilfeStapel4 + 'Card.png'" class = "playerCards" @click="selectCard('Help', 4)">

    <p> Abgelegene Karten </p>
    <img v-bind:src="'/assets/images/' + ablageStapel1 + 'Card.png'" class = "playerCards" @click="placeCard('Ablage', 1)">
    <img v-bind:src="'/assets/images/' + ablageStapel2 + 'Card.png'" class = "playerCards" @click="placeCard('Ablage', 2)">
    <img v-bind:src="'/assets/images/' + ablageStapel3 + 'Card.png'" class = "playerCards" @click="placeCard('Ablage', 3)">
    <img v-bind:src="'/assets/images/' + ablageStapel4 + 'Card.png'" class = "playerCards" @click="placeCard('Ablage', 4)">
    </div>

    <div name="statusMessage" class="statusMessage">
        <h2>{{ current_Player }}s turn</h2>
    </div>
    `,
})
app.mount('#Skip_Bo_Game')