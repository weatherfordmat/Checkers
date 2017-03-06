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
