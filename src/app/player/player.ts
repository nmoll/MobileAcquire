import { Tile } from '../tile/tile';
import { StockShare } from '../stock-share/stock-share';
import { StockShareOrder } from '../stock-share/stock-share-order';
import { HotelChain } from '../hotel-chain/hotel-chain';

export const PlayerType = {
    FIRST_PERSON: 1,
    COMPUTER: 2
}

export class Player {

    constructor(name: string, playerType: number) {
        this.name = name;
        this.playerType = playerType;
        this.cash = 6000;
        this.tiles = [];
        this.stockShares = [];
    }

    name: string;
    playerType: number;
    cash: number;
    tiles: Tile[];
    stockShares: StockShare[];
    selectedTile: Tile;
    hasPlacedTile: boolean;
    stockShareOrder: StockShareOrder;

    addTile(tile: Tile): void {
        this.tiles.push(tile);
    }

    hasTile(tile: Tile): boolean {
        return this.tiles.includes(tile);
    }

    removeTile(tile: Tile): void {
        var index = this.tiles.indexOf(tile);
        this.tiles.splice(index, 1);
    }

    getStockShareForHotelChain(hotelChain: HotelChain) {
        var stockShare = this.stockShares.filter(stockShare => stockShare.hotelChain === hotelChain)[0];
        if (!stockShare) {
            stockShare = new StockShare(hotelChain);
            this.stockShares.push(stockShare);
        }
        return stockShare;
    }

    addStockShare(stockShare: StockShare) {
        var playerStockShare = this.getStockShareForHotelChain(stockShare.hotelChain);
        playerStockShare.quantity += stockShare.quantity;
    }

    addStockShares(stockShares: StockShare[]): void {
        for (let stockShare of stockShares) {
            this.addStockShare(stockShare);
        }
    }
}
