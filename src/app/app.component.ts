import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SquareComponent } from "./square/square.component";
import { CommonModule } from '@angular/common';
import { MinimaxService } from './minimax.service';

const BOARD_SIZE: number = 9;

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, SquareComponent, CommonModule]
})
export class AppComponent {
  title: string;
  currentPlayer: string;
  board: Array<any>;
  winner: any;
  draw: boolean;
  depth: number;

  minimaxService: MinimaxService;

  constructor(minimaxService: MinimaxService) {
    this.title = "Tic Tac Toe with minimax algo"
    this.currentPlayer = "O";
    this.draw = false;
    this.board = new Array<any>(BOARD_SIZE).fill(null);
    this.depth = 0;
    this.minimaxService = minimaxService;
  }

  onClick(index: number) {
    if (this.winner != null || this.draw) {
      return;
    }
    if (this.board[index] != null) {
      return;
    }
    this.board[index] = this.currentPlayer;
    // switch to next player
    this.currentPlayer = this.currentPlayer == "O" ? "X" : "O";

    // if no winner, but it might be a draw game
    this.winner = this.isWin(this.board);
    if (this.winner != null) {
      return;
    }
    if (this.winner === null) {
      this.draw = this.isDraw(this.board);
    }

    // if current player is "X", then do minimax algo to get best move
    if (this.winner === null && this.currentPlayer === "X") {
      const bestMove = this.bestMove();
      this.onClick(bestMove as number);
    }
  }

  isWin(board: Array<any>) : string | null {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],

      [0, 4, 8],
      [2, 4, 6],
    ];

    var win = null;
    lines.forEach((line) => {
      const [a, b, c] = line;
      if (board[a] === board[b] && board[a] === board[c]) {
        win = board[a];
      }
    });
    return win;
  }

  isDraw(board: Array<any>): boolean {
    var draw: boolean = true;
    board.forEach((boardVal) => {
      if (boardVal === null) {
        draw = false;
      }
    });
    return draw;
  }

  reset() {
    this.currentPlayer = "O";
    this.board = new Array<any>(BOARD_SIZE).fill(null);
    this.winner = null;
    this.draw = false;
    this.depth = 0;
  }

  // When first time call minimax algo should pass a copied board
  bestMove() {
    var copiedBoard = new Array(BOARD_SIZE).fill(null);
    this.board.forEach((val, idx) => {
      copiedBoard[idx] = val;
    });

    const res = this.minimaxService.do_algo(copiedBoard, "X", this.isWin);
    this.depth = res.CurrentDepth;
    return res.BestMoveIndex;
  }
}
