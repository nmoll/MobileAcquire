import { Injectable } from '@angular/core';

import { HotelChain, HotelChainType } from './hotel-chain';

import { PlayerService } from '../player/player.service';

@Injectable()
export class HotelChainService {

    constructor(private playerService: PlayerService) {
        this.init();
    }

    hotelChains: HotelChain[];
    MAX_STOCK_SHARES: number = 25;

    getHotelChain(type: number): HotelChain {
        return this.hotelChains.find(hotelChain => hotelChain.type === type);
    }

    getHotelChains(): HotelChain[] {
        return this.hotelChains;
    }

    getActiveHotelChains(): HotelChain[] {
        return this.getHotelChains().filter(hotelChain => hotelChain.tiles.length > 0)
    }

    getStockPrice(hotelChain: HotelChain): number {
        var price = 0;
        var size = hotelChain.tiles.length;
        if (size < 6) {
            price = size * 100;
        } else if (size < 11) {
            price = 600;
        } else if (size < 21) {
            price = 700;
        } else if (size < 31) {
            price = 800;
        } else if (size < 41) {
            price = 900;
        } else {
            price = 1000;
        }
        return price + this.getHotelBasePrice(hotelChain);
    }

    getMergeMajorityBonus(hotelChain: HotelChain): number {
        return this.getStockPrice(hotelChain) * 10;
    }

    getMergeMinorityBonus(hotelChain: HotelChain): number {
        return this.getStockPrice(hotelChain) * 5;
    }

    getHotelBasePrice(hotelChain: HotelChain): number {
        var result;
        switch (hotelChain.type) {
            case HotelChainType.WORLDWIDE:
            case HotelChainType.LUXOR:
                result = 0;
                break;
            case HotelChainType.FESTIVAL:
            case HotelChainType.IMPERIAL:
            case HotelChainType.AMERICAN:
                result = 100;
                break;
            case HotelChainType.CONTINENTAL:
            case HotelChainType.TOWER:
                result = 200;
                break;
        }
        return result;
    }

    getAvailableStockShares(hotelChain: HotelChain): number {
        var result = 0;
        for (let player of this.playerService.players) {
            var stockShare = player.getStockShareForHotelChain(hotelChain);
            result += stockShare.quantity;
        }
        return this.MAX_STOCK_SHARES - result;
    }

    init(): void {
        this.hotelChains = [];
        this.hotelChains.push(new HotelChain('Worldwide', 'WOR', HotelChainType.WORLDWIDE));
        this.hotelChains.push(new HotelChain('Luxor', 'LUX', HotelChainType.LUXOR));
        this.hotelChains.push(new HotelChain('Festival', 'FES', HotelChainType.FESTIVAL));
        this.hotelChains.push(new HotelChain('Imperial', 'IMP', HotelChainType.IMPERIAL));
        this.hotelChains.push(new HotelChain('American', 'AME', HotelChainType.AMERICAN));
        this.hotelChains.push(new HotelChain('Continental', 'CON', HotelChainType.CONTINENTAL));
        this.hotelChains.push(new HotelChain('Tower', 'TOW', HotelChainType.TOWER));
    }

}
