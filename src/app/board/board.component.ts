import { Component, OnInit } from '@angular/core';

import { AcquireEventService } from '../acquire/acquire-event.service';
import { BoardSquare } from './board-square';
import { BoardSquareService } from './board-square.service';
import { PlayerService } from '../player/player.service';
import { MoveHandlerService } from '../move/move-handler.service';

import { PlayerType } from '../player/player';

@Component({
    selector: 'board',
    templateUrl: 'board.component.html'
})
export class BoardComponent implements OnInit {

    constructor(
        private acquireEventService: AcquireEventService,
        private boardSquareService: BoardSquareService,
        private playerService: PlayerService,
        private moveHandlerService: MoveHandlerService
    ) {}

    squares: BoardSquare[];

    getBoardSquareClass(square: BoardSquare): string {
        var result = '';

        var player = this.playerService.currentPlayer;

        if (square.tile) {
            result += 'hasTile ';
        }

        if (player.selectedTile && player.selectedTile.boardSquareId === square.id) {
            result += 'hasTile ';
        }

        if (this.boardSquareService.isPartOfHotelChain(square)) {
            result += 'hotel-chain-' + square.tile.hotelChain.type;
        }

        if (player.playerType == PlayerType.FIRST_PERSON) {
            if (player.hasTileForBoardSquareId(square.id) && !player.hasPlacedTile) {
                result += 'player-tile ';
                var adjacentTiles = this.boardSquareService.getAdjacentTiles(square);
                if (!this.moveHandlerService.isTilePlayable(adjacentTiles)) {
                    result += 'not-playable ';
                }
            }
        }

        return result;
    }

    onSquareSelected(square: BoardSquare): void {
        var player = this.playerService.currentPlayer;
        if (player.hasPlacedTile || !player.hasTileForBoardSquareId(square.id)) {
            return;
        }

        if (this.isSquarePlayable(square)) {
            var tile = player.getTileBySquareId(square.id);
            this.acquireEventService.notifyTileSelected(tile);
        }
    }

    private isSquarePlayable(square: BoardSquare): boolean {
        var adjacentTiles = this.boardSquareService.getAdjacentTiles(square);
        return this.moveHandlerService.isTilePlayable(adjacentTiles);
    }

    ngOnInit(): void {
        this.squares = this.boardSquareService.getBoardSquares();
    }
}
