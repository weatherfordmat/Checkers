/* 
Checker.js => main js file;
Global Variables: Eventually some of these 
will be user preferences; 
*/

var red = 1;
var redKing = 1.1;
var black = -1;
var blackKing = -1.1;
var empty = 0;

const player = red;
const computer = black;

var currentBoard = {};
var cell_width = 0;
var board_origin = 0;
var levelOfDifficulty = 4; 
//3 or 4 is relatively short comp time -> ~ 8 for difficult;
//move pieces from spot A to spot B;
function movePiece(boardState, piece, fromCell, toCell, moveNum) {
    if(boardState.ui) {
        if(movePiece.moves == null) {
            movePiece.moves = [];
        }
        movePiece.moves.push({
            piece: { col: piece.col, row: piece.row, state: piece.state },
            from: { col: fromCell.col, row: fromCell.row },
            to: { col: toCell.col, row: toCell.row }
        });
    }
    // Get jumped piece
    let jumpedPiece = getJumpedPiece(boardState.cells, boardState.pieces, fromCell, toCell);
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
            movePiece.moves.push({
                piece: { col: jumpedPiece.col, row: jumpedPiece.row, state: originialJumpPieceState },
                from: { col: jumpedCell.col, row: jumpedCell.row },
                to: { col: -1, row: -1 }
            });
        }
        // Another jump?
        var more_moves = get_available_piece_moves(boardState, piece, boardState.turn);
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
            boardState = movePiece(boardState, piece, another_move.from, another_move.to, moveNum);
            if(boardState.ui && boardState.turn === player) {
                boardState.numPlayerMoves += moveNum;
            }
        }
    }
    return boardState;
}




function getJumpedPiece(cells, pieces, from, to) {
    var distance = { x: to.col - from.col, y: to.row - from.row };
    if(utils.abs(distance.x) == 2) {
        var jumpRow = from.row + utils.sign(distance.y);
        var jumpCol = from.col + utils.sign(distance.x);
        var index = utils.getPieceIndex(pieces, jumpRow, jumpCol);
        var jumpedPiece = pieces[index];
        return jumpedPiece;
    } else return null;

}

function isMoveLegal(cells, pieces, piece, from, to) {
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
        var jumpedPiece = getJumpedPiece(cells, pieces, from, to);
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
}

function showBoardState() {
    d3.selectAll("text").each(function(d, i) {
        d3.select(this)
            .style("display", "none");
    });

    var cells = currentBoard.cells;
    var pieces = currentBoard.pieces;
    UI.drawText(pieces);
}
/* COMPUTER AI FUNCTIONS */
function get_player_pieces(player, target_board) {
    player_pieces = new Array();
    for(var i = 0; i < target_board.pieces.length; i++) {
        var piece = target_board.pieces[i];
        if(piece.state === player || piece.state === (player + .1) || piece.state === (player - .1)) {
            player_pieces.push(piece);
        }
    }
    return player_pieces;
}
function get_available_piece_moves(target_board, target_piece, player) {
    var moves = [];
    var from = target_piece;

    // check for slides
    var x = [-1, 1];
    x.forEach(function(entry) {
        var cell_index = utils.cellIndex(target_board, from.col + entry, from.row + (player * 1));
        if(cell_index >= 0) {
            var to = target_board.cells[cell_index];
            if(isMoveLegal(target_board.cells, target_board.pieces, from, from, to)) {
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
            if(isMoveLegal(target_board.cells, target_board.pieces, from, from, to)) {
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
                    if(isMoveLegal(target_board.cells, target_board.pieces, from, from, to)) {
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
                    if(isMoveLegal(target_board.cells, target_board.pieces, from, from, to)) {
                        move = { move_type: 'jump', piece: player, from: { col: from.col, row: from.row }, to: { col: to.col, row: to.row } };
                        moves[moves.length] = move;
                    }
                }
            });
        });
    }
    return moves;
}
function get_available_moves(player, target_board) {
    var moves = [];
    var move = null;
    var player_pieces = get_player_pieces(player, target_board);
    for(var i = 0; i < player_pieces.length; i++) {
        var from = player_pieces[i];
        var piece_moves = get_available_piece_moves(target_board, from, player);
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
}
function alpha_beta_search(calc_board, limit) {
    var alpha = -10000;
    var beta = 10000;
    //get available moves for computer
    var available_moves = get_available_moves(computer, calc_board);
    //get max value for each available move
    var max = max_value(calc_board, available_moves, limit, alpha, beta);
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
    return max_move;
}
function computerMove() {
    // Copy board into simulated board
    var simulated_board = utils.boardSnapShot(currentBoard);

    // Run algorithm to select next move
    var selected_move = alpha_beta_search(simulated_board, levelOfDifficulty);
    // Make computer's move
    var pieceIndex = utils.getPieceIndex(currentBoard.pieces, selected_move.from.row, selected_move.from.col);
    var piece = currentBoard.pieces[pieceIndex];
    currentBoard = movePiece(currentBoard, piece, selected_move.from, selected_move.to, 1);
    UI.moveCircle(selected_move.to, 1);
    showBoardState();
    var winner = action.overYet(currentBoard);
    if(winner != 0) {
        currentBoard.gameOver = true;
    } else {
        // Set turn back to human
        currentBoard.turn = player;
        currentBoard.delay = 0;
    }
}
function min_value(calc_board, human_moves, limit, alpha, beta) {
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
            simulated_board = movePiece(simulated_board, piece, human_move.from, human_move.to);

            //get available moves for computer
            var computer_moves = get_available_moves(computer, simulated_board);

            //get max value for this move
            var max_score = max_value(simulated_board, computer_moves, limit - 1, alpha, beta);

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
    } else {
        //log("NO MORE MOVES FOR MIN: l=" + limit);
    }
    return min;
}

function max_value(calc_board, computer_moves, limit, alpha, beta) {
    if(limit <= 0 && !utils.canJump(computer_moves)) {
        return utils.getStats(calc_board);
    }
    var max = -10000;
    if(computer_moves.length > 0) {
        for(var i = 0; i < computer_moves.length; i++) {
            simulated_board = utils.boardSnapShot(calc_board);

            //move computer piece
            var computer_move = computer_moves[i];
            var pieceIndex = utils.getPieceIndex(simulated_board.pieces, computer_move.from.row, computer_move.from.col);
            var piece = simulated_board.pieces[pieceIndex];
            simulated_board = movePiece(simulated_board, piece, computer_move.from, computer_move.to);

            //get available moves for human
            var human_moves = get_available_moves(player, simulated_board);

            //get min value for this move
            var min_score = min_value(simulated_board, human_moves, limit - 1, alpha, beta);
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
}
