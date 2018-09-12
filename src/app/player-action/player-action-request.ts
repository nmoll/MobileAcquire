import { PlayerAction } from "./player-action.enum";

export interface PlayerActionRequest {

    getAction(): PlayerAction;
    getCallback(): Function;

}