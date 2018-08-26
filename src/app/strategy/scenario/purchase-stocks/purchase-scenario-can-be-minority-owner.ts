import { PurchaseScenario } from "./purchase-scenario";
import { StockShareOrder } from "../../../stock-share/stock-share-order";
import { HotelChain } from "../../../hotel-chain/hotel-chain";
import { Player } from "../../../player/player";
import { StockShareService } from "../../../stock-share/stock-share.service";
import { PlayerService } from "../../../player/player.service";
import { PurchaseScenarioSoleMajorityMinorityExists } from "./purchase-scenario-sole-majority-minority-exists";

export class PurchaseScenarioCanBeMinorityOwner implements PurchaseScenario {

    private playerService: PlayerService;
    private stockShareService: StockShareService;

    constructor(playerService: PlayerService, stockShareService: StockShareService) {
        this.playerService = playerService;
        this.stockShareService = stockShareService;
    }

    calculateValue(player: Player, hotelChain: HotelChain, currentOrder: StockShareOrder): number {
        return this.canBeMinorityOwner(player, hotelChain, currentOrder) ? 3 : 0;
    }

    private canBeMinorityOwner(player: Player, hotelChain: HotelChain, currentOrder: StockShareOrder): boolean {
        
        if (this.isSoleMajorityMinority(player, hotelChain, currentOrder)) {
            return true;
        }
        
        let minorityStocksHeld = this.getMinorityStocksHeld(hotelChain);
        let stocksHeldByPlayer = player.getStockShareForHotelChain(hotelChain).quantity;
        let numAvailableSlotsToPurchase = currentOrder.numAvailableSlotsToPurchase();
        let numSharesAvailable = this.stockShareService.getAvailableStockShares(hotelChain);

        return minorityStocksHeld < stocksHeldByPlayer + Math.min(numAvailableSlotsToPurchase, numSharesAvailable);
    }

    private getMinorityStocksHeld(hotelChain: HotelChain): number {
        let minorityStockholders = this.playerService.getMinorityStockholders(hotelChain);

        return minorityStockholders[0].getStockShareForHotelChain(hotelChain).quantity;
    }

    private isSoleMajorityMinority(player: Player, hotelChain: HotelChain, currentOrder: StockShareOrder): boolean {
        let scenario = new PurchaseScenarioSoleMajorityMinorityExists(this.playerService);
        return scenario.soleMajorityMinorityExists(player, hotelChain, currentOrder);
    }

}