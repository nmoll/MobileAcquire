import { Injectable } from '@angular/core';
import { Game } from './game';

@Injectable()
export class GameService {

    games: Game[] = [];
    currentGame: Game;

    setCurrentGame(game: Game): void {
        this.currentGame = game;
    }

    addGame(game: Game) {
        this.games.push(game);
        this.currentGame = game;
    }

}
