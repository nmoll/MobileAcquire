import { Player, PlayerType } from "./player";
import { HotelChain, HotelChainType } from '../hotel-chain/hotel-chain';
import { StockShare } from '../stock-share/stock-share';
import { Tile } from '../tile/tile';

describe('Player', () => {

    let player: Player;
    let tile: Tile;
    let boardSquareId: number;
    let hotelChain: HotelChain;

    beforeEach(() => {
        player = new Player('Player 1', PlayerType.FIRST_PERSON);
        boardSquareId = 1;
        tile = new Tile(boardSquareId, 'A1');
        hotelChain = new HotelChain('Luxor', 'Lu', HotelChainType.LUXOR);
    });

    describe('addTile()', () => {      

        it('should add tile to player tiles', () => {
            player.addTile(tile);
            expect(player.tiles).toContain(tile);
        });
    });

    describe('hasTile()', () => {

        it('should be true if player has tile', () => {
            player.addTile(tile);
            expect(player.hasTile(tile)).toBeTruthy();
        });

        it('should be false if player does not have tile', () => {
            player.tiles = [];
            expect(player.hasTile(tile)).toBeFalsy();
        });
    });

    describe('hasTileForBoardSquareId()', () => {

        it('should be true if player has a tile which matches the boardSquareId', () => {
            player.tiles = [new Tile(boardSquareId, 'A1')];
            expect(player.hasTileForBoardSquareId(boardSquareId)).toBeTruthy();
        });

        it('should be false if plyaer does not have tile which matches the boardSquareId', () => {
            player.tiles = [new Tile(2, 'A2')];
            expect(player.hasTileForBoardSquareId(boardSquareId)).toBeFalsy();
        });
    });

    describe('getTileBySquareId', () => {

        it('should return tile with matching boardSquareId', () => {
            let expected = new Tile(boardSquareId, 'A1');
            player.tiles = [expected, new Tile(2, 'A2')];
            expect(player.getTileBySquareId(boardSquareId)).toBe(expected);
        });

    });

    describe('removeTile', () => {
        it('should remove tile from player tiles', () => {
            player.tiles = [tile];
            expect(player.hasTile(tile)).toBeTruthy();
            player.removeTile(tile);
            expect(player.hasTile(tile)).toBeFalsy();
        });
    });

    describe('getStockShareForHotelChain()', () => {
        let stockShare: StockShare;
        
        it('should initialize stock share if none exists', () => {
            stockShare = player.getStockShareForHotelChain(hotelChain);
            expect(player.stockShares.length).toBe(1);
            expect(stockShare.quantity).toBe(0);
            expect(stockShare.hotelChain).toEqual(hotelChain);
        });
        
        it('should return stock share with matching hotel if one exists', () => {
            stockShare = new StockShare(hotelChain);
            player.stockShares.push(stockShare);

            let stockShareFound = player.getStockShareForHotelChain(hotelChain);
            expect(stockShareFound).toBe(stockShare);
        });
    });

    describe('addStockShare()', () => {

        it('should add stock share quantity to existing player quantity', () => {
            expect(player.getStockShareForHotelChain(hotelChain).quantity).toBe(0);
            
            let stockShare: StockShare = new StockShare(hotelChain);
            stockShare.quantity = 1;
            player.addStockShare(stockShare);
            expect(player.getStockShareForHotelChain(hotelChain).quantity).toBe(1);
           
            stockShare = new StockShare(hotelChain);
            stockShare.quantity = 2;
            player.addStockShare(stockShare);
            expect(player.getStockShareForHotelChain(hotelChain).quantity).toBe(3);
        });
    });

    describe('addStockShares()', () => {

        let hotelChainAmerican: HotelChain;
        let hotelChainTower: HotelChain;

        let stockSharesAmerican: StockShare;
        let stockSharesTower: StockShare;

        let stockShareQuantityAmerican: number;
        let stockShareQuantityTower: number;

        beforeEach(() => {
            hotelChainAmerican = new HotelChain('American', 'Am', HotelChainType.AMERICAN);
            hotelChainTower = new HotelChain('Tower', 'To', HotelChainType.TOWER);
            
            stockShareQuantityAmerican = 3;
            stockShareQuantityTower = 5;

            stockSharesAmerican = new StockShare(hotelChainAmerican);
            stockSharesTower = new StockShare(hotelChainTower);

            stockSharesAmerican.quantity = stockShareQuantityAmerican;
            stockSharesTower.quantity = stockShareQuantityTower;
        });

        it('should add all stock shares to player stock shares', () => {
            player.addStockShares([stockSharesAmerican, stockSharesTower]);
            expect(player.getStockShareForHotelChain(hotelChainAmerican).quantity).toBe(stockShareQuantityAmerican);
            expect(player.getStockShareForHotelChain(hotelChainTower).quantity).toBe(stockShareQuantityTower);
        });
    });
});