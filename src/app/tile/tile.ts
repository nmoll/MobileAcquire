import { HotelChain } from '../hotel-chain/hotel-chain';

export class Tile {

    constructor(boardSquareId: number, display: string) {
        this.boardSquareId = boardSquareId;
        this.display = display;
    }

    boardSquareId: number;
    display: string;
    hotelChain: HotelChain;
}
