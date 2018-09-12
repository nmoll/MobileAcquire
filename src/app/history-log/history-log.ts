import { Player } from "../player/player";
import { StockShareOrder } from "../stock-share/stock-share-order";
import { Tile } from "../tile/tile";

export class HistoryLog {
    player: Player;
    tile: Tile;
    stockShareOrder: StockShareOrder;

    constructor(player: Player, tile: Tile, stockShareOrder: StockShareOrder) {
        this.player = player;
        this.tile = tile;
        this.stockShareOrder = stockShareOrder;
    }
}