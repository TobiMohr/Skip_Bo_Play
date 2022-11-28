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

  def hand_Ablagestapel(whichCard: Int, whereCard: Int) = Action {
    gameController.pushCardHand(whereCard, whichCard, gameController.playerState.getPlayer, false);
    Ok(views.html.Skip_Bo.board(gameController))
  }

  def hand_Hilfestapel(whichCard: Int, whereCard: Int) = Action {
    gameController.pushCardHand(whereCard, whichCard, gameController.playerState.getPlayer, true);
    Ok(views.html.Skip_Bo.board(gameController))
  }

  def hilfestapel_Ablagestapel(whichCard: Int, whereCard: Int) = Action {
    gameController.pushCardHelp(whichCard, whereCard, gameController.playerState.getPlayer);
    Ok(views.html.Skip_Bo.board(gameController))
  }

  def spielerstapel_Ablagestapel(whereCard: Int) = Action {
    gameController.pushCardPlayer(whereCard, gameController.playerState.getPlayer);
    Ok(views.html.Skip_Bo.board(gameController))
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
      "playerA_Hand" -> playerHand(0),
      "playerA_Spielerstapel" -> playerSpielerStapel(0),
      "playerA_Helpstacks" -> playerHelpstacks(0),
      "playerB_Hand" -> playerHand(1),
      "playerB_Spielerstapel" -> playerSpielerStapel(1),
      "playerB_HelpStacks" -> playerHelpstacks(1),
      "ablagestapel" -> ablageStapel(),
      "current_Player" -> currentPlayer(),
      "gamestate" -> gameController.gameState,
      "statusmessage" -> gameController.statusText
    ))
  }

  def playerHand(player: Int): JsValue = Json.toJson(
      for {
        handSize <- gameController.game.player(player).cards.indices
      } yield {
        val position = handSize + 1
        Json.obj(
          "Cardnumber" -> position,
          "Cardvalue" -> Json.toJson(gameController.game.player(player).cards(handSize).toString())
        )
      }
  )

  def playerSpielerStapel(player: Int): JsValue = Json.toJson(
    Json.obj(
      "Size" -> gameController.game.player(player).stack.size,
      "Top Card" -> gameController.game.player(player).stack.head.toString()
    )
  )

  def playerHelpstacks(player: Int): JsValue = Json.toJson(
    for {
      helpstack <- gameController.game.player(player).helpstack.indices
    } yield {
      val helpstack_number = helpstack + 1
      Json.obj(
        "HelpStack Number" -> helpstack_number,
        "HelpStack Size" -> gameController.game.player(player).helpstack(helpstack).size,
        "HelpStack Cards" -> helpStackCards(player, helpstack)
      )
    }
  )

  def ablageStapel(): JsValue = Json.toJson(
    for {
      stack <- gameController.game.stack.indices
    } yield {
      val stack_number = stack + 1
      Json.obj(
        "Stacknumber" -> stack_number,
        "Number of Cards" -> gameController.game.stack(stack).size
      )
    }
  )

  def currentPlayer() = "Its Player " + gameController.playerState.name.toString + "'s turn right now."


  def helpStackCards(player: Int, helpstack: Int): JsValue = Json.toJson(
    for {
      card <- gameController.game.player(player).helpstack(helpstack).indices
    } yield {
      val postion = card + 1
      Json.obj(
        "Cardposition" -> postion,
        "Cardvalue" -> gameController.game.player(player).helpstack(helpstack)(card).toString()
      )
    }
  )

//----------------------------------------------------------------------------------------------------------------------
    def processCommand(cmd: String, data: String): String = {
    if (cmd.equals("\"board\"")) {
      board
    } else if (cmd.equals("\"hand_Ablagestapel\"")) {
      println(data)
      //hand_Ablagestapel
    } else if (cmd.equals("\"hand_Hilfestapel\"")) {
      //hand_Hilfestapel
    } else if (cmd.equals("\"hilfestapel_Ablagestapel\"")) {
      //hilfestapel_Ablagestapel
    } else if (cmd.equals("\"spielerstapel_Ablagestapel\"")) {
      //spielerstapel_Ablagestapel(data.replace("\"", ""))
    }
    "Ok"
  }

  def badRequest(errorMessage: String) = BadRequest(errorMessage + "\nPlease return to the last site")

  def processRequest = Action {
    implicit request => {
      val req = request.body.asJson
      val result = processCommand(req.get("cmd").toString(), req.get("data").toString())
      if (result.contains("Error")) {
        BadRequest(result)
      } else {
        Ok(Json.obj(
      "playerA_Hand" -> playerHand(0),
      "playerA_Spielerstapel" -> playerSpielerStapel(0),
      "playerA_Helpstacks" -> playerHelpstacks(0),
      "playerB_Hand" -> playerHand(1),
      "playerB_Spielerstapel" -> playerSpielerStapel(1),
      "playerB_HelpStacks" -> playerHelpstacks(1),
      "ablagestapel" -> ablageStapel(),
      "current_Player" -> currentPlayer(),
      "gamestate" -> gameController.gameState,
      "statusmessage" -> gameController.statusText
    ))
      }
    }
  }
}
