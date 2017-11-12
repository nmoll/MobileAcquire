import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AcquireComponent } from '../../app/acquire/acquire.component';
import { GameCreateComponent } from '../../app/game/game-create.component';

import { Game } from '../../app/game/game';

import { GameService } from '../../app/game/game.service';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {

    games: Game[];

    constructor(
        public navCtrl: NavController,
        public gameService: GameService
    ) {}

    newGame() {
        this.navCtrl.push(GameCreateComponent);
    }

    openGame(game: Game): void {
        this.gameService.setCurrentGame(game);
        this.navCtrl.push(AcquireComponent);
    }

    ngOnInit(): void {
        this.games = this.gameService.games;
    }

}
