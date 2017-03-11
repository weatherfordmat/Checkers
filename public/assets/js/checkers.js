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

/*3 or 4 is relatively short time with decent results 
or ~ 8 for better results, but takes a while; 
NOTE: Placing the level of difficulty over 10
may crash your browser.
*/
var levelOfDifficulty = 4;


//misc. DOM manipulation;
$(document).ready(function() {
    $('#logout').click(function() {
        localStorage.removeItem("id");
    });
    var clicks = 0;
    $('.devView').click(function() {
    	
    	clicks++;
    	if (clicks % 2 === 0) {
    		$('.panel').css('opacity', '0');
    		$(this).text('Dev View');
    	}
    	else {
    		$('.panel').css('opacity', '1');
    		$(this).text('Close Dev View');
    	}
    });
});
