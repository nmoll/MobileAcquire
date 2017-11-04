import { HotelChain } from '../hotel-chain/hotel-chain';

export class StockShare {

    static MAX_STOCK_SHARES: number = 25;

    constructor(hotelChain: HotelChain) {
        this.hotelChain = hotelChain;
    }

    hotelChain: HotelChain;
    quantity: number = 0;
}
