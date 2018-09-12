import { PlayerActionRequest } from "./player-action-request";
import { PlayerAction } from "./player-action.enum";
import { Player } from "../player/player";
import { HotelChainMergeResult } from "../hotel-chain/hotel-chain-merge-result";

export class PlayerActionRequestResolveMergeStocks implements PlayerActionRequest {

    private playerAction: PlayerAction;
    private player: Player;
    private mergeResult: HotelChainMergeResult;
    private callback: Function;

    constructor(playerAction: PlayerAction, player: Player, mergeResult: HotelChainMergeResult, callback: Function) {
        this.playerAction = playerAction;
        this.player = player;
        this.mergeResult = mergeResult;
        this.callback = callback;
    }

    getAction(): PlayerAction {
        return this.playerAction;
    }

    getPlayer(): Player {
        return this.player;
    }
    
    getMergeResult(): HotelChainMergeResult {
        return this.mergeResult;
    }
    
    getCallback(): Function {
        return this.callback;
    }

}