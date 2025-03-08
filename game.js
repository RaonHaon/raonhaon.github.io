
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
    let gameTime = 0;
    let spawnInterval = 2000; // Initial spawn interval in milliseconds
    let lastSpawnTime = 0;

    // Create initial enemies
    for (let i = 0; i < 8; i++) {
        enemies.push(createEnemy());
    }

    // Game loop
    function gameLoop(timestamp) {
        update(timestamp);
        draw();
        requestAnimationFrame(gameLoop);
    }

    // Update game state
    function update(timestamp) {
        gameTime = timestamp;

        // Move player
        if (keys['ArrowLeft'] && player.x > 0) player.x -= 5;
        if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += 5;

        // Move enemies
        enemies.forEach(enemy => {
            enemy.y += enemy.speed;
            if (enemy.y > canvas.height) {
                enemy.y = Math.random() * -200;
                enemy.x = Math.random() * (canvas.width - enemy.width);
                enemy.speed = getEnemySpeed();
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
                    enemy.speed = getEnemySpeed();
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
                enemy.speed = getEnemySpeed();
            }
        });

        // Spawn new enemies over time
        if (gameTime - lastSpawnTime > spawnInterval) {
            enemies.push(createEnemy());
            lastSpawnTime = gameTime;
            // Decrease spawn interval over time
            spawnInterval = Math.max(500, spawnInterval * 0.98);
        }
    }

    // Create a new enemy
    function createEnemy() {
        return {
            x: Math.random() * (canvas.width - 30),
            y: Math.random() * -200,
            width: 40,
            height: 40,
            speed: getEnemySpeed()
        };
    }

    // Calculate enemy speed based on game time
    function getEnemySpeed() {
        return Math.min(5, 1 + gameTime / 10000); // Increase speed over time, max speed of 5
    }

    // Draw game objects
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw player (rocket)
        ctx.font = '70px Arial';
        ctx.fillStyle = 'blue';
        ctx.fillText('??', player.x, player.y + 70);

        // Draw enemies (bugs)
        ctx.font = '40px Arial';
        enemies.forEach(enemy => {
            ctx.fillStyle = 'red';
            ctx.fillText('??', enemy.x, enemy.y + 40);
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
            bullets.push({ x: player.x + 25 - 2.5, y: player.y });
        }
    });
    document.addEventListener('keyup', e => {
        keys[e.code] = false;
    });

    gameLoop(0);
}

// Start the game when the window loads
window.onload = init;
