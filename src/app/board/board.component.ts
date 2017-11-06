import { Component, OnInit } from '@angular/core';

import { BoardSquare } from './board-square';
import { BoardSquareService } from './board-square.service';

@Component({
    selector: 'board',
    templateUrl: 'board.component.html'
})
export class BoardComponent implements OnInit {

    constructor(
        private boardSquareService: BoardSquareService
    ) {}

    squares: BoardSquare[];

    getBoardSquareClass(square: BoardSquare): string {
        return this.boardSquareService.getBoardSquareClass(square);
    }

    onSquareSelected(square: BoardSquare): void {
        this.boardSquareService.onSquareSelected(square);
    }

    ngOnInit(): void {
        this.squares = this.boardSquareService.getBoardSquares();
    }
}
