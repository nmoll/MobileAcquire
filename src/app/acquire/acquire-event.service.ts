import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Tile } from '../tile/tile';

@Injectable()
export class AcquireEventService {

    private gameEnteredSource = new Subject();
    private gameExitedSource = new Subject();

    private tileSelectedSource = new Subject<Tile>();
    private tilePlacedSource = new Subject<Tile>();
    private endTurnSource = new Subject();

    gameEnteredEvent = this.gameEnteredSource.asObservable();
    gameExitedEvent = this.gameExitedSource.asObservable();

    tileSelectedEvent = this.tileSelectedSource.asObservable();
    tilePlacedEvent = this.tilePlacedSource.asObservable();
    endTurnEvent = this.endTurnSource.asObservable();

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

}
