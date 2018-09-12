import { Injectable } from "@angular/core";
import { HistoryLog } from "./history-log";
import { AcquireEventService } from "../acquire/acquire-event.service";
import { PlayerService } from "../player/player.service";

@Injectable()
export class HistoryLogService {

    private historyLogs: HistoryLog[] = [];

    constructor(
        private acquireEventService: AcquireEventService,
        private playerService: PlayerService
    ) {}
    
    init(): void {
        this.acquireEventService.tilePlacedEvent.subscribe((tile) => {
            let player = this.playerService.getCurrentPlayer();
            this.historyLogs.push(new HistoryLog(player, tile, null));
        });

        this.acquireEventService.endTurnEvent.subscribe(() => {
            let player = this.playerService.getCurrentPlayer();
            if (player.stockShareOrder) {
                let currentLog = this.historyLogs[this.historyLogs.length - 1];
                currentLog.stockShareOrder = player.stockShareOrder;
            }
        });
    }

    getLastRound(): HistoryLog[] {
        let result = [];
        
        let players = this.playerService.getPlayers();
        
        if (this.historyLogs.length < players.length) {
            return this.historyLogs;
        }

        for (let i = players.length; i > 0; i--) {
            result.push(this.historyLogs[this.historyLogs.length - i]);
        }
        return result;
    }

}