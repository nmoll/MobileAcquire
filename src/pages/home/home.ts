import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AcquireComponent } from '../../app/acquire/acquire.component';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  newGame() {
    this.navCtrl.push(AcquireComponent);
  }

}
