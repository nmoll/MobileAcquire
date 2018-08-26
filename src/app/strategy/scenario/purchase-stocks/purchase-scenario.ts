import { Player } from "../../../player/player";
import { HotelChain } from "../../../hotel-chain/hotel-chain";
import { StockShareOrder } from "../../../stock-share/stock-share-order";

export interface PurchaseScenario {
    
    calculateValue(player: Player, hotelChain: HotelChain, currentOrder: StockShareOrder): number;

}