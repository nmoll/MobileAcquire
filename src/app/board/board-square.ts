import { BOARD_LETTERS } from './board.component';

import { Tile } from '../tile/tile';

export class BoardSquare {

    constructor(id: number, positionX: number, positionY: number) {
        this.id = id;
        this.positionX = positionX;
        this.positionY = positionY;
        this.tile = null;
    }

    id: number;
    positionX: number;
    positionY: number;
    tile: Tile;
    
    getDisplay(): string {
        return this.positionX + BOARD_LETTERS[this.positionY - 1];
    }
}
