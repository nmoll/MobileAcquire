import { HotelChain } from './hotel-chain';

export class HotelChainMergeResult {

    constructor(source: HotelChain, destination: HotelChain) {
        this.source = source;
        this.destination = destination;
    }
    
    source: HotelChain;
    destination: HotelChain;
}
