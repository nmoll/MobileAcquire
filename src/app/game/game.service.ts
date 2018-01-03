import { Injectable } from '@angular/core';
import { Game } from './game';
import { Player } from '../player/player';

@Injectable()
export class GameService {

    games: Game[] = [];
    currentGame: Game;

    setCurrentGame(game: Game): void {
        this.currentGame = game;
    }

    isCurrentGameEnded(): boolean {
        return this.currentGame.isEnded();
    }

    endCurrentGame(winners: Player[]): void {
        this.currentGame.endGame(winners);
    }

    addGame(game: Game) {
        this.games.push(game);
        this.currentGame = game;
    }

}
