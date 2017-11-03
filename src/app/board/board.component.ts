import { Component, OnInit } from '@angular/core';

import { Tile } from '../tile/tile';
import { BoardSquare } from './board-square';
import { BoardSquareService } from './board-square.service';
import { PlayerService } from '../player/player.service';
import { PlayerType } from '../player/player';
import { AcquireEventService } from '../acquire/acquire-event.service';

export const BOARD_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
export const BOARD_WIDTH = 12;
export const BOARD_HEIGHT = 9;

@Component({
    selector: 'board',
    templateUrl: 'board.component.html'
})
export class BoardComponent implements OnInit {

    constructor(
        private boardSquareService: BoardSquareService,
        private playerService: PlayerService,
        private acquireEventService: AcquireEventService
    ) {}

    squares: BoardSquare[];

    onTilePlaced(tile: Tile): void {
        var square = this.boardSquareService.findSquareById(tile.boardSquareId);
        square.tile = tile;
    }

    isPartOfHotelChain(square: BoardSquare): boolean {
        return !!square.tile && !!square.tile.hotelChain;
    }

    isPlayerTile(square: BoardSquare): boolean {
        var currentPlayer = this.playerService.currentPlayer;
        if (currentPlayer.playerType != PlayerType.FIRST_PERSON) return false;

        for (let tile of currentPlayer.tiles) {
            if (tile.boardSquareId === square.id) {
                return true;
            }
        }
        return false;
    }

    getBoardSquareClass(square: BoardSquare): string {
        var result = '';

        if (square.tile || this.isCurrentSelection(square)) {
            result += 'hasTile ';
        }
        if (this.isPartOfHotelChain(square)) {
            result += 'hotel-chain-' + square.tile.hotelChain.type;
        } else if (this.isPlayerTile(square)) {
            result += 'player-tile';
        }

        return result;
    }

    isCurrentSelection(square: BoardSquare): boolean {
        var selectedTile = this.playerService.currentPlayer.selectedTile;
        return selectedTile && selectedTile.boardSquareId === square.id;
    }

    selectSquare(square: BoardSquare): void {
        if (this.playerService.currentPlayer.hasPlacedTile) {
            return;
        }

        if (this.isPlayerTile(square)) {
            var tile = this.playerService.currentPlayer.tiles.filter(tile => tile.boardSquareId === square.id)[0];
            this.acquireEventService.notifyTileSelected(tile);
        }
    }

    ngOnInit(): void {
        this.squares = this.boardSquareService.getBoardSquares();
        this.acquireEventService.tilePlacedEvent.subscribe(tile => this.onTilePlaced(tile));
        this.acquireEventService.tileSelectedEvent.subscribe((tile) => {
            this.playerService.currentPlayer.selectedTile = tile;
        });
    }
}
