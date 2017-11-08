import { Injectable } from '@angular/core';

import { BoardSquare } from './board-square';
import { Tile } from '../tile/tile';
import { PlayerType } from '../player/player';

import { AcquireEventService } from '../acquire/acquire-event.service';

export const BOARD_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
export const BOARD_WIDTH = 12;
export const BOARD_HEIGHT = 9;

@Injectable()
export class BoardSquareService {

    constructor(
        private acquireEventService: AcquireEventService
    ) {
        this.init();
    }

    squares: BoardSquare[];

    getBoardSquares(): BoardSquare[] {
        return this.squares;
    }

    findSquareById(id: number): BoardSquare {
        return this.squares.filter(boardSquare => boardSquare.id === id)[0];
    }

    getSquareByPosition(positionX: number, positionY: number): BoardSquare {
        var result = this.squares.filter(square => square.positionX === positionX && square.positionY === positionY)[0]
        return result || null;
    }

    getAdjacentSquares(square: BoardSquare): BoardSquare[] {
        var result = new Array<BoardSquare>();
        result.push(this.getSquareByPosition(square.positionX - 1, square.positionY));
        result.push(this.getSquareByPosition(square.positionX + 1, square.positionY));
        result.push(this.getSquareByPosition(square.positionX, square.positionY - 1));
        result.push(this.getSquareByPosition(square.positionX, square.positionY + 1));
        return result.filter(square => square != null);
    }

    getAdjacentTiles(square: BoardSquare): Tile[] {
        return this.getAdjacentSquares(square)
            .map(square => square.tile)
            .filter(tile => tile != null);
    }

    isPartOfHotelChain(square: BoardSquare): boolean {
        return !!square.tile && !!square.tile.hotelChain;
    }

    private onTilePlaced(tile: Tile): void {
        var square = this.findSquareById(tile.boardSquareId);
        square.tile = tile;
    }

    private initSquares(): void {
        this.squares = [];
        var id = 1;
        for (var y = 1; y <= BOARD_HEIGHT; y++) {
            for (var x = 1; x <= BOARD_WIDTH; x++) {
                this.squares.push(new BoardSquare(id++, x, y));
            }
        }
    }

    init(): void {
        this.initSquares();
        this.acquireEventService.tilePlacedEvent.subscribe(tile => this.onTilePlaced(tile));
    }

}
