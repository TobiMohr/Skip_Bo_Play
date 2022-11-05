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

  

//---------------------------------------------------------------------------
  def about = Action {
    Ok(skipBoAsText)
  }

  def skipBo = Action {
    Ok(views.html.index())
  }
}
