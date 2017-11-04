import { Tile } from '../tile/tile';
import { HotelChain } from '../hotel-chain/hotel-chain';
import { HotelChainMergeResult } from '../hotel-chain/hotel-chain-merge-result';
import { Player } from '../player/player';

export interface MoveHandler {
    getMove(): Promise<Tile>;
    chooseHotelChainToStart(hotelChains: HotelChain[]): Promise<HotelChain>;
    chooseMerge(hotelChains: HotelChain[]): Promise<HotelChainMergeResult>;
    handleMergeStocks(player: Player, mergeResult: HotelChainMergeResult): Promise<Object>;
    buyStocks(): Promise<Object>;
    resolveEndTurn(): Promise<Object>;
}
