import { Tile } from '../tile/tile';

export const HotelChainType = {
    WORLDWIDE: 1,
    LUXOR: 2,
    FESTIVAL: 3,
    IMPERIAL: 4,
    AMERICAN: 5,
    CONTINENTAL: 6,
    TOWER: 7
}

export class HotelChain {

    constructor(name: string, abbreviation: string, type: number) {
        this.name = name;
        this.abbreviation = abbreviation;
        this.type = type;
        this.tiles = new Array<Tile>();
    }

    name: string;
    abbreviation: string;
    type: number;
    startPrice: number;
    tiles: Array<Tile>;

    getBasePrice(): number {
        var result;
        switch (this.type) {
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

    getStockPrice(): number {
        var price = 0;
        var size = this.tiles.length;
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
        return price + this.getBasePrice();
    }

    getStartingStockPrice(): number {
        return this.getBasePrice() + 100;
    }

    addTile(tile: Tile): void {
        if (!this.tiles.includes(tile)) {
            this.tiles.push(tile);
            tile.hotelChain = this;
        }
    }
}
