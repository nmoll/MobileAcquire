import { Injectable } from '@angular/core';

import { Player } from '../player/player';
import { Tile } from '../tile/tile';
import { HotelChain } from '../hotel-chain/hotel-chain';

import { AcquireEventService } from './acquire-event.service';
import { PlayerService } from '../player/player.service';
import { MoveHandlerService } from '../move/move-handler.service';
import { TileBagService } from '../tile/tile-bag.service';
import { BoardSquareService } from '../board/board-square.service';

@Injectable()
export class AcquireService {

    constructor(
        private acquireEventService: AcquireEventService,
        private boardSquareService: BoardSquareService,
        private playerService: PlayerService,
        private moveHandlerService: MoveHandlerService,
        private tileBagService: TileBagService
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
        this.playerService.rotateCurrentPlayer();
        this.waitForNextMove();
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
