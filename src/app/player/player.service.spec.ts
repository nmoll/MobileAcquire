import { TestBed } from '@angular/core/testing';
import { PlayerService } from './player.service';
import { Player, PlayerType } from './player';
import { AcquireEventService } from '../acquire/acquire-event.service';
import { AcquireEventServiceMock } from '../acquire/acquire-event.service.mock';
import { GameService } from '../game/game.service';
import { GameServiceMock } from '../game/game.service.mock';
import { TileBagService } from '../tile/tile-bag.service';
import { TileBagServiceMock } from '../tile/tile-bag.service.mock';
import { TranslateService, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AlertController } from 'ionic-angular';
import { StockShare } from '../stock-share/stock-share';
import { HotelChain, HotelChainType } from '../hotel-chain/hotel-chain';
import { Tile } from '../tile/tile';
import { BoardSquare } from '../board/board-square';
import { TranslateLoaderMock } from '../mocks/translate-loader.mock';
import { AlertControllerMock } from '../mocks/alert.controller.mock';

describe('PlayerService', () => {

    let playerService: PlayerService;
    let acquireEventService: AcquireEventService;
    let gameService: GameService;
    let tileBagService: TileBagService;
    let alertCtrl: AlertController;
    
    beforeEach(() => {
        TestBed.configureTestingModule({ 
            providers: [
                PlayerService,
                TranslateService,
                { provide: AcquireEventService, useClass: AcquireEventServiceMock },
                { provide: GameService, useClass: GameServiceMock },
                { provide: TileBagService, useClass: TileBagServiceMock },
                { provide: AlertController, useClass: AlertControllerMock },
            ],
            imports: [
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
                }) 
            ]
         });
         playerService = TestBed.get(PlayerService);
         acquireEventService = TestBed.get(AcquireEventService);
         gameService = TestBed.get(GameService);
         tileBagService = TestBed.get(TileBagService);
         alertCtrl = TestBed.get(AlertController);
    });

    describe('onInit()', () => {

        beforeEach(() => {
            spyOn(acquireEventService.gameEnteredEvent, 'subscribe').and.callFake((callback) => {
                callback();
            });
            spyOn(acquireEventService.gameExitedEvent, 'subscribe').and.callFake((callback) => {
                callback();
            });
            spyOn(playerService, 'onGameEntered');
            spyOn(playerService, 'onGameExited');
            playerService.onInit();
        });

        it('should subscribe to game entered event', () => {
            expect(acquireEventService.gameEnteredEvent.subscribe).toHaveBeenCalled();
        });

        it('should call game entered', () => {
            expect(playerService.onGameEntered).toHaveBeenCalled();
        });

        it('should subscribe to game exited event', () => {
            expect(acquireEventService.gameExitedEvent.subscribe).toHaveBeenCalled();
        });

        it('should call game exited', () => {
            expect(playerService.onGameExited).toHaveBeenCalled();
        });
    });

    describe('getPlayers()', () => {
        
        let players = [];
        
        beforeEach(() => {
            players.push(new Player("First Player", PlayerType.FIRST_PERSON));
            gameService.currentGame.players = players;
        });

        it('should get current game players', () => {
            let actual = playerService.getPlayers();
            expect(actual).toEqual(players);
        });
    });

    describe('getCurrentPlayer()', () => {
        
        let currentPlayer = null;

        beforeEach(() => {
            currentPlayer = new Player("Player 1", PlayerType.FIRST_PERSON);
            gameService.currentGame.currentPlayer = currentPlayer;
        });

        it('should return current game player', () => {
            let actual = playerService.getCurrentPlayer();
            expect(actual).toEqual(currentPlayer);
        });

    });

    describe('rotateCurrentPlayer()', () => {
        let currentPlayer: Player;
        let nextPlayer: Player;

        beforeEach(() => {
            currentPlayer = new Player("Player 1", PlayerType.COMPUTER);
            spyOn(playerService, 'getCurrentPlayer').and.returnValue(currentPlayer);
        });

        describe('if player is FIRST_PERSON and there are multiple FIRST_PERSON players', () => {
            
            let alertCreateArgs: any;

            beforeEach(() => {
                nextPlayer = new Player("Player 2", PlayerType.FIRST_PERSON);
                spyOn(playerService, 'getNextPlayerInList').and.returnValue(nextPlayer);
                spyOn(playerService, 'hasMultipleFirstPlayers').and.returnValue(true);
                spyOn(alertCtrl, 'create').and.callFake((args) => {
                    alertCreateArgs = args;
                    return {
                        present: function () {}
                    }
                });
                gameService.currentGame = jasmine.createSpyObj('currentGame', ['rotateCurrentPlayer']);

                playerService.rotateCurrentPlayer();
            });

            it('should get next player in list of currentPlayer', () => {
                expect(playerService.getNextPlayerInList).toHaveBeenCalledWith(currentPlayer);
            });

            it('should show alert with messages', () => {
                expect(alertCtrl.create).toHaveBeenCalledWith({
                    title: 'MESSAGE.PLAYER_TURN_START',
                    buttons: [
                        {
                            text: 'MESSAGE.PLAYER_TURN_START_BUTTON',
                            handler: jasmine.any(Function)
                        }
                    ]
                });
            });

            it('should rotate current game player', () => {
                alertCreateArgs.buttons[0].handler();
                expect(gameService.currentGame.rotateCurrentPlayer).toHaveBeenCalled();
            });
        });

        describe('if player is not FIRST_PERSON and there are multiple FIRST_PERSON players', () => {

            beforeEach(() => {
                nextPlayer = new Player("Player 2", PlayerType.COMPUTER);
                spyOn(playerService, 'getNextPlayerInList').and.returnValue(nextPlayer);
                spyOn(playerService, 'hasMultipleFirstPlayers').and.returnValue(true);

                gameService.currentGame = jasmine.createSpyObj('currentGame', ['rotateCurrentPlayer']);
                playerService.rotateCurrentPlayer();
            });

            it('should rotate current game player', () => {
                expect(gameService.currentGame.rotateCurrentPlayer).toHaveBeenCalled();
            });
        });

        describe('if player is FIRST_PERSON and there are no other FIRST_PERSON players', () => {

            beforeEach(() => {
                nextPlayer = new Player("Player 2", PlayerType.FIRST_PERSON);
                spyOn(playerService, 'getNextPlayerInList').and.returnValue(nextPlayer);
                spyOn(playerService, 'hasMultipleFirstPlayers').and.returnValue(false);

                gameService.currentGame = jasmine.createSpyObj('currentGame', ['rotateCurrentPlayer']);
                playerService.rotateCurrentPlayer();
            });

            it('should rotate current game player', () => {
                expect(gameService.currentGame.rotateCurrentPlayer).toHaveBeenCalled();
            });
        });

    });

    describe('discardAndDrawTile()', () => {

        let currentPlayer: Player;
        let tile: Tile;
        let newTile: Tile;

        beforeEach(() => {
            currentPlayer = new Player("Player 1", PlayerType.FIRST_PERSON);
            tile = new Tile(1, 'A1');
            currentPlayer.addTile(tile);
            newTile = new Tile(2, 'A2');
            spyOn(tileBagService, 'pick').and.returnValue(newTile);
            spyOn(playerService, 'getCurrentPlayer').and.returnValue(currentPlayer);
        });

        it('should remove tile from current player', () => {
            expect(currentPlayer.hasTile(tile)).toBeTruthy();
            playerService.discardAndDrawNewTile(tile);
            expect(currentPlayer.hasTile(tile)).toBeFalsy();
        });
        
        it('should give player tile from tile bag', () => {
            spyOn(tileBagService, 'isEmpty').and.returnValue(false);
            playerService.discardAndDrawNewTile(tile);
            expect(currentPlayer.hasTile(newTile)).toBeTruthy();
        });

        it('should not give player tile if tile bag is empty', () => {
            spyOn(tileBagService, 'isEmpty').and.returnValue(true);
            playerService.discardAndDrawNewTile(tile);
            expect(currentPlayer.hasTile(newTile)).toBeFalsy();
        });
    });

    describe('isCurrentPlayerTile', () => {

        let boardSquareId: number;
        let square: BoardSquare;
        let currentPlayer: Player;

        beforeEach(() => {
            boardSquareId = 1;
            square = new BoardSquare(boardSquareId, 0, 0);
            currentPlayer = new Player("Player 1", PlayerType.FIRST_PERSON);
            spyOn(playerService, 'getCurrentPlayer').and.returnValue(currentPlayer);
        });

        it('should be false if not FIRST_PERSON player', () => {
            currentPlayer.playerType = PlayerType.COMPUTER;
            expect(playerService.isCurrentPlayerTile(square)).toBeFalsy()
        });

        it('should be true if player has the tile', () => {
            let tile = new Tile(boardSquareId, 'A1');
            currentPlayer.addTile(tile);
            expect(playerService.isCurrentPlayerTile(square)).toBeTruthy();
        });

        it('should be false if player does not have the tile', () => {
            let tile = new Tile(2, 'A2');
            currentPlayer.addTile(tile);
            expect(playerService.isCurrentPlayerTile(square)).toBeFalsy();
        });
    });

    describe('getNextPlayerInList()', () => {

        let player = null;
        let nextPlayer = null;
        let actualResult = null;

        beforeEach(() => {
            player = new Player("Player 1", PlayerType.FIRST_PERSON);
            nextPlayer = new Player("Player 2", PlayerType.COMPUTER);

            spyOn(gameService.currentGame, 'getNextPlayerInList').and.returnValue(nextPlayer);
            
            actualResult = playerService.getNextPlayerInList(player);
        });

        it ('should ask the current game for the next player', () => {
            expect(gameService.currentGame.getNextPlayerInList).toHaveBeenCalledWith(player);
        });

        it('should return the next player', () => {
            expect(actualResult.name).toBe("Player 2");
        });
    });

    describe('getMajorityStockholders()', () => {
        let playerOne: Player;
        let playerTwo: Player;
        let playerThree: Player;
        let playerFour: Player;
        let majorityHolders = [];

        let luxor = null;

        beforeEach(() => {
            playerOne = new Player("Player 1", PlayerType.FIRST_PERSON);
            playerTwo = new Player("Player 2", PlayerType.FIRST_PERSON);
            playerThree = new Player("Player 3", PlayerType.FIRST_PERSON);
            playerFour = new Player("Player 4", PlayerType.FIRST_PERSON);
       
            luxor = new HotelChain("Luxor", "LX", HotelChainType.LUXOR);
        
            let players = [playerOne, playerTwo, playerThree, playerFour];
            gameService.currentGame.players = players; 
        });

        it('should return majority owner for given hotel', () => {
            playerOne.getStockShareForHotelChain(luxor).quantity = 1;
            playerTwo.getStockShareForHotelChain(luxor).quantity = 0;
            playerThree.getStockShareForHotelChain(luxor).quantity = 2;
            playerFour.getStockShareForHotelChain(luxor).quantity = 0;

            majorityHolders = playerService.getMajorityStockholders(luxor);
            expect(majorityHolders.length).toBe(1);
            expect(majorityHolders).toContain(playerThree);
        });

        it('should return all majority owners if there is a tie', () => {
            playerOne.getStockShareForHotelChain(luxor).quantity = 1;
            playerTwo.getStockShareForHotelChain(luxor).quantity = 2;
            playerThree.getStockShareForHotelChain(luxor).quantity = 2;
            playerFour.getStockShareForHotelChain(luxor).quantity = 0;

            majorityHolders = playerService.getMajorityStockholders(luxor);
            expect(majorityHolders.length).toBe(2);
            expect(majorityHolders).toContain(playerTwo);
            expect(majorityHolders).toContain(playerThree);
        });
    });

    describe('getMinorityStockholders()', () => {
        let playerOne: Player;
        let playerTwo: Player;
        let playerThree: Player;
        let playerFour: Player;
        let minorityHolders = [];

        let luxor = null;

        beforeEach(() => {
            playerOne = new Player("Player 1", PlayerType.FIRST_PERSON);
            playerTwo = new Player("Player 2", PlayerType.FIRST_PERSON);
            playerThree = new Player("Player 3", PlayerType.FIRST_PERSON);
            playerFour = new Player("Player 4", PlayerType.FIRST_PERSON);
       
            luxor = new HotelChain("Luxor", "LX", HotelChainType.LUXOR);
        
            let players = [playerOne, playerTwo, playerThree, playerFour];
            gameService.currentGame.players = players; 
        });

        it('should return player with second most stocks if only one majority holder', () => {
            playerOne.getStockShareForHotelChain(luxor).quantity = 1;
            playerTwo.getStockShareForHotelChain(luxor).quantity = 2;
            playerThree.getStockShareForHotelChain(luxor).quantity = 0;
            playerFour.getStockShareForHotelChain(luxor).quantity = 0;

            minorityHolders = playerService.getMinorityStockholders(luxor);
            expect(minorityHolders.length).toBe(1);
            expect(minorityHolders).toContain(playerOne);
        });

        it('should return the majority holders if more than one majority holder', () => {
            playerOne.getStockShareForHotelChain(luxor).quantity = 2;
            playerTwo.getStockShareForHotelChain(luxor).quantity = 2;
            playerThree.getStockShareForHotelChain(luxor).quantity = 1;
            playerFour.getStockShareForHotelChain(luxor).quantity = 0;

            minorityHolders = playerService.getMinorityStockholders(luxor);
            expect(minorityHolders.length).toBe(2);
            expect(minorityHolders).toContain(playerOne);
            expect(minorityHolders).toContain(playerTwo);
        });

        it('should return the majority stockholder if no one else has any stocks', () => {
            playerOne.getStockShareForHotelChain(luxor).quantity = 0;
            playerTwo.getStockShareForHotelChain(luxor).quantity = 0
            playerThree.getStockShareForHotelChain(luxor).quantity = 1;
            playerFour.getStockShareForHotelChain(luxor).quantity = 0;

            minorityHolders = playerService.getMinorityStockholders(luxor);
            expect(minorityHolders.length).toBe(1);
            expect(minorityHolders).toContain(playerThree);
        });
    });

    describe('orderPlayersByStockShare', () => {
        
        let hotelChain: HotelChain;

        beforeEach(() => {
            hotelChain = new HotelChain('Luxor', 'Lu', HotelChainType.LUXOR);
            let players:Player[] = [];
            
            let player = new Player('Player 1', PlayerType.FIRST_PERSON);
            player.getStockShareForHotelChain(hotelChain).quantity = 2;
            players.push(player);

            player = new Player('Player 2', PlayerType.FIRST_PERSON);
            player.getStockShareForHotelChain(hotelChain).quantity = 5;
            players.push(player);

            player = new Player('Player 3', PlayerType.FIRST_PERSON);
            player.getStockShareForHotelChain(hotelChain).quantity = 1;
            players.push(player);

            player = new Player('Player 4', PlayerType.FIRST_PERSON);
            player.getStockShareForHotelChain(hotelChain).quantity = 7;
            players.push(player);

            gameService.currentGame.players = players;
        });
        
        it('should order current game players by number of stocks', () => {
            let players = playerService.orderPlayersByStockShare(hotelChain);
            expect(players[0].name).toEqual('Player 4');
            expect(players[1].name).toEqual('Player 2');
            expect(players[2].name).toEqual('Player 1');
            expect(players[3].name).toEqual('Player 3');
        });
    });

    describe('getPlayersInLead()', () => {
        
        let playerOne: Player;
        let playerTwo: Player;
        let playerThree: Player;
        let playerFour: Player;

        beforeEach(() => {
            playerOne = new Player('Player 1', PlayerType.FIRST_PERSON);
            playerOne.cash = 100;

            playerTwo = new Player('Player 2', PlayerType.FIRST_PERSON);
            playerTwo.cash = 200;

            playerThree = new Player('Player 3', PlayerType.FIRST_PERSON);
            playerThree.cash = 300;

            playerFour = new Player('Player 4', PlayerType.FIRST_PERSON);
            playerFour.cash = 300;
        });
        
        it('should return player with the most cash', () => {
            let players = [playerOne, playerTwo];

            spyOn(playerService, 'getPlayers').and.returnValue(players);
            
            let playersInLead = playerService.getPlayersInLead();
            expect(playersInLead.length).toBe(1);
            expect(playersInLead[0].name).toBe('Player 2');
        });

        it('should return multiple players if tied', () => {
            let players = [playerOne, playerTwo, playerThree, playerFour];

            spyOn(playerService, 'getPlayers').and.returnValue(players);
            
            let playersInLead = playerService.getPlayersInLead();
            expect(playersInLead.length).toBe(2);
            expect(playersInLead[0].name).toBe('Player 3');
            expect(playersInLead[1].name).toBe('Player 4');
        });

        describe('hasMultipleFirstPlayers()', () => {
            it('should be true if there are multiple FIRST_PERSON players', () => {
                let players = [
                    new Player('Player 1', PlayerType.FIRST_PERSON), 
                    new Player('Player 2', PlayerType.FIRST_PERSON),
                    new Player('Player 3', PlayerType.COMPUTER)
                ];
                gameService.currentGame.players = players;
                expect(playerService.hasMultipleFirstPlayers()).toBeTruthy();
            });

            it('should be false if there are not multiple FIRST_PERSON players', () => {
                let players = [
                    new Player('Player 1', PlayerType.FIRST_PERSON), 
                    new Player('Player 2', PlayerType.COMPUTER)
                ];
                gameService.currentGame.players = players;
                expect(playerService.hasMultipleFirstPlayers()).toBeFalsy();

            });
        });
    });

    describe('cashInStocks()', () => {
        
        let player: Player;
        let luxor: HotelChain;
        let american: HotelChain;

        beforeEach(() => {
            player = new Player('Player 1', PlayerType.FIRST_PERSON);
            player.cash = 0;
            player.stockShares = [];
            
            luxor = new HotelChain('American', 'Am', HotelChainType.AMERICAN);
            american = new HotelChain('Luxor', 'Lu', HotelChainType.LUXOR);

            spyOn(luxor, 'getStockPrice').and.returnValue(200);
            spyOn(american, 'getStockPrice').and.returnValue(100);
        });
        
        it('should calculate stock prices and add to player cash', () => {
            let stockShare = new StockShare(luxor);
            stockShare.quantity = 2;
            player.stockShares.push(stockShare);

            stockShare = new StockShare(american);
            stockShare.quantity = 3;
            player.stockShares.push(stockShare);

            playerService.cashInStocks(player);

            expect(player.cash).toBe(700);
        });
    });

    describe('initPlayerTiles()', () => {
        
        let currentPlayer: Player;
        let players: Player[];

        beforeEach(() => {
            currentPlayer = new Player('Player 1', PlayerType.FIRST_PERSON);
            players = [currentPlayer, new Player('Player 2', PlayerType.FIRST_PERSON)];
            gameService.currentGame.currentPlayer = currentPlayer;
            gameService.currentGame.players = players;
            spyOn(tileBagService, 'pick').and.returnValue(new Tile(1, 'A2'));
        });
        
        it('should do nothing if current player has tiles', () => {
            currentPlayer.addTile(new Tile(1, 'A1'));
            playerService.initPlayerTiles();
            expect(currentPlayer.tiles.length).toBe(1);
        });

        it('should add 6 tiles to each player', () => {
            playerService.initPlayerTiles();
            expect(players[0].tiles.length).toBe(6);
            expect(players[1].tiles.length).toBe(6);
        });
    });

    describe('onEndTurn()', () => {
        
        let currentPlayer: Player;
        
        beforeEach(() => {
            currentPlayer = new Player('Player 1', PlayerType.FIRST_PERSON);
            spyOn(playerService, 'getCurrentPlayer').and.returnValue(currentPlayer);
        });

        it('should set current player hasPlacedTile to false', () => {
            currentPlayer.hasPlacedTile = true;
            playerService.onEndTurn();
            expect(currentPlayer.hasPlacedTile).toBeFalsy();
        });

        it('should set current player selectedTile to null', () => {
            currentPlayer.selectedTile = new Tile(1, 'A1');
            playerService.onEndTurn();
            expect(currentPlayer.selectedTile).toBeNull();
        });
    });

    describe('onTileSelected()', () => {

        let currentPlayer: Player;
        let tile: Tile;

        beforeEach(() => {
            currentPlayer = new Player('Player 1', PlayerType.FIRST_PERSON);
            tile = new Tile(1, 'A1');
            spyOn(playerService, 'getCurrentPlayer').and.returnValue(currentPlayer);
        });

        it('should set current player selected tile to given tile', () => {
            playerService.onTileSelected(tile);
            expect(currentPlayer.selectedTile).toBe(tile);
        });
    });

    describe('onGameEntered()', () => {

        let tile: Tile;

        beforeEach(() => {
            tile = new Tile(1, 'A1');
            spyOn(acquireEventService.tileSelectedEvent, 'subscribe').and.callFake((callback) => {
                callback(tile);
                return {};
            });
            spyOn(playerService, 'onTileSelected');
            playerService.onGameEntered();
        });

        it('should initialize tileSelectedEventSubscription', () => {
            expect(playerService.tileSelectedEventSubscription).toBeDefined();
        });

        it('should subscribe to tileSelectedEvent', () => {
            expect(acquireEventService.tileSelectedEvent.subscribe).toHaveBeenCalled();
        });

        it('should call onTileSelected with tile', () => {
            expect(playerService.onTileSelected).toHaveBeenCalledWith(tile);
        });
    });

    describe('onGameExited()', () => {

        beforeEach(() => {
            playerService.tileSelectedEventSubscription = jasmine.createSpyObj('tileSelectedEventDescription', ['unsubscribe']);
            playerService.onGameExited();
        });

        it('should unsubscribe from tile selected event', () => {
            expect(playerService.tileSelectedEventSubscription.unsubscribe).toHaveBeenCalled();
        });

    });
});