import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { Player, PlayerType } from '../player/player';

import { AcquireComponent } from '../acquire/acquire.component';

import { PlayerService } from '../player/player.service';

@Component({
    selector: 'game-create',
    templateUrl: 'game-create.component.html'
})
export class GameCreateComponent implements OnInit  {

    players: Player[];
    playerLabel: string;

    constructor(
        private playerService: PlayerService,
        private navCtrl: NavController,
        private translateService: TranslateService
    ) {}

    addPlayer(playerType: number): void {
        var name = this.playerLabel + ' ' + (this.players.length + 1);
        var type = playerType || PlayerType.COMPUTER;
        this.players.push(new Player(name, type));
    }

    removePlayer(player: Player): void {
        var index = this.players.indexOf(player);
        this.players.splice(index, 1);
    }

    startGame(): void {
        this.playerService.players = this.players;
        this.playerService.currentPlayer = this.players[0];
        this.navCtrl.push(AcquireComponent);
    }

    private initPlayers(): void {
        this.players = [];
        this.addPlayer(PlayerType.FIRST_PERSON);
        this.addPlayer(PlayerType.COMPUTER);
    }

    ngOnInit(): void {
        this.translateService.get('GAME.PLAYER').subscribe((value) => {
            this.playerLabel = value;
            this.initPlayers();
        });
    }

}
