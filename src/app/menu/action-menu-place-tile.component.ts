import { Component } from "@angular/core";
import { GameService } from "../game/game.service";
import { PlayerService } from "../player/player.service";
import { AcquireEventService } from "../acquire/acquire-event.service";
import { BoardSquareService } from "../board/board-square.service";

@Component({
    selector: 'action-menu-place-tile',
    templateUrl: 'action-menu-place-tile.component.html'
})
export class PlayerActionPlaceTileComponent {

    constructor(
        private acquireEventService: AcquireEventService,
        private gameService: GameService,
        private playerService: PlayerService,
        private boardSquareService: BoardSquareService
    ) {}

    isFirstRound(): boolean {
        let tilesPlayed = this.boardSquareService.getNumberOfTilesPlayed();
        let numberOfPlayers = this.playerService.getPlayers().length;
        return tilesPlayed < numberOfPlayers;
    }

    canPlaceTile(): boolean {
        return !this.gameService.isCurrentGameEnded() && 
            !!this.playerService.getCurrentPlayer().selectedTile && 
            !this.playerService.getCurrentPlayer().hasPlacedTile;
    }

    placeTile(): void {
        if (!this.canPlaceTile()) {
            return;
        }
        this.acquireEventService.notifyTilePlaced(this.playerService.getCurrentPlayer().selectedTile);
    }

}