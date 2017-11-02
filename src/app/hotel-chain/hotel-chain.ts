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
    tiles: Array<Tile>;

    addTile(tile: Tile): void {
        if (!this.tiles.includes(tile)) {
            this.tiles.push(tile);
            tile.hotelChain = this;
        }
    }
}
