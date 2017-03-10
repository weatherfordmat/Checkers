/*
COMPUTER AI FUNCTIONS
Minimax Algo
AlphaBetaPrune
*/
/* 
Global Variables:
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

var levelOfDifficulty = 2;
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
//this file is for broad game actions, e.g. starting, stopping, etc.

var action = {
    //start game;
    startGame: function(origin, cellWidth, boardCanvas) {
        AI.movePiece.moves = [];
        cell_width = cellWidth;
        board_origin = origin;
        currentBoard = UI.drawBoard(origin, cellWidth, boardCanvas);
        currentBoard.ui = true;
        UI.showBoardState();
    },
    initBoard: function() {
        //real board
      let initialBoard = [          
            [empty, red, empty, red, empty, red, empty, red],
            [red, empty, red, empty, red, empty, red, empty],
            [empty, red, empty, red, empty, red, empty, red],
            [empty, empty, empty, empty, empty, empty, empty, empty],
            [empty, empty, empty, empty, empty, empty, empty, empty],
            [black, empty, black, empty, black, empty, black, empty],
            [empty, black, empty, black, empty, black, empty, black],
            [black, empty, black, empty, black, empty, black, empty]
        ];
        //rigged board
        // let initialBoard = [         
        //     [empty, red, empty, red, empty, red, empty, red],
        //     [black, empty, black, empty, black, empty, black, empty],
        //     [empty, black, empty, black, empty, black, empty, black],
        //     [black, empty, black, empty, black, empty, black, empty],
        //     [empty, empty, empty, empty, empty, empty, empty, empty],
        //     [red, empty, red, empty, red, empty, red, empty],
        //     [empty, red, empty, red, empty, red, empty, red],
        //     [empty, empty, empty, empty, empty, empty, empty, empty]
        // ];

        let cells = new Array();
        let pieces = new Array();
        for(var i = 0; i < 8; ++i) {
            var row = initialBoard[i];
            for(var j = 0; j < 8; ++j) {
                let colValue = row[j];
                if(colValue != empty) {
                    let piece = { row: i, col: j, state: colValue };
                    pieces.push(piece);
                }
                let cell = { row: i, col: j, state: colValue };
                cells.push(cell);
            }
        }
        return { cells: cells, pieces: pieces, turn: red};
    },
    //check to see if the game is over;
    overYet: function(boardState) {
        var pieceCount = utils.getPieceCount(boardState);
        if(pieceCount.red > 0 && pieceCount.black === 0) {
            console.log("You win!");
            $('.btnReplay').css('opacity', '1');
            return red;
        } else if(pieceCount.black > 0 && pieceCount.red === 0) {
            console.log("Computer Wins!");
            $('.btnReplay').css('opacity', '1');
            return black;
        } else return 0; //draw;
    },
    quit: function(boardState) {
            console.log("Computer Wins!");
            action.startGame({x: 0, y: 0}, 70, boardCanvas);
    },
    //play again;
    replay: function(origin, cellWidth, boardCanvas) {
        var allMoves = AI.movePiece.moves;
        action.startGame(origin, cellWidth, boardCanvas);
        currentBoard.turn = 0; // can't really play
        for(var i = 0; i < allMoves.length; i++) {
            var moveNum = i + 1;
            var nextMove = allMoves[i];
            if(nextMove.to.row > -1) {
                var cellCoordinates = utils.mapCellToCoordinates(board_origin, cell_width, nextMove.to);
                d3.selectAll("circle").each(function(d, i) {
                    if(d.col === nextMove.from.col && d.row === nextMove.from.row) {
                        d3.select(this)
                            .transition()
                            .delay(500 * moveNum)
                            .attr("cx", d.x = cellCoordinates.x + cell_width / 2)
                            .attr("cy", d.y = cellCoordinates.y + cell_width / 2);

                        d.col = nextMove.to.col;
                        d.row = nextMove.to.row;
                    }
                });
            } else {
                d3.selectAll("circle").each(function(d, i) {
                    if(d.row === nextMove.from.row && d.col === nextMove.from.col) {
                        d3.select(this).transition().delay(500 * moveNum)
                            .style("display", "none");
                        d.col = -1;
                        d.row = -1;
                    }
                });
            }
        }
    },
}

/*
We put the pure-ish & small functions here to clean up our main js file;
*/
const utils = {
    //gets the index for a cell by row and column;
    getCellIndex: function(row, col) {
        var numSquares = 8;
        var index = ((row * numSquares) + col);
        return index;
    },
    //gets coords for a cell;
    mapCellToCoordinates: function(origin, width, cell) {
        var key = "" + cell.row + ":" + cell.col;
        if(!this.mapCellToCoordinates.answers) this.mapCellToCoordinates.answers = {};
        if(this.mapCellToCoordinates.answers[key] != null) {
            return this.mapCellToCoordinates.answers[key];
        }
        var x = origin.x + (cell.col * width);
        var y = origin.y + (cell.row * width);
        return this.mapCellToCoordinates.answers[key] = { x: x, y: y };
    },
    //gets the cell for a pair of coords;
    mapCoordinatesToCell: function(origin, width, cells, x, y) {
        var numSquares = 8;
        var boardLength = numSquares * width;
        if(x > (origin.x + boardLength)) return null;
        if(y > (origin.y + boardLength)) return null;
        var col = Math.ceil((x - origin.x) / width) - 1;
        var row = Math.ceil((y - origin.y) / width) - 1;
        var index = ((row * numSquares) + col);
        var cell = cells[index];
        return cell;
    },
    //rounds numbers or returns null;
    integ: function(num) {
        if(num != null)
            return Math.round(num);
        else
            return null;
    },
    //ges the index of a piece by row & col;
    getPieceIndex: function(pieces, row, col) {
        var index = -1;
        for(var i = 0; i < pieces.length; i++) {
            var piece = pieces[i];
            if(piece.row === row && piece.col === col) {
                index = i;
                break;
            }
        }
        return index;
    },
    //absolute value;
    abs: function(num) {
        return Math.abs(num);
    },
    //returns if negative or not;
    sign: function(num) {
        if(num < 0) return -1;
        else return 1;
    },
    cellIndex: function(target_board, col, row) {
        var index = -1;
        for(var i = 0; i < target_board.cells.length; i++) {
            var cell = target_board.cells[i];
            if(cell.col === col && cell.row === row) {
                index = i;
                break;
            }
        }
        return index;
    },
    lookForBorder: function(x, y) {
        if(x == 0 || x == 7 || y == 0 || y == 7) {
            return 5;
        } else {
            return 3;
        }
    },
    //sometimes, there's just not a best: choose randomly;
    randomize: function(moves) {
        // Randomly select move
        var index = Math.floor(Math.random() * (moves.length - 1));
        var selected_move = moves[index];
        return selected_move;
    },
    //look if a piece can jump;
    canJump: function(available_moves) {
        var jump = false;
        for(var i = 0; i < available_moves.length; i++) {
            var move = available_moves[i];
            if(move.move_type == "jump") {
                jump = true;
                break;
            }
        }
        return jump;
    },
    //takes a snapshot of the current board; 
    boardSnapShot: function(board) {
        var newBoard = {};
        newBoard.ui = false;
        var cells = new Array();
        var pieces = new Array();
        for(var i = 0; i < board.cells.length; i++) {
            var cell = board.cells[i];
            var newCell = { row: cell.row, col: cell.col, state: cell.state };
            cells.push(newCell);
        }
        for(var i = 0; i < board.pieces.length; i++) {
            var piece = board.pieces[i];
            var newPiece = { row: piece.row, col: piece.col, state: piece.state };
            pieces.push(newPiece);
        }
        return { cells: cells, pieces: pieces, turn: board.turn };
    },
    //central to our max_value & min_value functions
    getStats: function(target_board) {
        var sum = 0;
        var computer_pieces = 0;
        var computer_kings = 0;
        var human_pieces = 0;
        var human_kings = 0;
        var computer_pos_sum = 0;
        var human_pos_sum = 0;
        for(var i = 0; i < target_board.pieces.length; i++) {
            var piece = target_board.pieces[i];
            if(piece.row > -1) { // only count pieces still on the board
                if(piece.state > 0) { // human
                    human_pieces += 1;
                    if(piece.state === 1.1) {
                        human_kings += 1;
                    }
                    var human_pos = utils.lookForBorder(piece.col, piece.row);
                    human_pos_sum += human_pos;
                } else { // computer
                    computer_pieces += 1;
                    if(piece.state === -1.1) {
                        computer_kings += 1;
                    }
                    var computer_pos = utils.lookForBorder(piece.col, piece.row);
                    computer_pos_sum += computer_pos;
                }
            }
        }
        var piece_difference = computer_pieces - human_pieces;
        var king_difference = computer_kings - human_kings;
        if(human_pieces === 0) {
            human_pieces = 0.00001;
        }
        var avg_human_pos = human_pos_sum / human_pieces;
        if(computer_pieces === 0) {
            computer_pieces = 0.00001;
        }
        var avg_computer_pos = computer_pos_sum / computer_pieces;
        var avg_pos_diff = avg_computer_pos - avg_human_pos;

        var features = [piece_difference, king_difference, avg_pos_diff];
        var weights = [100, 10, 1];

        var board_utility = 0;

        for(var f = 0; f < features.length; f++) {
            var fw = features[f] * weights[f];
            board_utility += fw;
        }
        return board_utility;
    },
    getPieceCount: function(boardState) {
        var numRed = 0;
        var numBlack = 0;
        var pieces = boardState.pieces;
        for(var i = 0; i < pieces.length; i++) {
            var piece = pieces[i];
            if(piece.col >= 0 && piece.row >= 0) {
                if(piece.state === red || piece.state === redKing) {
                    numRed += 1;
                } else if(piece.state === black || piece.state === blackKing) {
                    numBlack += 1;
                }
            }
        }
        return { red: numRed, black: numBlack };
    },
    getJumpedPiece: function(cells, pieces, from, to) {
        var distance = { x: to.col - from.col, y: to.row - from.row };
        if(utils.abs(distance.x) == 2) {
            var jumpRow = from.row + utils.sign(distance.y);
            var jumpCol = from.col + utils.sign(distance.x);
            var index = utils.getPieceIndex(pieces, jumpRow, jumpCol);
            var jumpedPiece = pieces[index];
            return jumpedPiece;
        } else return null;

    },
    get_player_pieces: function (player, target_board) {
    player_pieces = new Array();
    for(var i = 0; i < target_board.pieces.length; i++) {
        var piece = target_board.pieces[i];
        if(piece.state === player || piece.state === (player + .1) || piece.state === (player - .1)) {
            player_pieces.push(piece);
        }
    }
    return player_pieces;
}

}
/*
The File is Named side Effects, becaues in function programming
of which D3 is a type, changing the UI is a side-effect of pure functions;
Therefore, it's better to have pure functions (in utils.js) and impure functions in sideEffects.js;
*/
let UI = {
    dragged: function(d) {
        if(currentBoard.gameOver) return;
        if(currentBoard.turn != red && currentBoard.turn != redKing) return;
        if(currentBoard.turn != player) return;
        var c = d3.select(this);
        d3.select(this)
            .attr("cx", d.x = d3.event.x)
            .attr("cy", d.y = d3.event.y);
    },
    startDrag: function(d) {
        d3.select(this).classed("dragging", true);
    },
    moveCircle: function(cell, moveNum) {
        var cellCoordinates = utils.mapCellToCoordinates(board_origin, cell_width, cell);
        currentBoard.delay = (moveNum * 500) + 500;
        d3.selectAll("circle").each(function(d, i) {
            if(d.col === cell.col && d.row === cell.row) {
                d3.select(this)
                    .transition()
                    .delay(500 * moveNum)
                    .attr("cx", d.x = cellCoordinates.x + cell_width / 2)
                    .attr("cy", d.y = cellCoordinates.y + cell_width / 2);
            }
        });
    },
    hideCircle: function(cell, moveNum) {
        currentBoard.delay = (moveNum * 400) + 500;
        d3.selectAll("circle").each(function(d, i) {
            if(d.state === 0 && d.lastRow === cell.row && d.lastCol === cell.col) {
                d3.select(this).transition().delay(400 * moveNum)
                    .style("display", "none");
            }
        });
    },
    dragEnded: function(origin, width, node, d) {
        if(currentBoard.turn != red && currentBoard.turn != redKing) return;
        if(currentBoard.turn != player) return;
        var cell = utils.mapCoordinatesToCell(origin, width, currentBoard.cells, d.x, d.y);
        var from = d;
        var to = cell;
        var legal = AI.isMoveLegal(currentBoard.cells, currentBoard.pieces, d, from, to);
        var index = utils.getCellIndex(d.row, d.col);
        var originalCell = currentBoard.cells[index];
        if(!legal) {
            var cellCoordinates = utils.mapCellToCoordinates(origin, width, originalCell);
            node
                .attr("cx", d.x = cellCoordinates.x + width / 2)
                .attr("cy", d.y = cellCoordinates.y + width / 2);
        } else {
            // Update global board state
            currentBoard = AI.movePiece(currentBoard, d, originalCell, cell, 1);

            // Center circle in cell
            var cellCoordinates = utils.mapCellToCoordinates(origin, width, cell);
            node
                .attr("cx", d.x = cellCoordinates.x + width / 2)
                .attr("cy", d.y = cellCoordinates.y + width / 2);
            UI.showBoardState();
            currentBoard.turn = computer;
            // Computer's move
            var delayCallback = function() {
                var winner = action.overYet(currentBoard);
                if(winner != 0) {
                    currentBoard.gameOver = true;
                } else {
                    AI.computerMove(); //why is UI calling state?
                }
                return true;
            };
            var moveDelay = currentBoard.delay;
            setTimeout(delayCallback, moveDelay);
        }
    },
    drawBoard: function(origin, cellWidth, boardCanvas) {
        var boardState = action.initBoard();
        var cells = boardState.cells;
        var pieces = boardState.pieces;

        //Draw cell rects
        boardCanvas.append("g")
            .selectAll("rect")
            .data(cells)

            .enter().append("rect")
            .attr("x", function(d) {
                return utils.mapCellToCoordinates(origin, cellWidth, d).x
            })
            .attr("y", function(d) {
                return utils.mapCellToCoordinates(origin, cellWidth, d).y
            })
            .attr("height", cellWidth)
            .attr("width", cellWidth)
            // .style("fill", "#666666")
            .attr("fill",function(d,i) {
                if (d.row%2==0 && d.col%2==0){
                        return "#7d7d7d"
                    }
                else if(d.row%2!==0 && d.col%2!==0){
                        return "#7d7d7d"
                    }
              else{
                return "black"}
            })
            .style("stroke", "white")
            .style("stroke-width", "1px");

        //Draw pieces
        var dragEndedDimensions = function(d) {
            node = d3.select(this);
            UI.dragEnded(origin, cellWidth, node, d);

        }

        var drag = d3.drag()
            .on("start", UI.startDrag)
            .on("drag", UI.dragged)
            .on("end", dragEndedDimensions)

        boardCanvas.append("g")
            .selectAll("circle")
            .data(pieces)
            .enter().append("circle")
            .attr("r", cellWidth / 2.6)

            .attr("cx", function(d) {
                var x = utils.mapCellToCoordinates(origin, cellWidth, d).x;
                return x + cellWidth / 2;
            })
            .attr("cy", function(d) {
                var y = utils.mapCellToCoordinates(origin, cellWidth, d).y;
                return y + cellWidth / 2;
            })
            .style("fill", function(d) {
                if(d.state === redKing || d.state === blackKing) return "orange";
                else if(d.state === red) return "green";
                else return "#0080FF";
            })

            .style("stroke", "#efefef")
            .style("stroke-width", "2px")
  
            .call(drag);
        return boardState;
    },
    drawText: function(data) {
        boardCanvas.append("g")
            .selectAll("text")
            .data(data)
            .enter().append("text")
            .attr("x", function(d) {
                var x = utils.mapCellToCoordinates(board_origin, cell_width, d).x;
                return x + cell_width / 2;
            })
            .attr("y", function(d) {
                var y = utils.mapCellToCoordinates(board_origin, cell_width, d).y;
                return y + cell_width / 2;
            })
            .style("fill", function(d) {
                if(d.state === red) return "black";
                else return "white";
            })
            .style("stroke-width", function(d) {
                if(d.state === redKing || d.state === blackKing) return "5px"
                else return "";
                // .attr('d', d3.symbol().type(d3.symbolCross).size(5000))
            });
    },
    showBoardState: function() {
        d3.selectAll("text").each(function(d, i) {
            d3.select(this)
                .style("display", "none");
        });
        d3.selectAll("circle").style("fill", function(d) {
                if(d.state === redKing) return "#FF66FF";
                else if (d.state === blackKing) return "#66CCFF";
                else if(d.state === red) return "gold";
                else return "#0080FF";
            });
        var cells = currentBoard.cells;
        var pieces = currentBoard.pieces;
        UI.drawText(pieces);

      d3.selectAll("circle").style("stroke-width", function(d) {
            if(d.state === redKing) return "8px";
            else if (d.state === blackKing) return "8px";
            else if(d.state === red) return "2px";
            else return "2px";
        });

    }
}
var board = {
  "cells": [
    {
      "row": 0,
      "col": 0,
      "state": 0
    },
    {
      "row": 0,
      "col": 1,
      "state": 1
    },
    {
      "row": 0,
      "col": 2,
      "state": 0
    },
    {
      "row": 0,
      "col": 3,
      "state": 1
    },
    {
      "row": 0,
      "col": 4,
      "state": 0
    },
    {
      "row": 0,
      "col": 5,
      "state": 1
    },
    {
      "row": 0,
      "col": 6,
      "state": 0
    },
    {
      "row": 0,
      "col": 7,
      "state": 1
    },
    {
      "row": 1,
      "col": 0,
      "state": 1
    },
    {
      "row": 1,
      "col": 1,
      "state": 0
    },
    {
      "row": 1,
      "col": 2,
      "state": 1
    },
    {
      "row": 1,
      "col": 3,
      "state": 0
    },
    {
      "row": 1,
      "col": 4,
      "state": 1
    },
    {
      "row": 1,
      "col": 5,
      "state": 0
    },
    {
      "row": 1,
      "col": 6,
      "state": 1
    },
    {
      "row": 1,
      "col": 7,
      "state": 0
    },
    {
      "row": 2,
      "col": 0,
      "state": 0
    },
    {
      "row": 2,
      "col": 1,
      "state": 1
    },
    {
      "row": 2,
      "col": 2,
      "state": 0
    },
    {
      "row": 2,
      "col": 3,
      "state": 1
    },
    {
      "row": 2,
      "col": 4,
      "state": 0
    },
    {
      "row": 2,
      "col": 5,
      "state": 0
    },
    {
      "row": 2,
      "col": 6,
      "state": 0
    },
    {
      "row": 2,
      "col": 7,
      "state": 1
    },
    {
      "row": 3,
      "col": 0,
      "state": 0
    },
    {
      "row": 3,
      "col": 1,
      "state": 0
    },
    {
      "row": 3,
      "col": 2,
      "state": 0
    },
    {
      "row": 3,
      "col": 3,
      "state": 0
    },
    {
      "row": 3,
      "col": 4,
      "state": 1
    },
    {
      "row": 3,
      "col": 5,
      "state": 0
    },
    {
      "row": 3,
      "col": 6,
      "state": 0
    },
    {
      "row": 3,
      "col": 7,
      "state": 0
    },
    {
      "row": 4,
      "col": 0,
      "state": 0
    },
    {
      "row": 4,
      "col": 1,
      "state": 0
    },
    {
      "row": 4,
      "col": 2,
      "state": 0
    },
    {
      "row": 4,
      "col": 3,
      "state": 0
    },
    {
      "row": 4,
      "col": 4,
      "state": 0
    },
    {
      "row": 4,
      "col": 5,
      "state": -1
    },
    {
      "row": 4,
      "col": 6,
      "state": 0
    },
    {
      "row": 4,
      "col": 7,
      "state": 0
    },
    {
      "row": 5,
      "col": 0,
      "state": -1
    },
    {
      "row": 5,
      "col": 1,
      "state": 0
    },
    {
      "row": 5,
      "col": 2,
      "state": -1
    },
    {
      "row": 5,
      "col": 3,
      "state": 0
    },
    {
      "row": 5,
      "col": 4,
      "state": -1
    },
    {
      "row": 5,
      "col": 5,
      "state": 0
    },
    {
      "row": 5,
      "col": 6,
      "state": 0
    },
    {
      "row": 5,
      "col": 7,
      "state": 0
    },
    {
      "row": 6,
      "col": 0,
      "state": 0
    },
    {
      "row": 6,
      "col": 1,
      "state": -1
    },
    {
      "row": 6,
      "col": 2,
      "state": 0
    },
    {
      "row": 6,
      "col": 3,
      "state": -1
    },
    {
      "row": 6,
      "col": 4,
      "state": 0
    },
    {
      "row": 6,
      "col": 5,
      "state": -1
    },
    {
      "row": 6,
      "col": 6,
      "state": 0
    },
    {
      "row": 6,
      "col": 7,
      "state": -1
    },
    {
      "row": 7,
      "col": 0,
      "state": -1
    },
    {
      "row": 7,
      "col": 1,
      "state": 0
    },
    {
      "row": 7,
      "col": 2,
      "state": -1
    },
    {
      "row": 7,
      "col": 3,
      "state": 0
    },
    {
      "row": 7,
      "col": 4,
      "state": -1
    },
    {
      "row": 7,
      "col": 5,
      "state": 0
    },
    {
      "row": 7,
      "col": 6,
      "state": -1
    },
    {
      "row": 7,
      "col": 7,
      "state": 0
    }
  ],
  "pieces": [
    {
      "row": 0,
      "col": 1,
      "state": 1
    },
    {
      "row": 0,
      "col": 3,
      "state": 1
    },
    {
      "row": 0,
      "col": 5,
      "state": 1
    },
    {
      "row": 0,
      "col": 7,
      "state": 1
    },
    {
      "row": 1,
      "col": 0,
      "state": 1
    },
    {
      "row": 1,
      "col": 2,
      "state": 1
    },
    {
      "row": 1,
      "col": 4,
      "state": 1
    },
    {
      "row": 1,
      "col": 6,
      "state": 1
    },
    {
      "row": 2,
      "col": 1,
      "state": 1
    },
    {
      "row": 2,
      "col": 3,
      "state": 1
    },
    {
      "row": 3,
      "col": 4,
      "state": 1
    },
    {
      "row": 2,
      "col": 7,
      "state": 1
    },
    {
      "row": 5,
      "col": 0,
      "state": -1
    },
    {
      "row": 5,
      "col": 2,
      "state": -1
    },
    {
      "row": 5,
      "col": 4,
      "state": -1
    },
    {
      "row": 4,
      "col": 5,
      "state": -1
    },
    {
      "row": 6,
      "col": 1,
      "state": -1
    },
    {
      "row": 6,
      "col": 3,
      "state": -1
    },
    {
      "row": 6,
      "col": 5,
      "state": -1
    },
    {
      "row": 6,
      "col": 7,
      "state": -1
    },
    {
      "row": 7,
      "col": 0,
      "state": -1
    },
    {
      "row": 7,
      "col": 2,
      "state": -1
    },
    {
      "row": 7,
      "col": 4,
      "state": -1
    },
    {
      "row": 7,
      "col": 6,
      "state": -1
    }
  ],
  "turn": -1
}
var secondBoard = {
  "cells": [
    {
      "row": 0,
      "col": 0,
      "state": 0
    },
    {
      "row": 0,
      "col": 1,
      "state": 1
    },
    {
      "row": 0,
      "col": 2,
      "state": 0
    },
    {
      "row": 0,
      "col": 3,
      "state": 1
    },
    {
      "row": 0,
      "col": 4,
      "state": 0
    },
    {
      "row": 0,
      "col": 5,
      "state": 1
    },
    {
      "row": 0,
      "col": 6,
      "state": 0
    },
    {
      "row": 0,
      "col": 7,
      "state": 1
    },
    {
      "row": 1,
      "col": 0,
      "state": 1
    },
    {
      "row": 1,
      "col": 1,
      "state": 0
    },
    {
      "row": 1,
      "col": 2,
      "state": 1
    },
    {
      "row": 1,
      "col": 3,
      "state": 0
    },
    {
      "row": 1,
      "col": 4,
      "state": 1
    },
    {
      "row": 1,
      "col": 5,
      "state": 0
    },
    {
      "row": 1,
      "col": 6,
      "state": 1
    },
    {
      "row": 1,
      "col": 7,
      "state": 0
    },
    {
      "row": 2,
      "col": 0,
      "state": 0
    },
    {
      "row": 2,
      "col": 1,
      "state": 0
    },
    {
      "row": 2,
      "col": 2,
      "state": 0
    },
    {
      "row": 2,
      "col": 3,
      "state": 1
    },
    {
      "row": 2,
      "col": 4,
      "state": 0
    },
    {
      "row": 2,
      "col": 5,
      "state": 1
    },
    {
      "row": 2,
      "col": 6,
      "state": 0
    },
    {
      "row": 2,
      "col": 7,
      "state": 1
    },
    {
      "row": 3,
      "col": 0,
      "state": 0
    },
    {
      "row": 3,
      "col": 1,
      "state": 0
    },
    {
      "row": 3,
      "col": 2,
      "state": 1
    },
    {
      "row": 3,
      "col": 3,
      "state": 0
    },
    {
      "row": 3,
      "col": 4,
      "state": 0
    },
    {
      "row": 3,
      "col": 5,
      "state": 0
    },
    {
      "row": 3,
      "col": 6,
      "state": 0
    },
    {
      "row": 3,
      "col": 7,
      "state": 0
    },
    {
      "row": 4,
      "col": 0,
      "state": 0
    },
    {
      "row": 4,
      "col": 1,
      "state": 0
    },
    {
      "row": 4,
      "col": 2,
      "state": 0
    },
    {
      "row": 4,
      "col": 3,
      "state": 0
    },
    {
      "row": 4,
      "col": 4,
      "state": 0
    },
    {
      "row": 4,
      "col": 5,
      "state": -1
    },
    {
      "row": 4,
      "col": 6,
      "state": 0
    },
    {
      "row": 4,
      "col": 7,
      "state": 0
    },
    {
      "row": 5,
      "col": 0,
      "state": -1
    },
    {
      "row": 5,
      "col": 1,
      "state": 0
    },
    {
      "row": 5,
      "col": 2,
      "state": -1
    },
    {
      "row": 5,
      "col": 3,
      "state": 0
    },
    {
      "row": 5,
      "col": 4,
      "state": 0
    },
    {
      "row": 5,
      "col": 5,
      "state": 0
    },
    {
      "row": 5,
      "col": 6,
      "state": -1
    },
    {
      "row": 5,
      "col": 7,
      "state": 0
    },
    {
      "row": 6,
      "col": 0,
      "state": 0
    },
    {
      "row": 6,
      "col": 1,
      "state": -1
    },
    {
      "row": 6,
      "col": 2,
      "state": 0
    },
    {
      "row": 6,
      "col": 3,
      "state": -1
    },
    {
      "row": 6,
      "col": 4,
      "state": 0
    },
    {
      "row": 6,
      "col": 5,
      "state": -1
    },
    {
      "row": 6,
      "col": 6,
      "state": 0
    },
    {
      "row": 6,
      "col": 7,
      "state": -1
    },
    {
      "row": 7,
      "col": 0,
      "state": -1
    },
    {
      "row": 7,
      "col": 1,
      "state": 0
    },
    {
      "row": 7,
      "col": 2,
      "state": -1
    },
    {
      "row": 7,
      "col": 3,
      "state": 0
    },
    {
      "row": 7,
      "col": 4,
      "state": -1
    },
    {
      "row": 7,
      "col": 5,
      "state": 0
    },
    {
      "row": 7,
      "col": 6,
      "state": -1
    },
    {
      "row": 7,
      "col": 7,
      "state": 0
    }
  ],
  "pieces": [
    {
      "row": 0,
      "col": 1,
      "state": 1
    },
    {
      "row": 0,
      "col": 3,
      "state": 1
    },
    {
      "row": 0,
      "col": 5,
      "state": 1
    },
    {
      "row": 0,
      "col": 7,
      "state": 1
    },
    {
      "row": 1,
      "col": 0,
      "state": 1
    },
    {
      "row": 1,
      "col": 2,
      "state": 1
    },
    {
      "row": 1,
      "col": 4,
      "state": 1
    },
    {
      "row": 1,
      "col": 6,
      "state": 1
    },
    {
      "row": 3,
      "col": 2,
      "state": 1,
      "x": 181.92307692307693,
      "y": 254.6923076923077
    },
    {
      "row": 2,
      "col": 3,
      "state": 1
    },
    {
      "row": 2,
      "col": 5,
      "state": 1
    },
    {
      "row": 2,
      "col": 7,
      "state": 1
    },
    {
      "row": 5,
      "col": 0,
      "state": -1
    },
    {
      "row": 5,
      "col": 2,
      "state": -1
    },
    {
      "row": 4,
      "col": 5,
      "state": -1,
      "x": 400.2307692307693,
      "y": 327.46153846153845
    },
    {
      "row": 5,
      "col": 6,
      "state": -1
    },
    {
      "row": 6,
      "col": 1,
      "state": -1
    },
    {
      "row": 6,
      "col": 3,
      "state": -1
    },
    {
      "row": 6,
      "col": 5,
      "state": -1
    },
    {
      "row": 6,
      "col": 7,
      "state": -1
    },
    {
      "row": 7,
      "col": 0,
      "state": -1
    },
    {
      "row": 7,
      "col": 2,
      "state": -1
    },
    {
      "row": 7,
      "col": 4,
      "state": -1
    },
    {
      "row": 7,
      "col": 6,
      "state": -1
    }
  ],
  "turn": 1,
  "ui": true,
  "delay": 0
};
var thirdBoard = {
  "cells": [
    {
      "row": 0,
      "col": 0,
      "state": 0
    },
    {
      "row": 0,
      "col": 1,
      "state": 1
    },
    {
      "row": 0,
      "col": 2,
      "state": 0
    },
    {
      "row": 0,
      "col": 3,
      "state": 1
    },
    {
      "row": 0,
      "col": 4,
      "state": 0
    },
    {
      "row": 0,
      "col": 5,
      "state": 1
    },
    {
      "row": 0,
      "col": 6,
      "state": 0
    },
    {
      "row": 0,
      "col": 7,
      "state": 1
    },
    {
      "row": 1,
      "col": 0,
      "state": 1
    },
    {
      "row": 1,
      "col": 1,
      "state": 0
    },
    {
      "row": 1,
      "col": 2,
      "state": 1
    },
    {
      "row": 1,
      "col": 3,
      "state": 0
    },
    {
      "row": 1,
      "col": 4,
      "state": 1
    },
    {
      "row": 1,
      "col": 5,
      "state": 0
    },
    {
      "row": 1,
      "col": 6,
      "state": 1
    },
    {
      "row": 1,
      "col": 7,
      "state": 0
    },
    {
      "row": 2,
      "col": 0,
      "state": 0
    },
    {
      "row": 2,
      "col": 1,
      "state": 0
    },
    {
      "row": 2,
      "col": 2,
      "state": 0
    },
    {
      "row": 2,
      "col": 3,
      "state": 1
    },
    {
      "row": 2,
      "col": 4,
      "state": 0
    },
    {
      "row": 2,
      "col": 5,
      "state": 1
    },
    {
      "row": 2,
      "col": 6,
      "state": 0
    },
    {
      "row": 2,
      "col": 7,
      "state": 1
    },
    {
      "row": 3,
      "col": 0,
      "state": 0
    },
    {
      "row": 3,
      "col": 1,
      "state": 0
    },
    {
      "row": 3,
      "col": 2,
      "state": 1
    },
    {
      "row": 3,
      "col": 3,
      "state": 0
    },
    {
      "row": 3,
      "col": 4,
      "state": 0
    },
    {
      "row": 3,
      "col": 5,
      "state": 0
    },
    {
      "row": 3,
      "col": 6,
      "state": 0
    },
    {
      "row": 3,
      "col": 7,
      "state": 0
    },
    {
      "row": 4,
      "col": 0,
      "state": 0
    },
    {
      "row": 4,
      "col": 1,
      "state": 0
    },
    {
      "row": 4,
      "col": 2,
      "state": 0
    },
    {
      "row": 4,
      "col": 3,
      "state": 0
    },
    {
      "row": 4,
      "col": 4,
      "state": 0
    },
    {
      "row": 4,
      "col": 5,
      "state": 0
    },
    {
      "row": 4,
      "col": 6,
      "state": 0
    },
    {
      "row": 4,
      "col": 7,
      "state": 0
    },
    {
      "row": 5,
      "col": 0,
      "state": -1
    },
    {
      "row": 5,
      "col": 1,
      "state": 0
    },
    {
      "row": 5,
      "col": 2,
      "state": -1
    },
    {
      "row": 5,
      "col": 3,
      "state": 0
    },
    {
      "row": 5,
      "col": 4,
      "state": -1
    },
    {
      "row": 5,
      "col": 5,
      "state": 0
    },
    {
      "row": 5,
      "col": 6,
      "state": -1
    },
    {
      "row": 5,
      "col": 7,
      "state": 0
    },
    {
      "row": 6,
      "col": 0,
      "state": 0
    },
    {
      "row": 6,
      "col": 1,
      "state": -1
    },
    {
      "row": 6,
      "col": 2,
      "state": 0
    },
    {
      "row": 6,
      "col": 3,
      "state": -1
    },
    {
      "row": 6,
      "col": 4,
      "state": 0
    },
    {
      "row": 6,
      "col": 5,
      "state": -1
    },
    {
      "row": 6,
      "col": 6,
      "state": 0
    },
    {
      "row": 6,
      "col": 7,
      "state": -1
    },
    {
      "row": 7,
      "col": 0,
      "state": -1
    },
    {
      "row": 7,
      "col": 1,
      "state": 0
    },
    {
      "row": 7,
      "col": 2,
      "state": -1
    },
    {
      "row": 7,
      "col": 3,
      "state": 0
    },
    {
      "row": 7,
      "col": 4,
      "state": -1
    },
    {
      "row": 7,
      "col": 5,
      "state": 0
    },
    {
      "row": 7,
      "col": 6,
      "state": -1
    },
    {
      "row": 7,
      "col": 7,
      "state": 0
    }
  ],
  "pieces": [
    {
      "row": 0,
      "col": 1,
      "state": 1
    },
    {
      "row": 0,
      "col": 3,
      "state": 1
    },
    {
      "row": 0,
      "col": 5,
      "state": 1
    },
    {
      "row": 0,
      "col": 7,
      "state": 1
    },
    {
      "row": 1,
      "col": 0,
      "state": 1
    },
    {
      "row": 1,
      "col": 2,
      "state": 1
    },
    {
      "row": 1,
      "col": 4,
      "state": 1
    },
    {
      "row": 1,
      "col": 6,
      "state": 1
    },
    {
      "row": 3,
      "col": 2,
      "state": 1
    },
    {
      "row": 2,
      "col": 3,
      "state": 1
    },
    {
      "row": 2,
      "col": 5,
      "state": 1
    },
    {
      "row": 2,
      "col": 7,
      "state": 1
    },
    {
      "row": 5,
      "col": 0,
      "state": -1
    },
    {
      "row": 5,
      "col": 2,
      "state": -1
    },
    {
      "row": 5,
      "col": 4,
      "state": -1
    },
    {
      "row": 5,
      "col": 6,
      "state": -1
    },
    {
      "row": 6,
      "col": 1,
      "state": -1
    },
    {
      "row": 6,
      "col": 3,
      "state": -1
    },
    {
      "row": 6,
      "col": 5,
      "state": -1
    },
    {
      "row": 6,
      "col": 7,
      "state": -1
    },
    {
      "row": 7,
      "col": 0,
      "state": -1
    },
    {
      "row": 7,
      "col": 2,
      "state": -1
    },
    {
      "row": 7,
      "col": 4,
      "state": -1
    },
    {
      "row": 7,
      "col": 6,
      "state": -1
    }
  ],
  "turn": -1
};
test('Expect There To BE 2 Possibilities', () => {
  expect(AI.getPossibleMoves(red, board)).toEqual([{"from": {"col": 4, "row": 3}, "move_type": "jump", "piece": 1, "to": {"col": 6, "row": 5}}]);
});

test('Expect The Beginning to Be 0 (i.e. False)', () => {
    expect(action.overYet(secondBoard)).toEqual(0);
});

