import { PurchaseScenario } from "./purchase-scenario";
import { Player } from "../../../player/player";
import { HotelChain } from "../../../hotel-chain/hotel-chain";
import { StockShareOrder } from "../../../stock-share/stock-share-order";
import { PlayerService } from "../../../player/player.service";
import { StockShareService } from "../../../stock-share/stock-share.service";

export class PurchaseScenarioLockedInMajority implements PurchaseScenario {

    private playerService: PlayerService;
    private stockShareService: StockShareService;

    constructor(playerService: PlayerService, stockShareService: StockShareService) {
        this.playerService = playerService;
        this.stockShareService = stockShareService;
    }

    calculateValue(player: Player, hotelChain: HotelChain, currentOrder: StockShareOrder): number {
        // If locked in, much less incentive to buy
        return this.isLockedInMajority(player, hotelChain, currentOrder) ? -20 : 0;
    }

    private isLockedInMajority(player: Player, hotelChain: HotelChain, currentOrder: StockShareOrder): boolean {
        return this.isSoleMajorityHolder(player, hotelChain) &&
            (this.getNumberOfSharesHeldByPlayer(player, hotelChain, currentOrder) >
                this.getNumberOfSharesByMinority(hotelChain) + this.getNumberOfSharesAvailable(hotelChain));
    }
    
    private isSoleMajorityHolder(player: Player, hotelChain: HotelChain): boolean {
        let majorityStockholders = this.playerService.getMajorityStockholders(hotelChain);
        return majorityStockholders.indexOf(player) > -1 && majorityStockholders.length == 1;
    }
    
    private getNumberOfSharesByMinority (hotelChain: HotelChain):number {
        let minorityStockholders = this.playerService.getMinorityStockholders(hotelChain);
        return minorityStockholders[0].getStockShareForHotelChain(hotelChain).quantity;
    }

    private getNumberOfSharesAvailable(hotelChain: HotelChain): number {
        return this.stockShareService.getAvailableStockShares(hotelChain);
    }

    private getNumberOfSharesHeldByPlayer(player: Player, hotelChain: HotelChain, currentOrder: StockShareOrder): number {
        return player.getStockShareForHotelChain(hotelChain).quantity + currentOrder.getStockShareByHotelChain(hotelChain).quantity;   
    }

}