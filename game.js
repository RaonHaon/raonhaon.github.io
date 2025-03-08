// game.js

// Initialize the game
function init() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Game variables
    let player = { x: canvas.width / 2, y: canvas.height - 30, width: 50, height: 70 };
    let enemies = [];
    let bullets = [];
    let score = 0;
    let lives = 3;

    // Create enemies
    for (let i = 0; i < 8; i++) {
        enemies.push({
            x: Math.random() * (canvas.width - 30),
            y: Math.random() * -200,
            width: 40,
            height: 40,
            speed: Math.random() * 2 + 1
        });
    }

    // Game loop
    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    // Update game state
    function update() {
        // Move player
        if (keys['ArrowLeft'] && player.x > 0) player.x -= 5;
        if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += 5;

        // Move enemies
        enemies.forEach(enemy => {
            enemy.y += enemy.speed;
            if (enemy.y > canvas.height) {
                enemy.y = Math.random() * -200;
                enemy.x = Math.random() * (canvas.width - enemy.width);
                enemy.speed = Math.random() * 2 + 1;
            }
        });

        // Move bullets
        bullets.forEach(bullet => {
            bullet.y -= 10;
            if (bullet.y < 0) {
                bullets.splice(bullets.indexOf(bullet), 1);
            }
        });

        // Check collisions
        enemies.forEach(enemy => {
            bullets.forEach(bullet => {
                if (bullet.x < enemy.x + enemy.width &&
                    bullet.x + 5 > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + 10 > enemy.y) {
                    score += 10;
                    enemy.y = Math.random() * -200;
                    enemy.x = Math.random() * (canvas.width - enemy.width);
                    enemy.speed = Math.random() * 2 + 1;
                    bullets.splice(bullets.indexOf(bullet), 1);
                }
            });

            if (enemy.x < player.x + player.width &&
                enemy.x + enemy.width > player.x &&
                enemy.y < player.y + player.height &&
                enemy.y + enemy.height > player.y) {
                lives--;
                if (lives === 0) {
                    alert('Game Over! Your score: ' + score);
                    document.location.reload();
                }
                enemy.y = Math.random() * -200;
                enemy.x = Math.random() * (canvas.width - enemy.width);
                enemy.speed = Math.random() * 2 + 1;
            }
        });
    }

    // Draw game objects
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw player (rocket)
        ctx.fillStyle = 'blue';
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(player.x + player.width / 2, player.y);
        ctx.lineTo(player.x, player.y + player.height);
        ctx.lineTo(player.x + player.width, player.y + player.height);
        ctx.fill();

        // Draw enemies (spiders)
        ctx.fillStyle = 'red';
        enemies.forEach(enemy => {
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'black';
            ctx.fillRect(enemy.x + 10, enemy.y + enemy.height / 2, 20, 2);
            ctx.fillRect(enemy.x + enemy.width / 2, enemy.y + 10, 2, 20);
        });

        // Draw bullets
        ctx.fillStyle = 'white';
        bullets.forEach(bullet => {
            ctx.fillRect(bullet.x, bullet.y, 5, 10);
        });

        // Draw score and lives
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.fillText('Score: ' + score, 10, 30);
        ctx.fillText('Lives: ' + lives, 10, 60);
    }

    // Handle key events
    let keys = {};
    document.addEventListener('keydown', e => {
        keys[e.code] = true;
        if (e.code === 'Space') {
            bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y });
        }
    });
    document.addEventListener('keyup', e => {
        keys[e.code] = false;
    });

    gameLoop();
}

// Start the game when the window loads
window.onload = init;
