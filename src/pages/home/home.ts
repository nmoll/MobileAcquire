import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GameCreateComponent } from '../../app/game/game-create.component';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  newGame() {
    this.navCtrl.push(GameCreateComponent);
  }

}
