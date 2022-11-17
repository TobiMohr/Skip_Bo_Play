package controllers

import javax.inject._
import play.api.mvc._
import de.htwg.se.Skip_Bo.Skip_Bo
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
}
