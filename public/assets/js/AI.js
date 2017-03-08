/*
COMPUTER AI FUNCTIONS
Minimax Algo
AlphaBetaPrune
*/
const AI = {
    getPossibleMoves: function(player, target_board) {
        var moves = [];
        var move = null;
        var player_pieces = utils.get_player_pieces(player, target_board);
        for(var i = 0; i < player_pieces.length; i++) {
            var from = player_pieces[i];
            var piece_moves = AI.getPieceMoves(target_board, from, player);
            moves.push.apply(moves, piece_moves);
        }
        //prune non-jumps, if applicable
        var jump_moves = [];
        for(var i = 0; i < moves.length; i++) {
            var move = moves[i];
            if(move.move_type == "jump") {
                jump_moves.push(move);
            }
        }
        if(jump_moves.length > 0) {
            moves = jump_moves;
        }
        return moves;
    },
    isMoveLegal: function(cells, pieces, piece, from, to) {
        if((to.col < 0) || (to.row < 0) || (to.col > 7) || (to.row > 7)) {
            //console.log("ILLEGAL MOVE: piece going off board");
            return false;
        }
        var distance = { x: to.col - from.col, y: to.row - from.row };
        if((distance.x == 0) || (distance.y == 0)) {
            //console.log("ILLEGAL MOVE: horizontal or vertical move");
            return false;
        }
        if(utils.abs(distance.x) != utils.abs(distance.y)) {
            //console.log("ILLEGAL MOVE: non-diagonal move");
            return false;
        }
        if(utils.abs(distance.x) > 2) {
            //console.log("ILLEGAL MOVE: more than two diagonals");
            return false;
        }

        if(to.state != empty) {
            //console.log("ILLEGAL MOVE: cell is not empty");
            return false;
        }
        if(utils.abs(distance.x) == 2) {
            var jumpedPiece = utils.getJumpedPiece(cells, pieces, from, to);
            if(jumpedPiece == null) {
                //console.log("ILLEGAL MOVE: no piece to jump");
                return false;
            }
            var pieceState = utils.integ(piece.state);
            var jumpedState = utils.integ(jumpedPiece.state);
            if(pieceState != -jumpedState) {
                //console.log("ILLEGAL MOVE: can't jump own piece");
                return false;
            }
        }
        if((utils.integ(piece.state) === piece.state) && (utils.sign(piece.state) != utils.sign(distance.y))) {
            //console.log("ILLEGAL MOVE: wrong direction");
            return false;
        }

        return true;
    },
    maxValue: function(calc_board, computer_moves, limit, alpha, beta) {
        if(limit <= 0 && !utils.canJump(computer_moves)) {
            return utils.getStats(calc_board);
        }
        var max = -10000;
        if(computer_moves.length > 0) {
            for(var i = 0; i < computer_moves.length; i++) {
                simulated_board = utils.boardSnapShot(calc_board);
                console.log(simulated_board);
                //move computer piece
                var computer_move = computer_moves[i];
                var pieceIndex = utils.getPieceIndex(simulated_board.pieces, computer_move.from.row, computer_move.from.col);
                var piece = simulated_board.pieces[pieceIndex];
                simulated_board = AI.movePiece(simulated_board, piece, computer_move.from, computer_move.to);

                //get available moves for human
                var human_moves = AI.getPossibleMoves(player, simulated_board);

                //get min value for this move
                var min_score = AI.minValue(simulated_board, human_moves, limit - 1, alpha, beta);
                computer_moves[i].score = min_score;

                //compare to min and update, if necessary
                if(min_score > max) {
                    max = min_score;
                }
                if(max >= beta) {
                    break;
                }
                if(max > alpha) {
                    alpha = max;
                }
            }
        }
        return max;
    },
    minValue: function(calc_board, human_moves, limit, alpha, beta) {
        if(limit <= 0 && !utils.canJump(human_moves)) {
            return utils.getStats(calc_board);
        }
        var min = 10000;
        //for each move, get min
        if(human_moves.length > 0) {
            for(var i = 0; i < human_moves.length; i++) {
                simulated_board = utils.boardSnapShot(calc_board);

                //move human piece
                var human_move = human_moves[i];
                var pieceIndex = utils.getPieceIndex(simulated_board.pieces, human_move.from.row, human_move.from.col);
                var piece = simulated_board.pieces[pieceIndex];
                simulated_board = AI.movePiece(simulated_board, piece, human_move.from, human_move.to);

                //get available moves for computer
                var computer_moves = AI.getPossibleMoves(computer, simulated_board);

                //get max value for this move
                var max_score = AI.maxValue(simulated_board, computer_moves, limit - 1, alpha, beta);

                //compare to min and update, if necessary
                if(max_score < min) {
                    min = max_score;
                }
                human_moves[i].score = min;
                if(min <= alpha) {
                    break;
                }
                if(min < beta) {
                    beta = min;
                }
            }
        }
        return min;
    },
    alphaBetaSearch: function(calc_board, limit) {
        var alpha = -10000;
        var beta = 10000;
        //get available moves for computer
        var available_moves = AI.getPossibleMoves(computer, calc_board);
        //get max value for each available move
        var max = AI.maxValue(calc_board, available_moves, limit, alpha, beta);
        //find all moves that have max-value
        var best_moves = [];
        var max_move = null;
        for(var i = 0; i < available_moves.length; i++) {
            var next_move = available_moves[i];
            if(next_move.score == max) {
                max_move = next_move;
                best_moves.push(next_move);
            }
        }
        //randomize selection, if multiple moves have same max-value
        if(best_moves.length > 1) {
            max_move = utils.randomize(best_moves);
        }
        console.log(best_moves)
        return max_move;
    },
    computerMove: function() {
        // Copy board into simulated board
        var simulated_board = utils.boardSnapShot(currentBoard);
        // Run algorithm to select next move
        var selected_move = AI.alphaBetaSearch(simulated_board, levelOfDifficulty);
        // Make computer's move


         if (selected_move){       
        var pieceIndex = utils.getPieceIndex(currentBoard.pieces, selected_move.from.row, selected_move.from.col);
        var piece = currentBoard.pieces[pieceIndex];


        currentBoard = AI.movePiece(currentBoard, piece, selected_move.from, selected_move.to, 1);
        UI.moveCircle(selected_move.to, 1);
        UI.showBoardState();
        var winner = action.overYet(currentBoard);
        if(winner != 0) {
            currentBoard.gameOver = true;
            // console.log("You win!");
        } else {
            // Set turn back to human
            currentBoard.turn = player;
            currentBoard.delay = 0;
        }} 

        else {
            //computer has no valid moves
            currentBoard.gameOver = true; 
            console.log("You win!");
        }
    },
    getPieceMoves: function(target_board, target_piece, player) {
        var moves = [];
        var from = target_piece;

        // check for slides
        var x = [-1, 1];
        x.forEach(function(entry) {
            var cell_index = utils.cellIndex(target_board, from.col + entry, from.row + (player * 1));
            if(cell_index >= 0) {
                var to = target_board.cells[cell_index];
                if(AI.isMoveLegal(target_board.cells, target_board.pieces, from, from, to)) {
                    move = { move_type: 'slide', piece: player, from: { col: from.col, row: from.row }, to: { col: to.col, row: to.row } };
                    moves[moves.length] = move;
                }
            }
        });
        // check for jumps
        x = [-2, 2];
        x.forEach(function(entry) {
            var cell_index = utils.cellIndex(target_board, from.col + entry, from.row + (player * 2));
            if(cell_index >= 0) {
                var to = target_board.cells[cell_index];
                if(AI.isMoveLegal(target_board.cells, target_board.pieces, from, from, to)) {
                    move = { move_type: 'jump', piece: player, from: { col: from.col, row: from.row }, to: { col: to.col, row: to.row } };
                    moves[moves.length] = move;
                }
            }
        });
        // kings
        if(Math.abs(from.state) === 1.1) {
            // check for slides
            var x = [-1, 1];
            var y = [-1, 1];
            x.forEach(function(xmove) {
                y.forEach(function(ymove) {
                    var cell_index = utils.cellIndex(target_board, from.col + xmove, from.row + ymove);
                    if(cell_index >= 0) {
                        var to = target_board.cells[cell_index];
                        if(AI.isMoveLegal(target_board.cells, target_board.pieces, from, from, to)) {
                            move = { move_type: 'slide', piece: player, from: { col: from.col, row: from.row }, to: { col: to.col, row: to.row } };
                            moves[moves.length] = move;
                        }
                    }
                });
            });
            // check for jumps
            x = [-2, 2];
            y = [-2, 2];
            x.forEach(function(xmove) {
                y.forEach(function(ymove) {
                    var cell_index = utils.cellIndex(target_board, from.col + xmove, from.row + ymove);
                    if(cell_index >= 0) {
                        var to = target_board.cells[cell_index];
                        if(AI.isMoveLegal(target_board.cells, target_board.pieces, from, from, to)) {
                            move = { move_type: 'jump', piece: player, from: { col: from.col, row: from.row }, to: { col: to.col, row: to.row } };
                            moves[moves.length] = move;
                        }
                    }
                });
            });
        }
        return moves;
    },
    //move pieces from spot A to spot B;
    movePiece: function(boardState, piece, fromCell, toCell, moveNum) {
        if(boardState.ui) {
            if(AI.movePiece.moves == null) {
                AI.movePiece.moves = [];
            }
            AI.movePiece.moves.push({
                piece: { col: piece.col, row: piece.row, state: piece.state },
                from: { col: fromCell.col, row: fromCell.row },
                to: { col: toCell.col, row: toCell.row }
            });
        }
        // Get jumped piece
        let jumpedPiece = utils.getJumpedPiece(boardState.cells, boardState.pieces, fromCell, toCell);
        // Update states
        var fromIndex = utils.getCellIndex(fromCell.row, fromCell.col);
        var toIndex = utils.getCellIndex(toCell.row, toCell.col);
        if((toCell.row === 0 || toCell.row === 8) && Math.abs(piece.state) === 1) {
            boardState.cells[toIndex].state = piece.state * 1.1;
        } else {
            boardState.cells[toIndex].state = piece.state;
        }
        boardState.cells[fromIndex].state = empty;
        if((toCell.row === 0 || toCell.row === 7) && Math.abs(piece.state) === 1) {
            piece.state = piece.state * 1.1
        }
        piece.col = toCell.col;
        piece.row = toCell.row;
        if(boardState.ui && (boardState.turn === computer || moveNum > 1)) {
            UI.moveCircle(toCell, moveNum);
        }
        if(jumpedPiece != null) {
            var jumpedIndex = utils.getPieceIndex(boardState.pieces, jumpedPiece.row, jumpedPiece.col);
            var originialJumpPieceState = jumpedPiece.state;
            jumpedPiece.state = 0;

            var cellIndex = utils.getCellIndex(jumpedPiece.row, jumpedPiece.col);
            var jumpedCell = boardState.cells[cellIndex];
            jumpedCell.state = empty;
            boardState.pieces[jumpedIndex].lastCol = boardState.pieces[jumpedIndex].col;
            boardState.pieces[jumpedIndex].lastRow = boardState.pieces[jumpedIndex].row;
            boardState.pieces[jumpedIndex].col = -1;
            boardState.pieces[jumpedIndex].row = -1;
            if(boardState.ui) {
                UI.hideCircle(jumpedCell, moveNum);
            }
            if(boardState.ui) {
                AI.movePiece.moves.push({
                    piece: { col: jumpedPiece.col, row: jumpedPiece.row, state: originialJumpPieceState },
                    from: { col: jumpedCell.col, row: jumpedCell.row },
                    to: { col: -1, row: -1 }
                });
            }
            // Another jump?
            var more_moves = AI.getPieceMoves(boardState, piece, boardState.turn);
            var another_move = null;
            for(var i = 0; i < more_moves.length; i++) {
                more_move = more_moves[i];
                if(more_move.move_type === "jump") {
                    another_move = more_move;
                    break;
                }
            }
            if(another_move != null) {
                moveNum += 1;
                boardState = AI.movePiece(boardState, piece, another_move.from, another_move.to, moveNum);
                if(boardState.ui && boardState.turn === player) {
                    boardState.numPlayerMoves += moveNum;
                }
            }
        }
        return boardState;
    },
}