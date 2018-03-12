// Some Cool constants I guess
BOARD_SIZE = 5;

BOGGLE_DIE = [
    'aaafrs',
    'aaeeee',
    'aafirs',
    'adennn',
    'aeeeem',

    'aeegmu',
    'aegmnn',
    'afirsy',
    'bjkqxz',
    'ccenst',

    'ceiilt',
    'ceilpt',
    'ceipst',
    'ddhnot',
    'dhhlor',

    'dhlnor',
    'dhlnor',
    'eiiitt',
    'emottt',
    'ensssu',

    'fiprsy',
    'gorrvw',
    'iprrry',
    'nootuw',
    'ooottu'

];

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}


function shuffleDie() {
    console.log("Shuffling the Dice!");
    shuffle(BOGGLE_DIE);
}



function randomChar() {
    // We could probably do somethign cool here with an only vowel and only consonant charset
    // And it's a set probability to get a vowel, which is then random /
    // Or it's a consonant, which is also random
    var VOWEL_PROB = 0.3;
    var RARE_PROB = 0.3;

    var char = 'x';
    var vowels = 'aeiou';
    var c_common = 'bcdfghjklmnp';
    var c_rare = 'bcdfghjklmnpqrstvwxyz';

    if (Math.random() <= VOWEL_PROB) {
        char = vowels.charAt(Math.floor(Math.random() * vowels.length));
    }
    else {
        if (Math.random() <= RARE_PROB) {
            // Return a rare consonant
            char = c_rare.charAt(Math.floor(Math.random() * c_rare.length));
        }
        else {
            char = c_common.charAt(Math.floor(Math.random() * c_common.length));
        }
    }

    return char;
}


function charForIndex(row, col) {
    var dieNum = (3 * row) + col;

    var die = BOGGLE_DIE[dieNum];

    // Return a random character for the current die
    return die.charAt(Math.floor(Math.random() * die.length));
}



// Do some cool stuff just when the page loads




/* Start Vue Instance */
var app = new Vue({
    el: '#app',
    data: {
        chars: [],
        board: [[1,2,3,4,5],[1,2,3,4,5],[1,2,3,4,5],[1,2,3,4,5],[1,2,3,4,5]],
        boardSet: false,
        word: '',
        text: '',
        drag: {},
        priority: 1,
        board_size: BOARD_SIZE
    },
    computed: {
        activeItems: function() {
            return this.items.filter(function(item) {
                return !item.completed;
            });
        },
        boardval: function(row, col) {
            return this.board[row][col];
        },
        filteredItems: function() {
            if (this.show === 'active')
            return this.items.filter(function(item) {
                return !item.completed;
            });
            if (this.show === 'completed')
            return this.items.filter(function(item) {
                return item.completed;
            });
            return this.items;
        },
        max_priority: function() {
            this.getPriority();
            return this.PRIORITY_MAX;
        },
    },
    methods: {
        dragItem: function(item) {
            event.dataTransfer.setData( 'text/html', event.currentTarget );
            this.drag = item;
        },
        mouseenter: function($event, row, col) {
            console.log("Mouse entered on tile: " + row + ", " + col);
            console.log("Tile value: " + this.board[row - 1][col - 1]);
        },
        clearBoard: function() {
            this.board = [];
            for (var i = 0; i < this.board_size; i++) {
                this.board.push([]);
                for (var j = 0; j < this.board_size; j++) {
                    this.board[i].push('x');
                }
            }
        },
        getBoardChar: function(row, col) {
            if (!this.boardSet) {
                this.initBoard();
                this.boardSet = true;
            }
            return this.board[row - 1][col - 1];
        },
        fillBoard: function() {
            shuffleDie();
            for (var i = 0; i < this.board_size; i++) {
                for (var j = 0; j < this.board_size; j++) {
                    var char = charForIndex(i, j);
                    console.log("Adding \'" + char + "\' to the board! ");
                    this.board[i][j] = char;
                }
            }
            this.$forceUpdate();
        },
        initBoard: function() {
            this.clearBoard();
            this.fillBoard();
        },
        created: function() {
            this.initBoard();
        },
    }
});
