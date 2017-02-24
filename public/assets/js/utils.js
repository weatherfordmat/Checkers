var utils = {
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
    integ: function(num) {
    if(num != null)
        return Math.round(num);
    else
        return null;
}
}
