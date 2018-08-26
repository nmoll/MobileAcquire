import { PurchaseScenario } from "./purchase-scenario";
import { Player } from "../../../player/player";
import { HotelChain } from "../../../hotel-chain/hotel-chain";
import { StockShareOrder } from "../../../stock-share/stock-share-order";
import { PlayerService } from "../../../player/player.service";
import { StockShareService } from "../../../stock-share/stock-share.service";

export class PurchaseScenarioCanBeMajorityOwner implements PurchaseScenario {

    private playerService: PlayerService;
    private stockShareService: StockShareService;

    constructor(playerService: PlayerService, stockShareService: StockShareService) {
        this.playerService = playerService;
        this.stockShareService = stockShareService;
    }

    calculateValue(player: Player, hotelChain: HotelChain, currentOrder: StockShareOrder): number {
        return this.canBeMajorityOwner(player, hotelChain, currentOrder) ? 5 : 0;
    }

    private canBeMajorityOwner(player: Player, hotelChain: HotelChain, currentOrder: StockShareOrder): boolean {
        let majorityStocksHeld = this.getMajorityStocksHeld(hotelChain);
        let stocksHeldByPlayer = player.getStockShareForHotelChain(hotelChain).quantity;
        let numAvailableSlotsToPurchase = currentOrder.numAvailableSlotsToPurchase();
        let numSharesAvailable = this.stockShareService.getAvailableStockShares(hotelChain);

        return majorityStocksHeld < stocksHeldByPlayer + Math.min(numAvailableSlotsToPurchase, numSharesAvailable);
    }

    private getMajorityStocksHeld(hotelChain: HotelChain): number {
        let majorityStockholders = this.playerService.getMajorityStockholders(hotelChain);
        return majorityStockholders[0].getStockShareForHotelChain(hotelChain).quantity;
    }

}
