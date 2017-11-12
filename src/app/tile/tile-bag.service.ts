import { Injectable } from '@angular/core';

import { Tile } from './tile';

import { GameService } from '../game/game.service';

export const BOARD_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
export const BOARD_WIDTH = 12;
export const BOARD_HEIGHT = 9;

@Injectable()
export class TileBagService {

    constructor(private gameService: GameService) {}

    pick(): Tile {
        var tiles = this.gameService.currentGame.tiles;
        var randomIdx = Math.floor(Math.random() * tiles.length);
        var tile = tiles.splice(randomIdx, 1)[0];
        return tile;
    }

    isEmpty(): boolean {
        return this.gameService.currentGame.tiles.length === 0;
    }

    initTiles(): Tile[] {
        var tiles = [];
        var id = 1;
        for (var y = 1; y <= BOARD_HEIGHT; y++) {
            for (var x = 1; x <= BOARD_WIDTH; x++) {
                var display = x + BOARD_LETTERS[y - 1];
                tiles.push(new Tile(id++, display));
            }
        }
        return tiles;
    }

}
