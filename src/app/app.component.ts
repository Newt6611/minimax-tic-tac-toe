import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SquareComponent } from "./square/square.component";
import { CommonModule } from '@angular/common';

export interface MiniMaxResult {
  CurrentDepth: number;
  BestMoveIndex: number;
  BestScore: number;
}

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

  constructor() {
    this.title = "Tic Tac Toe with minimax algo"
    this.currentPlayer = "O";
    this.draw = false;
    this.board = new Array<any>(BOARD_SIZE).fill(null);
    this.depth = 0;
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
    if (this.winner === null) {
      this.draw = this.isDraw(this.board);
    }

    // if current player is "X", then do minimax algo to get best move
    if (this.winner === null && this.currentPlayer === "X") {
      const bestMove = this.bestMove();
      this.onClick(bestMove as number);
    }
  }

  isWin(board: Array<any>) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    var win = null;
    lines.forEach((line) => {
      const [a, b, c] = line;
      if (board[a] === board[b] && board[b] === board[c] && board[c] === board[a]) {
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

  // When first time call minimax should pass a copied board
  bestMove() {
    const copiedBoard = Array.from(this.board);
    const res = this.minimax(copiedBoard, "X");
    this.depth = res.CurrentDepth;
    return res.BestMoveIndex;
  }

  //--------- algo -----------//
  // X always searching for Max
  // O always searching for Min
  minimax(board: Array<any>, player: string): MiniMaxResult {
    // avalible index to click
    const actions = this.getActions(board);
    const nextPlayer = player === "O" ? "X" : "O";

    // check whether any win or draw
    const winner = this.isWin(board);
    const draw = this.isDraw(board);
    if (winner === null && draw) { // Draw game
      return { BestMoveIndex: -1, BestScore: 0, CurrentDepth: 1 };
    } else if (winner === "O") { // O win
      return { BestMoveIndex: -1, BestScore: -1, CurrentDepth: 1 };
    } else if (winner === "X") { // X win
      return { BestMoveIndex: -1, BestScore: 1, CurrentDepth: 1 };
    }

    var curBestValue = player === "O" ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER;
    var curBestMoveIndex = -1;
    // for searching shortest path to win
    var curBestDepth = Number.MAX_SAFE_INTEGER;
    // for record current depth
    var currentDepth = -1;

    // loop for all posibility button to click
    actions.forEach((actionVal) => {
      board[actionVal] = player;
      const res: MiniMaxResult = this.minimax(board, nextPlayer);
      board[actionVal] = null;

      if (currentDepth === -1) {
        currentDepth = res.CurrentDepth + 1;
      }

      if (player === "O" && res.BestScore <= curBestValue && res.CurrentDepth < curBestDepth) {
        curBestValue = res.BestScore;
        curBestMoveIndex = actionVal;
      } else if (player === "X" && res.BestScore >= curBestValue && res.CurrentDepth < curBestDepth) {
        curBestValue = res.BestScore;
        curBestMoveIndex = actionVal;
      }
    });
    return {
      CurrentDepth: currentDepth,
      BestMoveIndex: curBestMoveIndex,
      BestScore: curBestValue,
    };
  }

  getActions(board: Array<any>) {
    var actions = new Array();
    for (var i = 0; i < board.length; ++i) {
      if (board[i] === null) {
        actions.push(i);
      }
    }
    return actions;
  }
}
