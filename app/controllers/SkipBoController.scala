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
    //Ok(views.html.Skip_Bo.board(gameController))
  }

  def hand_Hilfestapel(whichCard: Int, whereCard: Int) =  {
    Console.printf("du hurensohn")
    Console.printf(whichCard.toString, whereCard.toString)
    gameController.pushCardHand(whereCard, whichCard, gameController.playerState.getPlayer, true);
    //Ok(views.html.Skip_Bo.board(gameController))
  }

  def hilfestapel_Ablagestapel(whichCard: Int, whereCard: Int) = {
    gameController.pushCardHelp(whichCard, whereCard, gameController.playerState.getPlayer);
    //Ok(views.html.Skip_Bo.board(gameController))
  }

  def spielerstapel_Ablagestapel(whereCard: Int) = {
    gameController.pushCardPlayer(whereCard, gameController.playerState.getPlayer);
    //Ok(views.html.Skip_Bo.board(gameController))
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

  def currentPlayer() = "Player " + gameController.playerState.name.toString 


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


    def testFunction() = Action {
      Console.printf("Du wichser")
      Ok(skipBoAsText)
    }

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
