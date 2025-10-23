// 1. 页面元素获取
const loginPage = document.getElementById('loginPage');
const gamePage = document.getElementById('gamePage');
const celebrationPage = document.getElementById('celebrationPage'); // 新增庆祝页面
const loginBtn = document.getElementById('loginBtn');
const restartBtn = document.getElementById('restartBtn'); // 再来一次按钮
const cakeCountSpan = document.getElementById('cakeCount');

// 2. 登录逻辑
loginBtn.addEventListener('click', () => {
    loginPage.classList.add('hidden');
    gamePage.classList.remove('hidden');
    startGame();
});

// 3. 再来一次按钮逻辑
restartBtn.addEventListener('click', () => {
    celebrationPage.classList.add('hidden');
    loginPage.classList.remove('hidden');
    cakeCountSpan.textContent = '0'; // 重置计数
});

// 4. 游戏核心逻辑
function startGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    let cakeCount = 0;
    const matchman = {
        x: 100,
        y: 300,
        width: 40,
        height: 60,
        speed: 5
    };
    const cakes = [];
    let cakeSpawnTimer = 0;

    // 键盘控制
    const keys = {
        ArrowLeft: false,
        ArrowRight: false
    };

    document.addEventListener('keydown', (e) => {
        if (keys.hasOwnProperty(e.key)) {
            keys[e.key] = true;
        }
    });

    document.addEventListener('keyup', (e) => {
        if (keys.hasOwnProperty(e.key)) {
            keys[e.key] = false;
        }
    });

    // 生成蛋糕
    function spawnCake() {
        cakes.push({
            x: Math.random() * (canvas.width - 30),
            y: 0,
            width: 30,
            height: 30,
            speed: 2 + Math.random() * 2
        });
    }

    // 检测碰撞
    function checkCollision() {
        for (let i = cakes.length - 1; i >= 0; i--) {
            const cake = cakes[i];
            if (
                matchman.x < cake.x + cake.width &&
                matchman.x + matchman.width > cake.x &&
                matchman.y < cake.y + cake.height &&
                matchman.y + matchman.height > cake.y
            ) {
                cakes.splice(i, 1);
                cakeCount++;
                cakeCountSpan.textContent = cakeCount;

                // 新增：吃到第52个蛋糕时跳转
                if (cakeCount === 52) {
                    gamePage.classList.add('hidden');
                    celebrationPage.classList.remove('hidden');
                    // 创建蛋糕装饰元素（让蛋糕显示蜡烛）
                    const bigCake = document.getElementById('bigCake');
                    bigCake.innerHTML = `
    <div class="base"></div>
    <div class="layer-bottom"></div>
    <div class="layer-middle"></div>
    <div class="layer-top"></div>
    <div class="cream-top"></div>
    <!-- 侧边奶油花纹 -->
    <div class="cream-side"></div>
    <div class="cream-side"></div>
    <div class="cream-side"></div>
    <div class="cream-side"></div>
    <div class="cream-side"></div>
    <div class="cream-side"></div>
    <div class="cream-side"></div>
    <!-- 水果装饰 -->
    <div class="fruit strawberry"></div>
    <div class="fruit blueberry"></div>
    <div class="fruit strawberry"></div>
    <div class="fruit blueberry"></div>
    <div class="fruit blueberry"></div>
    <div class="fruit strawberry"></div>
    <div class="fruit strawberry"></div>
    <!-- 仅保留一根蜡烛 -->
    <div class="candle"></div>
`;
                    return true; // 终止当前游戏
                }
            } else if (cake.y > canvas.height) {
                cakes.splice(i, 1);
            }
        }
        return false;
    }

    // 绘制元素
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制火柴人
        // 头部
        ctx.beginPath();
        ctx.arc(matchman.x + matchman.width/2, matchman.y + 15, 15, 0, Math.PI * 2);
        ctx.fillStyle = '#333';
        ctx.fill();
        // 身体
        ctx.beginPath();
        ctx.moveTo(matchman.x + matchman.width/2, matchman.y + 30);
        ctx.lineTo(matchman.x + matchman.width/2, matchman.y + 60);
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#333';
        ctx.stroke();
        // 手臂
        ctx.beginPath();
        ctx.moveTo(matchman.x + matchman.width/2, matchman.y + 40);
        ctx.lineTo(matchman.x, matchman.y + 50);
        ctx.moveTo(matchman.x + matchman.width/2, matchman.y + 40);
        ctx.lineTo(matchman.x + matchman.width, matchman.y + 50);
        ctx.lineWidth = 4;
        ctx.stroke();
        // 腿部
        ctx.beginPath();
        ctx.moveTo(matchman.x + matchman.width/2, matchman.y + 60);
        ctx.lineTo(matchman.x + 10, matchman.y + 100);
        ctx.moveTo(matchman.x + matchman.width/2, matchman.y + 60);
        ctx.lineTo(matchman.x + 30, matchman.y + 100);
        ctx.lineWidth = 4;
        ctx.stroke();

        // 绘制蛋糕
        cakes.forEach(cake => {
            ctx.fillStyle = '#ffd700';
            ctx.fillRect(cake.x, cake.y, cake.width, cake.height);
            ctx.beginPath();
            ctx.arc(cake.x + cake.width/2, cake.y - 5, 10, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(cake.x + cake.width/2, cake.y - 10, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#ff0000';
            ctx.fill();
        });
    }

    // 游戏循环
    function gameLoop() {
        // 检查是否已经达到52个蛋糕（如果是则停止循环）
        if (cakeCount >= 52) return;

        if (cakeSpawnTimer++ > 60) {
            spawnCake();
            cakeSpawnTimer = 0;
        }

        // 移动火柴人
        if (keys.ArrowLeft && matchman.x > 0) {
            matchman.x -= matchman.speed;
        }
        if (keys.ArrowRight && matchman.x + matchman.width < canvas.width) {
            matchman.x += matchman.speed;
        }

        // 移动蛋糕
        cakes.forEach(cake => {
            cake.y += cake.speed;
        });

        // 检测碰撞，如果达到5个则停止循环
        const reachedTarget = checkCollision();
        if (reachedTarget) return;

        draw();
        requestAnimationFrame(gameLoop);
    }

    // 启动游戏
    gameLoop();
}