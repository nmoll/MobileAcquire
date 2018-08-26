import { PurchaseScenario } from "./purchase-scenario";
import { Player } from "../../../player/player";
import { HotelChain } from "../../../hotel-chain/hotel-chain";
import { StockShareOrder } from "../../../stock-share/stock-share-order";

export class PurchaseScenarioCanAffordStock implements PurchaseScenario {

    calculateValue(player: Player, hotelChain: HotelChain, currentOrder: StockShareOrder): number {
        return this.canAfford(player, hotelChain, currentOrder) ? 0 : -999;
    } 

    private canAfford(player: Player, hotelChain: HotelChain, currentOrder: StockShareOrder): boolean {
        return player.cash - this.totalCostInOrder(currentOrder) >= hotelChain.getStockPrice();
    }

    private totalCostInOrder(order: StockShareOrder): number {
        let result = 0;
        for (let stockShare of order.stockShares) {
            result += stockShare.hotelChain.getStockPrice() * stockShare.quantity;
        }
        return result;
    }

} 