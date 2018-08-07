import { TestBed } from '@angular/core/testing';
import { MoveHandlerService } from './move-handler.service';
import { HotelChainService } from '../hotel-chain/hotel-chain.service';
import { PlayerService } from '../player/player.service';
import { FirstPersonMoveHandler } from './first-person-move-handler';
import { HotelChainServiceMock } from '../hotel-chain/hotel-chain.service.mock';
import { PlayerServiceMock } from '../player/player.service.mock';
import { FirstPersonMoveHandlerMock } from './first-person-move-handler.mock';
import { HotelChain, HotelChainType } from '../hotel-chain/hotel-chain';
import { GameService } from '../game/game.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from 'ionic-angular';
import { ComputerMoveHandler } from './computer-move-handler';
import { ComputerMoveHandlerMock } from './computer-move-handler.mock';
import { GameServiceMock } from '../game/game.service.mock';
import { Player, PlayerType } from '../player/player';

class TranslateServiceMock {}
class AlertControllerMock {}

describe('MoveHandlerService', () => {

    let moveHandlerService: MoveHandlerService;
    let playerService: PlayerService;
    let hotelChainService: HotelChainService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MoveHandlerService, 
                { provide: HotelChainService , useClass: HotelChainServiceMock },
                { provide: PlayerService, useClass: PlayerServiceMock },
                { provide: FirstPersonMoveHandler, useClass: FirstPersonMoveHandlerMock },
                { provide: ComputerMoveHandler, useClass: ComputerMoveHandlerMock },
                { provide: GameService, useClass: GameServiceMock },
                { provide: TranslateService, useClass: TranslateServiceMock },
                { provide: AlertController, useClass: AlertControllerMock }
            ]
        });

        moveHandlerService = TestBed.get(MoveHandlerService);
        playerService = TestBed.get(PlayerService);
        hotelChainService = TestBed.get(HotelChainService);
    });

    describe('rewardMajorityAndMinorityStockholders()', () => {
        
        let hotelChain: HotelChain;
        let playerOne: Player;
        let playerTwo: Player;
        let playerThree: Player;
        let playerFour: Player;
        let majorityBonus: number;
        let minorityBonus: number;

        beforeEach(() => {
            hotelChain = new HotelChain("Luxor", "Lu", HotelChainType.LUXOR);
            playerOne = new Player("Player 1", PlayerType.FIRST_PERSON);
            playerTwo = new Player("Player 2", PlayerType.FIRST_PERSON);
            playerThree = new Player("Player 3", PlayerType.FIRST_PERSON);
            playerFour = new Player("Player 4", PlayerType.FIRST_PERSON);
            
            playerOne.cash = 0;
            playerTwo.cash = 0;
            playerThree.cash = 0;
            playerFour.cash = 0;
            
            majorityBonus = 5000;
            minorityBonus = 1000;

            spyOn(hotelChainService, 'getMergeMajorityBonus').and.returnValue(majorityBonus)
            spyOn(hotelChainService, 'getMergeMinorityBonus').and.returnValue(minorityBonus);
        });

        it('should give majority bonuses to majority and minority stockholders', () => {
            let majorityStockholders = [playerOne];
            let minorityStockholders = [playerFour];
            
            spyOn(playerService, 'getMajorityStockholders').and.returnValue(majorityStockholders);
            spyOn(playerService, 'getMinorityStockholders').and.returnValue(minorityStockholders);
            
            moveHandlerService.rewardMajorityAndMinorityStockholders(hotelChain);
            
            expect(playerOne.cash).toBe(majorityBonus);
            expect(playerTwo.cash).toBe(0);
            expect(playerThree.cash).toBe(0);
            expect(playerFour.cash).toBe(minorityBonus);
        });

        it('should split bonuses to all majority stockholders if multiple majority stockholders', () => {
            let majorityStockholders = [playerOne, playerTwo];
            let minorityStockholders = [playerOne, playerTwo];

            spyOn(playerService, 'getMajorityStockholders').and.returnValue(majorityStockholders);
            spyOn(playerService, 'getMinorityStockholders').and.returnValue(minorityStockholders);

            moveHandlerService.rewardMajorityAndMinorityStockholders(hotelChain);
            
            expect(playerOne.cash).toBe((majorityBonus + minorityBonus) / 2);
            expect(playerTwo.cash).toBe((majorityBonus + minorityBonus) / 2);
            expect(playerThree.cash).toBe(0);
            expect(playerFour.cash).toBe(0);

        });

        it('should give both bonuses to single person if no other players are shareholders', () => {
            let majorityStockholders = [playerOne];
            let minorityStockholders = [playerOne];

            spyOn(playerService, 'getMajorityStockholders').and.returnValue(majorityStockholders);
            spyOn(playerService, 'getMinorityStockholders').and.returnValue(minorityStockholders);

            moveHandlerService.rewardMajorityAndMinorityStockholders(hotelChain);
            
            expect(playerOne.cash).toBe(6000);
            expect(playerTwo.cash).toBe(0);
            expect(playerThree.cash).toBe(0);
            expect(playerFour.cash).toBe(0);

        });
    })

});