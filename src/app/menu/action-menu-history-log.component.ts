import { Component, Output, EventEmitter, OnInit } from "@angular/core";
import { HistoryLog } from "../history-log/history-log";
import { HistoryLogService } from "../history-log/history-log-service";
import { PlayerService } from "../player/player.service";

@Component({
    selector: 'action-menu-history-log',
    templateUrl: 'action-menu-history-log.component.html'
})
export class PlayerActionHistoryLogComponent implements OnInit {

    @Output() onOk: EventEmitter<any> = new EventEmitter();

    historyLogs: HistoryLog[] = [];

    constructor(
        private historyLogService: HistoryLogService,
        private playerService: PlayerService
    ) {}
    
    ok(): void {
        this.onOk.emit();
    }
    
    ngOnInit(): void {
        let currentPlayer = this.playerService.getCurrentPlayer();
        this.historyLogs = this.historyLogService.getLastRound().filter((historyLog) => {
            return historyLog.player != currentPlayer;
        });
    }

}