package controllers

import javax.inject._
import play.api.mvc._
import de.htwg.se.Skip_Bo.Skip_Bo
import play.api.libs.json.{JsObject, JsValue, Json, Writes}

import scala.language.postfixOps
/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class SkipBoController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  val gameController = Skip_Bo.controller
  gameController.startGame(5)
  def skipBoAsText = gameController.gameToString(0)

  def rules() = Action {
    Ok(views.html.Skip_Bo.rules())
  }

  def board() = Action {
    Ok(views.html.Skip_Bo.board(gameController))
  }

  def hand_Ablagestapel(whichCard: Int, whereCard: Int) = {
    gameController.pushCardHand(whereCard, whichCard, gameController.playerState.getPlayer, false);
  }

  def hand_Hilfestapel(whichCard: Int, whereCard: Int) =  {

    Console.printf(whichCard.toString, whereCard.toString)
    gameController.pushCardHand(whereCard, whichCard, gameController.playerState.getPlayer, true);
  }

  def hilfestapel_Ablagestapel(whichCard: Int, whereCard: Int) = {
    gameController.pushCardHelp(whichCard, whereCard, gameController.playerState.getPlayer);
  }

  def spielerstapel_Ablagestapel(whereCard: Int) = {
    gameController.pushCardPlayer(whereCard, gameController.playerState.getPlayer);
  }

//---------------------------------------------------------------------------
  def about = Action {
    Ok(skipBoAsText)
  }

  def skipBo = Action {
    Ok(views.html.index())
  }

//---------------------------------------------------------------------------------------------
  def status = Action{
    Ok(Json.obj(
      "playerA_Hand_0" -> playerHand(0, 0),
      "playerA_Hand_1" -> playerHand(0, 1),
      "playerA_Hand_2" -> playerHand(0, 2),
      "playerA_Hand_3" -> playerHand(0, 3),
      "playerA_Hand_4" -> playerHand(0, 4),
      "playerA_Spielerstapel_Value" -> playerSpielerStapel(0),
      "playerA_Spielerstapel_Size" -> playerSpielerStapelSize(0),
      "playerA_HelpStacks_0" -> playerHelpStacks(0,0),
      "playerA_HelpStacks_1" -> playerHelpStacks(0,1),
      "playerA_HelpStacks_2" -> playerHelpStacks(0,2),
      "playerA_HelpStacks_3" -> playerHelpStacks(0,3),
      "playerB_Hand_0" -> playerHand(1, 0),
      "playerB_Hand_1" -> playerHand(1, 1),
      "playerB_Hand_2" -> playerHand(1, 2),
      "playerB_Hand_3" -> playerHand(1, 3),
      "playerB_Hand_4" -> playerHand(1, 4),
      "playerB_Spielerstapel_Value" -> playerSpielerStapel(1),
      "playerB_Spielerstapel_Size" -> playerSpielerStapelSize(1),
      "playerB_HelpStacks_0" -> playerHelpStacks(1,0),
      "playerB_HelpStacks_1" -> playerHelpStacks(1,1),
      "playerB_HelpStacks_2" -> playerHelpStacks(1,2),
      "playerB_HelpStacks_3" -> playerHelpStacks(1,3),
      "ablagestapel_0" -> ablageStapel(0),
      "ablagestapel_1" -> ablageStapel(1),
      "ablagestapel_2" -> ablageStapel(2),
      "ablagestapel_3" -> ablageStapel(3),
      "current_Player" -> currentPlayer(),
      "gamestate" -> gameController.gameState,
      "statusmessage" -> gameController.statusText
    ))
  }

  def playerHand(player: Int, whichCard: Int) = gameController.game.player(player).cards(whichCard).toString()

  def playerSpielerStapel(player: Int) = gameController.game.player(player).stack.head.toString()

  def playerSpielerStapelSize(player: Int) = gameController.game.player(player).stack.size.toString()

  def playerHelpStacks(player: Int, value: Int) = {
    if (gameController.game.player(player).helpstack(value).isEmpty) {
      ""
    } else {
      gameController.game.player(player).helpstack(value).head.toString()
    }
  }

  def ablageStapel(whichStack: Int) = {
    if (gameController.game.stack(whichStack).isEmpty) {
      "0"
    } else {
      gameController.game.stack(whichStack).size.toString()
    }
  };

  def currentPlayer() = "Player " + gameController.playerState.name.toString 

//----------------------------------------------------------------------------------------------------------------------
  def processCommand(cmd: String, data1: String, data2: String): String = {

      Console.printf(cmd)
      var test = cmd.substring(1, cmd.length() - 1)
      Console.printf(test)

    if (test.equals("hand_Ablagestapel")) {

      var whichCard = (data1.toInt) - 1
      var whereCard = (data2.toInt) - 1
      this.hand_Ablagestapel(whichCard, whereCard)

    } else if (test.equals("hand_Hilfestapel")) {
      Console.printf(data1 + " ")
      Console.printf(data2)
      var whichCard = (data1.toInt) - 1
      var whereCard = (data2.toInt) - 1
      this.hand_Hilfestapel(whichCard, whereCard)

    } else if (test.equals("hilfestapel_Ablagestapel")) {

      var whichCard = (data1.toInt) - 1
      var whereCard = (data2.toInt) - 1
      this.hilfestapel_Ablagestapel(whichCard, whereCard)

    } else if (test.equals("spielerstapel_Ablagestapel")) {

      var whereCard = (data1.toInt) - 1
      this.spielerstapel_Ablagestapel(whereCard)

    }
    "Ok"
  }

  def badRequest(errorMessage: String) = BadRequest(errorMessage + "\nPlease return to the last site")

  def processRequest = Action {
    implicit request => {
      val req = request.body.asJson
      val result = processCommand(req.get("cmd").toString(), req.get("data1").toString(), req.get("data2").toString())
      if (result.contains("Error")) {
        BadRequest(result)
      } else {
        Ok(Json.obj(
      "playerA_Hand_0" -> playerHand(0, 0),
      "playerA_Hand_1" -> playerHand(0, 1),
      "playerA_Hand_2" -> playerHand(0, 2),
      "playerA_Hand_3" -> playerHand(0, 3),
      "playerA_Hand_4" -> playerHand(0, 4),
      "playerA_Spielerstapel_Value" -> playerSpielerStapel(0),
      "playerA_Spielerstapel_Size" -> playerSpielerStapelSize(0),
      "playerA_HelpStacks_0" -> playerHelpStacks(0,0),
      "playerA_HelpStacks_1" -> playerHelpStacks(0,1),
      "playerA_HelpStacks_2" -> playerHelpStacks(0,2),
      "playerA_HelpStacks_3" -> playerHelpStacks(0,3),
      "playerB_Hand_0" -> playerHand(1, 0),
      "playerB_Hand_1" -> playerHand(1, 1),
      "playerB_Hand_2" -> playerHand(1, 2),
      "playerB_Hand_3" -> playerHand(1, 3),
      "playerB_Hand_4" -> playerHand(1, 4),
      "playerB_Spielerstapel_Value" -> playerSpielerStapel(1),
      "playerB_Spielerstapel_Size" -> playerSpielerStapelSize(1),
      "playerB_HelpStacks_0" -> playerHelpStacks(1,0),
      "playerB_HelpStacks_1" -> playerHelpStacks(1,1),
      "playerB_HelpStacks_2" -> playerHelpStacks(1,2),
      "playerB_HelpStacks_3" -> playerHelpStacks(1,3),
      "ablagestapel_0" -> ablageStapel(0),
      "ablagestapel_1" -> ablageStapel(1),
      "ablagestapel_2" -> ablageStapel(2),
      "ablagestapel_3" -> ablageStapel(3),
      "current_Player" -> currentPlayer(),
      "gamestate" -> gameController.gameState,
      "statusmessage" -> gameController.statusText
    ))
      }
    }
  }
}
