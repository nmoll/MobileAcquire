import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Tile } from '../tile/tile';

@Injectable()
export class AcquireEventService {

    private tileSelectedSource = new Subject<Tile>();
    private tilePlacedSource = new Subject<Tile>();
    private endTurnSource = new Subject();

    tileSelectedEvent = this.tileSelectedSource.asObservable();
    tilePlacedEvent = this.tilePlacedSource.asObservable();
    endTurnEvent = this.endTurnSource.asObservable();

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
