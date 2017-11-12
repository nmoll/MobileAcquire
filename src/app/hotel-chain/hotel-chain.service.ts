import { Injectable } from '@angular/core';

import { GameService } from '../game/game.service';

import { HotelChain, HotelChainType } from './hotel-chain';
import { Tile } from '../tile/tile';

@Injectable()
export class HotelChainService {

    constructor(private gameService: GameService) {}

    getHotelChains(): HotelChain[] {
        return this.gameService.currentGame.hotelChains;
    }

    getHotelChain(type: number): HotelChain {
        return this.getHotelChains().find(hotelChain => hotelChain.type === type);
    }

    getActiveHotelChains(): HotelChain[] {
        return this.getHotelChains().filter(hotelChain => hotelChain.tiles.length > 0);
    }

    isAllHotelChainsActive(): boolean {
        return this.getActiveHotelChains().length == this.getHotelChains().length;
    }

    isAllHotelChainsSafe(): boolean {
        var hotelChains = this.getActiveHotelChains();
        if (hotelChains.length === 0) {
            return false;
        }

        for (let hotelChain of hotelChains) {
            if (hotelChain.tiles.length < 11) {
                return false;
            }
        }
        return true;
    }

    isAnyHotelChainFullyMatured(): boolean {
        var hotelChains = this.getActiveHotelChains();
        for (let hotelChain of hotelChains) {
            if (hotelChain.tiles.length >= 41) {
                return true;
            }
        }
        return false;
    }

    getMergeMajorityBonus(hotelChain: HotelChain): number {
        return hotelChain.getStockPrice() * 10;
    }

    getMergeMinorityBonus(hotelChain: HotelChain): number {
        return hotelChain.getStockPrice() * 5;
    }

    findAllByTiles(tiles: Tile[]) {
        var hotelChains = tiles
            .map(t => t.hotelChain)
            .filter(t => !!t);
        var uniqueSet = new Set(hotelChains);
        return Array.from(uniqueSet);
    }

    init(): HotelChain[] {
        var hotelChains = [];
        hotelChains.push(new HotelChain('Worldwide', 'WOR', HotelChainType.WORLDWIDE));
        hotelChains.push(new HotelChain('Luxor', 'LUX', HotelChainType.LUXOR));
        hotelChains.push(new HotelChain('Festival', 'FES', HotelChainType.FESTIVAL));
        hotelChains.push(new HotelChain('Imperial', 'IMP', HotelChainType.IMPERIAL));
        hotelChains.push(new HotelChain('American', 'AME', HotelChainType.AMERICAN));
        hotelChains.push(new HotelChain('Continental', 'CON', HotelChainType.CONTINENTAL));
        hotelChains.push(new HotelChain('Tower', 'TOW', HotelChainType.TOWER));
        return hotelChains;
    }

}
