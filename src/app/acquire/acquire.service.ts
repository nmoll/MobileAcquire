import { Injectable } from '@angular/core';

import { AcquireEventService } from './acquire-event.service';
import { PlayerService } from '../player/player.service';
import { MoveHandlerService } from '../move/move-handler.service';
import { TileBagService } from '../tile/tile-bag.service';
import { BoardSquareService } from '../board/board-square.service';
import { StockShareService } from '../stock-share/stock-share.service';

@Injectable()
export class AcquireService {

    constructor(
        private acquireEventService: AcquireEventService,
        private boardSquareService: BoardSquareService,
        private playerService: PlayerService,
        private moveHandlerService: MoveHandlerService,
        private tileBagService: TileBagService,
        private stockShareService: StockShareService
    ) {}

    grabTiles(): void {
        var players = this.playerService.getPlayers();
        for (let player of players) {
            for (var i = 0; i < 6; i++) {
                player.addTile(this.tileBagService.pick());
            }
        }
    }

    onMoveComplete(): void {
        var subscription = this.acquireEventService.endTurnEvent.subscribe(() => {
            this.playerService.onEndTurn();
            this.stockShareService.resolvePlayerShares();
            this.playerService.rotateCurrentPlayer();
            this.waitForNextMove();
            subscription.unsubscribe();
        });
    }

    waitForNextMove(): void {
        this.moveHandlerService.getMove().then((tile) => {
            var square = this.boardSquareService.findSquareById(tile.boardSquareId);
            var adjacentTiles = this.boardSquareService.getAdjacentTiles(square);
            this.acquireEventService.notifyTilePlaced(tile);
            this.moveHandlerService.handleMove(tile, adjacentTiles).then(data => this.onMoveComplete());
        });
    }

    initGame(): void {
        this.grabTiles();
        this.waitForNextMove();
    }

}
