import { TestBed } from '@angular/core/testing';
import { PlayerService } from './player.service';
import { Player, PlayerType } from './player';
import { AcquireEventService } from '../acquire/acquire-event.service';
import { AcquireEventServiceMock } from '../acquire/acquire-event.service.mock';
import { GameService } from '../game/game.service';
import { GameServiceMock } from '../game/game.service.mock';
import { TileBagService } from '../tile/tile-bag.service';
import { TileBagServiceMock } from '../tile/tile-bag.service.mock';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from 'ionic-angular';

class TranslateServiceMock {}
class AlertControllerMock {}

describe('PlayerService', () => {

    let playerService: PlayerService;
    let gameService: GameService;

    beforeEach(() => {
        TestBed.configureTestingModule({ 
            providers: [
                PlayerService,
                { provide: AcquireEventService, useClass: AcquireEventServiceMock },
                { provide: GameService, useClass: GameServiceMock },
                { provide: TileBagService, useClass: TileBagServiceMock },
                { provide: TranslateService, useClass: TranslateServiceMock },
                { provide: AlertController, useClass: AlertControllerMock },
            ]
         });
         playerService = TestBed.get(PlayerService);
         gameService = TestBed.get(GameService);
    });

    describe('getNextPlayerInList()', () => {
        it ('should return the next player', () => {
            let player = new Player("Player 1", PlayerType.FIRST_PERSON);
            let expected = new Player("Player 2", PlayerType.COMPUTER);

            spyOn(gameService.currentGame, 'getNextPlayerInList').and.returnValue(expected);
            
            let actual = playerService.getNextPlayerInList(player);
            
            expect(gameService.currentGame.getNextPlayerInList).toHaveBeenCalledWith(player);
            expect(actual.name).toBe("Player 2");
        });
    });
});