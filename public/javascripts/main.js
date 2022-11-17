function hand_Ablagestapel_click(whichCard, whereCard) {
    console.log("erste Methode: " + whichCard + " | " + whereCard);
    whichCardInt = parseInt(whichCard) - 1;
    whereCardInt = parseInt(whereCard) - 1;
    window.location.href = "/hand_Ablagestapel/" + whichCardInt + "/" + whereCardInt;
}
function hand_Hilfestapel_click(whichCard, whereCard) {
    console.log("zweite Methode: " + whichCard + " | " + whereCard);
    whichCardInt = parseInt(whichCard) - 1;
    whereCardInt = parseInt(whereCard) - 1;
    window.location.href = "/hand_Hilfestapel/" + whichCardInt + "/" + whereCardInt;
}
function hilfestapel_Ablagestapel_click(whichCard, whereCard) {
    console.log("dritte Methode: " + whichCard + " | " + whereCard);
    whichCardInt = (parseInt(whichCard)) - 1;
    whereCardInt = (parseInt(whereCard)) - 1;
    window.location.href = "/hilfestapel_Ablagestapel/" + whichCardInt + "/" + whereCardInt;
}
function spielerstapel_Ablagestapel_click(whereCard) {
    console.log("Hallo " + whereCard);
    card = parseInt(whereCard) - 1;
    window.location.href = "/spielerstapel_Ablagestapel/" + card;
}