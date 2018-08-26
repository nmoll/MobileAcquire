import { PurchaseScenario } from "./purchase-scenario";
import { Player } from "../../../player/player";
import { StockShareOrder } from "../../../stock-share/stock-share-order";
import { HotelChain } from "../../../hotel-chain/hotel-chain";
import { PlayerService } from "../../../player/player.service";

export class PurchaseScenarioSoleMajorityMinorityExists implements PurchaseScenario {

    private playerService: PlayerService;

    constructor(playerService: PlayerService) {
        this.playerService = playerService;
    }

    calculateValue(player: Player, hotelChain: HotelChain, currentOrder: StockShareOrder): number {
        return this.soleMajorityMinorityExists(player, hotelChain, currentOrder) ? 1 : 0;
    }

    soleMajorityMinorityExists(player: Player, hotelChain: HotelChain, currentOrder: StockShareOrder): boolean {
        let majorityStockholders = this.playerService.getMajorityStockholders(hotelChain);
        let minorityStockholders = this.playerService.getMinorityStockholders(hotelChain);

        if (majorityStockholders.indexOf(player) > -1) {
            return false;
        }

        if (this.hasStockInOrder(hotelChain, currentOrder)) {
            return false;
        }

        return majorityStockholders.length == 1 && 
            minorityStockholders.length == 1 &&
            majorityStockholders[0] == minorityStockholders[0];
    }

    private hasStockInOrder(hotelChain: HotelChain, order: StockShareOrder): boolean {
        let stockShare = order.getStockShareByHotelChain(hotelChain);
        return stockShare.quantity > 0;
    }

}