import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Player, PlayerType } from '../player/player';

import { AcquireComponent } from '../acquire/acquire.component';

import { PlayerService } from '../player/player.service';

@Component({
    selector: 'game-create',
    templateUrl: 'game-create.component.html'
})
export class GameCreateComponent implements OnInit  {

    players: Player[];

    constructor(
        private playerService: PlayerService,
        private navCtrl: NavController
    ) {}

    addPlayer(): void {
        var name = 'Player ' + (this.players.length + 1);
        this.players.push(new Player(name, PlayerType.COMPUTER));
    }

    startGame(): void {
        this.playerService.players = this.players;
        this.playerService.currentPlayer = this.players[0];
        this.navCtrl.push(AcquireComponent);
    }

    ngOnInit(): void {
        this.players = [];
        this.players.push(new Player("Player 1", PlayerType.FIRST_PERSON));
        this.players.push(new Player("Player 2", PlayerType.COMPUTER));
    }

}
