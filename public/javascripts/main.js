function hand_Ablagestapel_click(whichCard, whereCard) {
    controlelr = localStorage.get
    console.log(controller);
    console.log("Which Card: " + document.getElementById("whichCard").value)
    let whichCardAsString = document.getElementById("whichCard").value;

    console.log("Where: " + document.getElementById("whereCard").value);
    let whereCardAsString = document.getElementById("whereCard").value;

    let whichCard = parseInt(whichCardAsString);
    let whereCard = parseInt(whereCardAsString);

    controller.pushCardHand(whereCard, whichCard, controller.playerState.getPlayer, false);
}
function hand_Hilfestapel_click(whichCard, whereCard) {
    controller = arguments.controller
    console.log("Hallo2");
    let whichCard = document.getElementById("whichCard").value.toInt - 1;
    let whereCard = document.getElementById("whereCard").value.toInt - 1;
    controller.pushCardHand(whereCard, whichCard, controller.playerState.getPlayer, true);
}
function hilfestapel_Ablagestapel_click(whichCard, whereCard) {
    /*
    controller = arguments.controller
    console.log("Hall3o");
    console.log(document.getElementById("whichCard").value.toInt - 1)
    let whichCard = document.getElementById("whichCard").value.toInt - 1;
    let whereCard = document.getElementById("whereCard").value.toInt - 1;
    controller.pushCardHelp(whereCard, whichCard, controller.playerState.getPlayer);
    */

}
function spielerstapel_Ablagestapel_click(whereCard) {
    /*
    controller = arguments.controller
    console.log("Wert" + document.getElementbyId("whereCard").value.toInt - 1);
    let whereCard = document.getElementbyId("whereCard").value.toInt - 1;
    controller.pushCardPlayer(whereCard, controller.palyerState.getPlayer);
    */
    window.location.href = "/spielerstapel_Ablagestapel/" + whereCard;
}