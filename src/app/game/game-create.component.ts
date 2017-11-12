import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { Game } from './game';
import { Player, PlayerType } from '../player/player';

import { AcquireComponent } from '../acquire/acquire.component';

import { BoardSquareService } from '../board/board-square.service';
import { GameService } from './game.service';
import { PlayerService } from '../player/player.service';
import { TileBagService } from '../tile/tile-bag.service';
import { HotelChainService } from '../hotel-chain/hotel-chain.service';

@Component({
    selector: 'game-create',
    templateUrl: 'game-create.component.html'
})
export class GameCreateComponent implements OnInit  {

    players: Player[];
    playerLabel: string;

    constructor(
        private gameService: GameService,
        private boardSquareService: BoardSquareService,
        private playerService: PlayerService,
        private navCtrl: NavController,
        private translateService: TranslateService,
        private tileBagService: TileBagService,
        private hotelChainService: HotelChainService
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

        let squares = this.boardSquareService.init();
        let tiles = this.tileBagService.initTiles();
        let hotelChains = this.hotelChainService.init();
        let currentPlayer = this.players[0];
        let game = new Game(this.players, currentPlayer, squares, tiles, hotelChains);


        this.gameService.addGame(game);
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
