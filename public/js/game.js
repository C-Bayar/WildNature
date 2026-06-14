const animals = [
    { name: 'Bear', emoji: '🐻', image: '/images/bear.jpg' },
    { name: 'Crocodile', emoji: '🐊', image: '/images/crocodile.jpg' },
    { name: 'Eagle', emoji: '🦅', image: '/images/eagle.jpg' },
    { name: 'Elephant', emoji: '🐘', image: '/images/elephant.jpg' }
];

let gameCards = [], flippedCards = [], matchedPairs = 0, moves = 0, lockBoard = false;

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function initGame() {
    const doubled = [...animals, ...animals];
    gameCards = shuffleArray(doubled).map((animal, index) => ({
        id: index,
        animal: animal,
        flipped: false,
        matched: false
    }));
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    lockBoard = false;
    updateMoves();
    renderGrid();
}

function renderGrid() {
    const grid = document.getElementById('gameGrid');
    if (!grid) {
        console.log('Game grid not found');
        return;
    }
    
    grid.innerHTML = gameCards.map(card => {
        if (card.matched) {
            return `<div class="card matched" data-id="${card.id}"></div>`;
        }
        if (card.flipped) {
            return `<div class="card flipped" data-id="${card.id}">
                        <img src="${card.animal.image}" alt="${card.animal.name}">
                    </div>`;
        }
        return `<div class="card" data-id="${card.id}"></div>`;
    }).join('');
    
    document.querySelectorAll('.card').forEach(cardDiv => {
        cardDiv.addEventListener('click', () => {
            if (lockBoard) return;
            const id = parseInt(cardDiv.dataset.id);
            if (!isNaN(id)) handleCardClick(id);
        });
    });
}

function handleCardClick(id) {
    const card = gameCards[id];
    if (card.flipped || card.matched) return;
    if (flippedCards.length === 2) return;
    
    card.flipped = true;
    flippedCards.push(card);
    renderGrid();
    
    if (flippedCards.length === 2) {
        moves++;
        updateMoves();
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.animal.name === card2.animal.name) {
        card1.matched = true;
        card2.matched = true;
        matchedPairs++;
        flippedCards = [];
        renderGrid();
        
        if (matchedPairs === animals.length) {
            setTimeout(() => alert(`🎉 Congratulations! You completed the game in ${moves} moves! 🎉`), 100);
        }
    } else {
        lockBoard = true;
        setTimeout(() => {
            card1.flipped = false;
            card2.flipped = false;
            flippedCards = [];
            lockBoard = false;
            renderGrid();
        }, 1000);
    }
}

function updateMoves() {
    const movesSpan = document.getElementById('moves');
    if (movesSpan) movesSpan.textContent = moves;
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing game...');
    if (document.getElementById('gameGrid')) {
        initGame();
        document.getElementById('resetBtn')?.addEventListener('click', initGame);
    }
});