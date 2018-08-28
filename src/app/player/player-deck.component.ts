import { Component, OnInit } from "@angular/core";
import { PlayerService } from "./player.service";
import { Player } from "./player";

@Component({
    selector: 'player-deck',
    templateUrl: 'player-deck.component.html'
})
export class PlayerDeckComponent implements OnInit {

    players: Player[];

    constructor(private playerService: PlayerService) {}

    ngOnInit(): void {
        this.players = this.playerService.getPlayers();
    }

}