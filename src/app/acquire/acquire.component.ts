import { Component, OnInit } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { AcquireService } from './acquire.service';
import { ScoreboardComponent } from '../scoreboard/scoreboard.component';

@Component({
    selector: 'acquire',
    templateUrl: 'acquire.component.html'//,
    //styleUrls: [ 'acquire.component.css' ]
})
export class AcquireComponent implements OnInit {

    constructor(
      private acquireService: AcquireService,
      private modalCtrl: ModalController
    ) {}

    ngOnInit(): void {
        this.acquireService.initGame();
    }

    showScoreboard(): void {
      var modal = this.modalCtrl.create(ScoreboardComponent);
      modal.present();
    }

}
