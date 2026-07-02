const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const scoreEl = document.querySelector('.score');
const clouds = document.querySelector('.clouds');

let score = 0;
let gameOver = false;
let scoreTimer = null;
let loop = null;

// Pulo
const jump = () => {
    if (gameOver || mario.classList.contains('jump')) return;
    mario.classList.add('jump');
    setTimeout(() => mario.classList.remove('jump'), 500);
};

// Reiniciar
const restart = () => {
    gameOver = false;
    score = 0;
    scoreEl.textContent = 'Score: 0';

    mario.src = 'img/mario.gif';
    mario.style.width = '150px';
    mario.style.marginLeft = '0';
    mario.style.bottom = '0';
    mario.style.animation = '';

    pipe.style.left = '';
    pipe.style.animation = 'pipe-animation 1.5s infinite linear';
    clouds.style.animation = 'clouds-animation 20s infinite linear';

    startTimers();
};

const startTimers = () => {
    // Pontuação
    scoreTimer = setInterval(() => {
        score++;
        scoreEl.textContent = 'Score: ' + score;
    }, 100);

    // Checagem de colisão
    loop = setInterval(() => {
        const pipePosition = pipe.offsetLeft;
        const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

        // Cano na frente do Mario e Mario baixo demais = colisão
        if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
            // Congela o cano onde está
            pipe.style.animation = 'none';
            pipe.style.left = pipePosition + 'px';

            // Congela o Mario na altura em que estava
            mario.style.animation = 'none';
            mario.style.bottom = marioPosition + 'px';
            mario.classList.remove('jump');

            // Troca pela imagem de game over
            mario.src = 'img/game-over.png';
            mario.style.width = '75px';
            mario.style.marginLeft = '50px';

            clouds.style.animation = 'none';

            gameOver = true;
            clearInterval(loop);
            clearInterval(scoreTimer);
        }
    }, 10);
};

// Controles: teclado, clique e toque (celular)
const handleInput = () => {
    if (gameOver) {
        // Ao morrer, o próximo toque reinicia
        pipe.style.left = '';
        restart();
    } else {
        jump();
    }
};

document.addEventListener('keydown', handleInput);
document.addEventListener('mousedown', handleInput);
document.addEventListener('touchstart', (e) => { e.preventDefault(); handleInput(); }, { passive: false });

startTimers();
