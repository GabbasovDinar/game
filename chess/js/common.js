var init = function() {
//--- start ---
var board,
  game = new Chess(),
  statusEl = $('#status'),
  fenEl = $('#fen'),
  pgnEl = $('#pgn'),
  pos = [];
  pgnEl.on('click', 'a',function(event) {
  event.preventDefault();
  var data = $(this).data('move').split(',');
  var i = $(this).index() * 2;
  board.position(pos[i],false);
  board.move.apply(null,data);
})
// do not pick up pieces if the game is over
// only pick up pieces for the side to move
var onDragStart = function(source, piece, position, orientation) {
  board.position(game.fen());
  if (game.game_over() === true ||
      (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
};

var onDrop = function(source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return 'snapback';

  updateStatus();
};

// update the board position after the piece snap 
// for castling, en passant, pawn promotion
var onSnapEnd = function() {
  board.position(game.fen());
};

var updateStatus = function() {
  var status = '';

  var moveColor = 'White';
  if (game.turn() === 'b') {
    moveColor = 'Black';
  }

  // checkmate?
  if (game.in_checkmate() === true) {
    status = 'Game over, ' + moveColor + ' is in checkmate.';
  }

  // draw?
  else if (game.in_draw() === true) {
    status = 'Game over, drawn position';
  }

  // game still on
  else {
    status = moveColor + ' to move';

    // check?
    if (game.in_check() === true) {
      status += ', ' + moveColor + ' is in check';
    }
  }
  pos.push(game.fen());
  statusEl.html(status);
  fenEl.html(game.fen());
  pgnEl.html(game.pgn());
};
$('#ruyLopezBtn').on('click', function() {
	board.start;
	
});
var cfg = {
  //orientation: 'black',
  //showNotation: false,
  moveSpeed: 'slow',
  snapbackSpeed: 500,
  snapSpeed: 100,
  
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
};
var board = ChessBoard('board', cfg);
$('#flipOrientationBtn').on('click', board.flip);
updateStatus();

//--- end example JS ---

}; // end init()

window.onload= function() {
	document.getElementById('toggler').onclick = function() {
		openbox('box', this);
		return false;
	};
};
function openbox(id, toggler) {
	var div = document.getElementById(id);
	if(div.style.display == 'block') {
		div.style.display = 'none';
		toggler.innerHTML = 'Setting';
	}
	else {
		div.style.display = 'block';
		toggler.innerHTML = 'Close';
	}
}

$(document).ready(init);