import { PurchaseScenario } from "./purchase-scenario";
import { Player } from "../../../player/player";
import { HotelChain } from "../../../hotel-chain/hotel-chain";
import { StockShareOrder } from "../../../stock-share/stock-share-order";
import { PlayerService } from "../../../player/player.service";

export class PurchaseScenarioHaveFourStockMinorityLead implements PurchaseScenario {

    private playerService: PlayerService;

    constructor(playerService: PlayerService) {
        this.playerService = playerService;
    }

    calculateValue(player: Player, hotelChain: HotelChain, currentOrder: StockShareOrder): number {
        return this.hasFourStockMinorityLead(player, hotelChain, currentOrder) ? -3 : 0;
    }

    private hasFourStockMinorityLead(player: Player, hotelChain: HotelChain, currentOrder: StockShareOrder): boolean {
        
        let majorityStockholders = this.playerService.getMajorityStockholders(hotelChain);
        let minorityStockholders = this.playerService.getMinorityStockholders(hotelChain);
        
        // Must be either majority or minority holder
        if (majorityStockholders.indexOf(player) == -1 && minorityStockholders.indexOf(player) == -1) {
            return false;
        }
        
        let numStocks = player.getStockShareForHotelChain(hotelChain).quantity + currentOrder.getStockShareByHotelChain(hotelChain).quantity;

        for (let gamePlayer of this.playerService.getPlayers()) {
            if (gamePlayer == player) {
                continue;
            }
            // ignore majority holder stocks
            if (majorityStockholders.indexOf(gamePlayer) > -1) {
                continue;
            }
            
            let gamePlayerNumStocks = gamePlayer.getStockShareForHotelChain(hotelChain).quantity;
            if (numStocks - gamePlayerNumStocks < 4) {
                return false;
            }
        }

        return true;
    }

}