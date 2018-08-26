import { StockShareOrder } from "../stock-share/stock-share-order";
import { Player } from "../player/player";

export interface PlayerStrategy {

    buyStocks(player: Player): StockShareOrder;

}