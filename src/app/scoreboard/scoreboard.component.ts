import { Component, OnInit } from '@angular/core';

import { HotelChain } from '../hotel-chain/hotel-chain';
import { HotelChainService } from '../hotel-chain/hotel-chain.service';
import { Player } from '../player/player';
import { PlayerService } from '../player/player.service';

@Component({
    //moduleId: module.id,
    selector: 'scoreboard',
    templateUrl: 'scoreboard.component.html'//,
    //styleUrls: ['scoreboard.component.css']
})
export class ScoreboardComponent implements OnInit {

    constructor(
        private hotelChainService: HotelChainService,
        private playerService: PlayerService
    ) {}

    hotelChains: HotelChain[];
    players: Player[];
    collapsed: boolean = true;

    isCurrentPlayer(player: Player): boolean {
        return player === this.playerService.currentPlayer;
    }

    ngOnInit(): void {
        this.hotelChains = this.hotelChainService.getHotelChains();
        this.players = this.playerService.getPlayers();
    }

}
