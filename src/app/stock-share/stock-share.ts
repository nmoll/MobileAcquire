import { HotelChain } from '../hotel-chain/hotel-chain';

export class StockShare {

    static MAX_STOCK_SHARES: number = 25;

    hotelChain: HotelChain;
    quantity: number = 0;

    constructor(hotelChain: HotelChain) {
        this.hotelChain = hotelChain;
    }

    getPrice(): number {
        return this.quantity * this.hotelChain.getStockPrice();
    }
}
