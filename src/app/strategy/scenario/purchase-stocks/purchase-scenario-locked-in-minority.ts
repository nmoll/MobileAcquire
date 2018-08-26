import { PurchaseScenario } from "./purchase-scenario";
import { Player } from "../../../player/player";
import { HotelChain } from "../../../hotel-chain/hotel-chain";
import { StockShareOrder } from "../../../stock-share/stock-share-order";
import { PlayerService } from "../../../player/player.service";
import { StockShareService } from "../../../stock-share/stock-share.service";

export class PurchaseScenarioLockedInMinority implements PurchaseScenario {

    private playerService: PlayerService;
    private stockShareService: StockShareService;

    constructor(playerService: PlayerService, stockShareService: StockShareService) {
        this.playerService = playerService;
        this.stockShareService = stockShareService;
    }

    calculateValue(player: Player, hotelChain: HotelChain, currentOrder: StockShareOrder): number {
        // If locked in, much less incentive to buy
        return this.isLockedInMinority(player, hotelChain, currentOrder) ? -20 : 0;
    }

    private isLockedInMinority(player: Player, hotelChain: HotelChain, currentOrder: StockShareOrder): boolean {
        return this.playerIsSoleMinorityHolder(player, hotelChain) && 
            !this.canOtherPlayerOvertakeMinority(player, hotelChain, currentOrder) &&
            !this.canCatchMajorityHolder(player, hotelChain, currentOrder);
    }

    private playerIsSoleMinorityHolder(player: Player, hotelChain: HotelChain): boolean {
        let majorityStockholders = this.playerService.getMajorityStockholders(hotelChain);
        let minorityStockholders = this.playerService.getMinorityStockholders(hotelChain);

        return majorityStockholders.length == 1 && 
            majorityStockholders.indexOf(player) < 0 &&
            minorityStockholders.length == 1 &&
            minorityStockholders.indexOf(player) > -1;
    }

    private canOtherPlayerOvertakeMinority(player: Player, hotelChain: HotelChain, currentOrder: StockShareOrder): boolean {
        let majorityHolder = this.getMajorityHolder(hotelChain);
        let numShares = this.getNumSharesOwned(player, hotelChain, currentOrder);
        let availableShares = this.stockShareService.getAvailableStockShares(hotelChain);

        for (let gamePlayer of this.playerService.getPlayers()) {
            if (gamePlayer == player || gamePlayer == majorityHolder) {
                continue;
            }
            let gamePlayerShares = gamePlayer.getStockShareForHotelChain(hotelChain).quantity;
            if (gamePlayerShares + availableShares >= numShares) {
                return true;
            }
        }

        return false;
    }

    private canCatchMajorityHolder(player: Player, hotelChain: HotelChain, currentOrder: StockShareOrder): boolean {
        let majorityHolder = this.getMajorityHolder(hotelChain);
        let majorityHeldShares = majorityHolder.getStockShareForHotelChain(hotelChain).quantity;
        let numShares = this.getNumSharesOwned(player, hotelChain, currentOrder);
        let availableShares = this.stockShareService.getAvailableStockShares(hotelChain);

        return numShares + availableShares >= majorityHeldShares;
    }

    private getMajorityHolder(hotelChain: HotelChain): Player {
        return this.playerService.getMajorityStockholders(hotelChain)[0];
    }

    private getNumSharesOwned(player: Player, hotelChain: HotelChain, currentOrder: StockShareOrder): number { 
        return player.getStockShareForHotelChain(hotelChain).quantity + currentOrder.getStockShareByHotelChain(hotelChain).quantity;
    }
}