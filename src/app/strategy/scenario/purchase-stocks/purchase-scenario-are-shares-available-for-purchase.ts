import { PurchaseScenario } from "./purchase-scenario";
import { Player } from "../../../player/player";
import { HotelChain } from "../../../hotel-chain/hotel-chain";
import { StockShareService } from "../../../stock-share/stock-share.service";
import { StockShareOrder } from "../../../stock-share/stock-share-order";

export class PurchaseScenarioAreSharesAvailableForPurchase implements PurchaseScenario {

    private stockShareService: StockShareService;

    constructor(stockShareService: StockShareService) {
        this.stockShareService = stockShareService;
    }

    calculateValue(player: Player, hotelChain: HotelChain, currentOrder: StockShareOrder): number {
        return this.isAvailable(hotelChain, currentOrder) ? 0 : -999;
    }

    private isAvailable(hotelChain: HotelChain, currentOrder: StockShareOrder): boolean {
       return this.stockShareService.getAvailableStockShares(hotelChain) - this.numberOfStocksInOrder(currentOrder, hotelChain) > 0;
    }

    private numberOfStocksInOrder(order: StockShareOrder, hotelChain: HotelChain): number  {
        let result = 0;
        for (let stockShare of order.stockShares) {
            if (stockShare.hotelChain.type == hotelChain.type) {
                result = stockShare.quantity;
                break;
            }
        }
        return result;
    }

}