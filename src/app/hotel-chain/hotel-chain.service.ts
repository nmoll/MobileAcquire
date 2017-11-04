import { Injectable } from '@angular/core';

import { HotelChain, HotelChainType } from './hotel-chain';
import { StockShare } from '../stock-share/stock-share';

@Injectable()
export class HotelChainService {

    constructor() {
        this.init();
    }

    hotelChains: HotelChain[];

    getHotelChain(type: number): HotelChain {
        return this.hotelChains.find(hotelChain => hotelChain.type === type);
    }

    getHotelChains(): HotelChain[] {
        return this.hotelChains;
    }

    getActiveHotelChains(): HotelChain[] {
        return this.getHotelChains().filter(hotelChain => hotelChain.tiles.length > 0)
    }

    getMergeMajorityBonus(hotelChain: HotelChain): number {
        return hotelChain.getStockPrice() * 10;
    }

    getMergeMinorityBonus(hotelChain: HotelChain): number {
        return hotelChain.getStockPrice() * 5;
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
