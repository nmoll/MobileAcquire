import { Tile } from '../tile/tile';
import { HotelChain } from '../hotel-chain/hotel-chain';
import { HotelChainMergeResult } from '../hotel-chain/hotel-chain-merge-result';
import { Player } from '../player/player';

import { HotelChainService } from '../hotel-chain/hotel-chain.service';

export abstract class MoveHandler {

    constructor(private hotelChainService: HotelChainService) {
    }

    abstract getMove(): Promise<Tile>;
    abstract chooseHotelChainToStart(hotelChains: HotelChain[]): Promise<HotelChain>;
    abstract chooseMerge(hotelChains: HotelChain[]): Promise<HotelChainMergeResult>;
    abstract handleMergeStocks(player: Player, mergeResult: HotelChainMergeResult): Promise<Object>;
    abstract buyStocks(): Promise<Object>;
    abstract resolveEndTurn(): Promise<Object>;

    isTilePlayable(adjacentTiles: Tile[]): boolean {
        if (this.isNewChain(adjacentTiles)) {
            if (this.hotelChainService.isAllHotelChainsActive()) {
                return false;
            }
        }
        return true;
    }

    canEndGame(): boolean {
        return this.hotelChainService.isAllHotelChainsSafe() ||
            this.hotelChainService.isAnyHotelChainFullyMatured();
    }

    private isNewChain(adjacentTiles: Tile[]): boolean {
        return adjacentTiles.length > 0 &&
            this.hotelChainService.findAllByTiles(adjacentTiles).length === 0;
    }
}
