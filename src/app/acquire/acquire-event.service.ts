import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Tile } from '../tile/tile';
import { PlayerActionRequest } from '../player-action/player-action-request';

@Injectable()
export class AcquireEventService {

    private gameEnteredSource = new Subject();
    private gameExitedSource = new Subject();
    private tileSelectedSource = new Subject<Tile>();
    private tilePlacedSource = new Subject<Tile>();
    private endTurnSource = new Subject();
    private playerChangeSource = new Subject();
    private requestPlayerActionSource = new Subject<PlayerActionRequest>();

    gameEnteredEvent = this.gameEnteredSource.asObservable();
    gameExitedEvent = this.gameExitedSource.asObservable();
    tileSelectedEvent = this.tileSelectedSource.asObservable();
    tilePlacedEvent = this.tilePlacedSource.asObservable();
    endTurnEvent = this.endTurnSource.asObservable();
    playerChangeEvent = this.playerChangeSource.asObservable();
    requestPlayerActionEvent = this.requestPlayerActionSource.asObservable();

    notifyGameEntered(): void {
        this.gameEnteredSource.next();
    }

    notifyGameExited(): void {
        this.gameExitedSource.next();
    }

    notifyTileSelected(tile: Tile) {
        this.tileSelectedSource.next(tile);
    }

    notifyTilePlaced(tile: Tile) {
        this.tilePlacedSource.next(tile);
    }

    notifyEndTurn() {
        this.endTurnSource.next();
    }

    notifyPlayerChange() {
        this.playerChangeSource.next();
    }

    requestPlayerAction(playerActionRequest: PlayerActionRequest) {
        this.requestPlayerActionSource.next(playerActionRequest);
    }

}
