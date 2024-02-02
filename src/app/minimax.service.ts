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
          isWin: (board: Array<any>) => string | null) : MiniMaxResult {
    const nextPlayer = player === "O" ? "X" : "O";

    // check whether any win or draw
    const winner = isWin(board);
    if (winner === "O") { // O win
      return { BestMoveIndex: -1, BestScore: -1, CurrentDepth: 1 };
    } else if (winner === "X") { // X win
      return { BestMoveIndex: -1, BestScore: 1, CurrentDepth: 1 };
    }

    // avalible index to click
    const actions = this.getActions(board);
    if (actions.length === 0) {
      return { BestMoveIndex: -1, BestScore: 0, CurrentDepth: 1 };
    }

    var curBestScore = player === "O" ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER;
    var curBestMoveIndex = -1;
    // for searching shortest path to win
    var curBestDepth = Number.MAX_SAFE_INTEGER;
    // for record current depth
    var curDepth = -1;


    // loop for all posibility button to click
    actions.forEach((actionVal) => {
      board[actionVal] = player;
      const res: MiniMaxResult = this.do_algo(board, nextPlayer, isWin);
      board[actionVal] = null;

      if (curDepth === -1) {
        curDepth = res.CurrentDepth + 1;
      }

      if (player === "O") {
        if (res.BestScore < curBestScore || (res.BestScore === curBestScore && res.CurrentDepth < curBestDepth)) {
          curBestScore = res.BestScore;
          curBestMoveIndex = actionVal;
          curBestDepth = res.CurrentDepth;
        }
      } else if (player === "X") {
        if (res.BestScore > curBestScore || (res.BestScore === curBestScore && res.CurrentDepth < curBestDepth)) {
          curBestScore = res.BestScore;
          curBestMoveIndex = actionVal;
          curBestDepth = res.CurrentDepth;
        }
      }
    });
    return {
      CurrentDepth: curDepth,
      BestMoveIndex: curBestMoveIndex,
      BestScore: curBestScore,
    };
  }

  getActions(board: Array<any>) {
    var actions = new Array();
    board.forEach((val, idx) => {
      if (val === null) {
        actions.push(idx);
      }
    })
    return actions;
  }
}
