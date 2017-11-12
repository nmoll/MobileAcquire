import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { BoardSquare } from './board-square';
import { Tile } from '../tile/tile';

import { AcquireEventService } from '../acquire/acquire-event.service';
import { GameService } from '../game/game.service';

export const BOARD_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
export const BOARD_WIDTH = 12;
export const BOARD_HEIGHT = 9;

@Injectable()
export class BoardSquareService {

    private tilePlacedEventSubscription: Subscription;

    constructor(
        private acquireEventService: AcquireEventService,
        private gameService: GameService
    ) {
        this.acquireEventService.gameEnteredEvent.subscribe(() => this.onGameEntered());
        this.acquireEventService.gameExitedEvent.subscribe(() => this.onGameExited());
    }

    getBoardSquares(): BoardSquare[] {
        return this.gameService.currentGame.squares;
    }

    findSquareById(id: number): BoardSquare {
        return this.getBoardSquares().filter(boardSquare => boardSquare.id === id)[0];
    }

    getSquareByPosition(positionX: number, positionY: number): BoardSquare {
        var result = this.getBoardSquares().filter(square => square.positionX === positionX && square.positionY === positionY)[0]
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

    init(): BoardSquare[] {
        var squares = [];
        var id = 1;
        for (var y = 1; y <= BOARD_HEIGHT; y++) {
            for (var x = 1; x <= BOARD_WIDTH; x++) {
                squares.push(new BoardSquare(id++, x, y));
            }
        }
        return squares;
    }

    onGameEntered(): void {
        this.tilePlacedEventSubscription = this.acquireEventService.tilePlacedEvent.subscribe(tile => this.onTilePlaced(tile));
    }

    onGameExited(): void {
        this.tilePlacedEventSubscription.unsubscribe();
    }

}
