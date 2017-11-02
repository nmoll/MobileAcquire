import { HotelChain } from '../hotel-chain/hotel-chain';

export class StockShare {

    constructor(hotelChain: HotelChain) {
        this.hotelChain = hotelChain;
    }

    hotelChain: HotelChain;
    quantity: number = 0;
}
