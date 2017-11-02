import { Injectable } from '@angular/core';

import { Tile } from './tile';
import { BOARD_WIDTH, BOARD_HEIGHT, BOARD_LETTERS } from '../board/board.component';

@Injectable()
export class TileBagService {

    constructor() {
        this.initTiles();
    }

    tiles: Tile[];

    pick(): Tile {
        var randomIdx = Math.floor(Math.random() * this.tiles.length);
        var tile = this.tiles.splice(randomIdx, 1)[0];
        return tile;
    }

    isEmpty(): boolean {
        return this.tiles.length === 0;
    }

    initTiles(): void {
        this.tiles = [];
        var id = 1;
        for (var y = 1; y <= BOARD_HEIGHT; y++) {
            for (var x = 1; x <= BOARD_WIDTH; x++) {
                var display = x + BOARD_LETTERS[y - 1];
                this.tiles.push(new Tile(id++, display));
            }
        }
    }

}
