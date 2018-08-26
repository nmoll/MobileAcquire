import { PurchaseScenario } from "./purchase-scenario";
import { Player } from "../../../player/player";
import { HotelChain } from "../../../hotel-chain/hotel-chain";
import { StockShareOrder } from "../../../stock-share/stock-share-order";
import { PlayerService } from "../../../player/player.service";

export class PurchaseScenarioHaveFourStockMajorityLead implements PurchaseScenario {

    private playerService: PlayerService;

    constructor(playerService: PlayerService) {
        this.playerService = playerService;
    }

    calculateValue(player: Player, hotelChain: HotelChain, currentOrder: StockShareOrder): number {
        return this.hasFourStockMajorityLead(player, hotelChain, currentOrder) ? - 5 : 0;
    }

    private hasFourStockMajorityLead(player: Player, hotelChain: HotelChain, currentOrder: StockShareOrder): boolean {
        
        let numStocks = player.getStockShareForHotelChain(hotelChain).quantity + currentOrder.getStockShareByHotelChain(hotelChain).quantity;

        for (let gamePlayer of this.playerService.getPlayers()) { 
            if (gamePlayer == player) {
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