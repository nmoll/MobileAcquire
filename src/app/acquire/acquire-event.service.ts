import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Tile } from '../tile/tile';

@Injectable()
export class AcquireEventService {

    private tilePlacedSource = new Subject<Tile>();
    private tileSelectedSource = new Subject<Tile>();
    private endTurnSource = new Subject();

    tilePlacedEvent = this.tilePlacedSource.asObservable();
    tileSelectedEvent = this.tileSelectedSource.asObservable();
    endTurnEvent = this.endTurnSource.asObservable();

    notifyTilePlaced(tile: Tile) {
        this.tilePlacedSource.next(tile);
    }

    notifyTileSelected(tile: Tile) {
        this.tileSelectedSource.next(tile);
    }

    notifyEndTurn() {
        this.endTurnSource.next();
    }

}
