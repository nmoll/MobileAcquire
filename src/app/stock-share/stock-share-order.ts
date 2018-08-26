import { StockShare } from './stock-share';
import { HotelChain } from '../hotel-chain/hotel-chain'

export class StockShareOrder {

    stockShares: StockShare[] = [];

    constructor(hotelChains: HotelChain[]) {
        this.init(hotelChains);
    }

    init(hotelChains: HotelChain[]): void {
        this.stockShares = [];
        for (let hotelChain of hotelChains) {
            var stockShare = new StockShare(hotelChain);
            this.stockShares.push(stockShare);
        }
    }

    isFullOrder(): boolean {
        return this.getTotalQuantity() >= 3;
    }

    numAvailableSlotsToPurchase(): number {
        return 3 - this.getTotalQuantity();
    }

    getStockShareByHotelChain(hotelChain: HotelChain): StockShare {
        return this.stockShares.filter((stockShare: StockShare) => stockShare.hotelChain.type == hotelChain.type)[0];
    }

    private getTotalQuantity(): number {
        var result = 0;
        for (let stockShare of this.stockShares) {
            result += stockShare.quantity;
        }
        return result;
    }

}
