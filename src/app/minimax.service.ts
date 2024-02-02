import { Injectable } from '@angular/core';

export interface MiniMaxResult {
  CurrentDepth: number;
  BestMoveIndex: number;
  BestScore: number;
}

@Injectable({
  providedIn: 'root'
})
export class MinimaxService {
  //--------- algo -----------//
  // X always searching for Max
  // O always searching for Min
  do_algo(board: Array<any>,
          player: string,
          isWin: (board: Array<any>) => string | null,
          isDraw: (board: Array<any>) => boolean) : MiniMaxResult {

    // avalible index to click
    const actions = this.getActions(board);
    const nextPlayer = player === "O" ? "X" : "O";

    // check whether any win or draw
    const winner = isWin(board);
    const draw = isDraw(board);
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
    var curDepth = -1;

    // loop for all posibility button to click
    actions.forEach((actionVal) => {
      board[actionVal] = player;
      const res: MiniMaxResult = this.do_algo(board, nextPlayer, isWin, isDraw);
      board[actionVal] = null;

      if (curDepth === -1) {
        curDepth = res.CurrentDepth + 1;
      }

      if (player === "O" && res.BestScore < curBestValue) {
        curBestValue = res.BestScore;
        curBestMoveIndex = actionVal;
      } else if (player === "X" && res.BestScore > curBestValue) {
        curBestValue = res.BestScore;
        curBestMoveIndex = actionVal;
      }
    });
    return {
      CurrentDepth: curDepth,
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
