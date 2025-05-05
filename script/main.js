import { BuckshotRoulette } from './game.js';
import { AI } from './ai.js';
import { delay, playSound, updateHealthDisplay, createBulletElement } from './utils.js';

const game = new BuckshotRoulette();
const ai = new AI();

// DOM元素
const elements = {
    playerHealth: document.getElementById('player-health'),
    aiHealth: document.getElementById('ai-health'),
    roundInfo: document.getElementById('round-info'),
    turnInfo: document.getElementById('turn-info'),
    bulletDisplay: document.getElementById('bullet-display'),
    actionLog: document.getElementById('action-log'),
    shootSelfBtn: document.getElementById('shoot-self'),
    shootAiBtn: document.getElementById('shoot-ai'),
    peekBtn: document.getElementById('peek'),
    currentItems: document.querySelector('.items-grid')
};

// 初始化游戏
function initGame() {
    bindEvents();
    startNewGame();
}

// 开始新游戏
async function startNewGame() {
    await game.initRound(1);
    updateUI();
    logAction("|| THE GAME BEGINS... ||", "system");
    playSound('reload');
}

// 更新UI
function updateUI() {
    updateHealthDisplay(elements.playerHealth, game.playerHealth);
    updateHealthDisplay(elements.aiHealth, game.aiHealth);
    
    elements.roundInfo.textContent = `ROUND ${game.currentRound}`;
    elements.turnInfo.textContent = game.isPlayerTurn ? "YOUR TURN" : "ENEMY TURN";
    elements.turnInfo.style.color = game.isPlayerTurn ? "#00ff00" : "#ff0000";
    
    updateBulletDisplay();
    updateItemsDisplay();
    
    // 禁用按钮
    elements.shootSelfBtn.disabled = !game.isPlayerTurn;
    elements.shootAiBtn.disabled = !game.isPlayerTurn;
    elements.peekBtn.disabled = !game.isPlayerTurn;
}

// 更新子弹显示
function updateBulletDisplay() {
    elements.bulletDisplay.innerHTML = '';
    game.bullets.forEach((bullet, i) => {
        elements.bulletDisplay.appendChild(createBulletElement(bullet, i));
    });
}

// 更新道具显示
function updateItemsDisplay() {
    elements.currentItems.innerHTML = '';
    game.currentItems.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'item';
        itemEl.innerHTML = ITEMS[item].name;
        itemEl.onclick = () => useItem(item);
        elements.currentItems.appendChild(itemEl);
    });
}

// 使用道具
async function useItem(itemType) {
    if (!game.isPlayerTurn) return;
    
    const result = game.useItem(itemType);
    playSound('item');
    logAction(`USED ${result.itemName}: ${result.message}`, "player");
    updateUI();
    
    if (game.checkGameOver()) {
        await handleGameEnd();
    }
}

// 处理游戏结束
async function handleGameEnd() {
    const result = game.checkGameOver();
    logAction(`|| ${result} ||`, "system");
    
    // 禁用所有按钮
    document.querySelectorAll('button').forEach(btn => btn.disabled = true);
    
    // 显示重新开始选项
    await delay(3000);
    if (confirm(`${result}\n\nPlay again?`)) {
        startNewGame();
    }
}

// 绑定事件
function bindEvents() {
    elements.shootSelfBtn.onclick = async () => {
        if (!game.isPlayerTurn) return;
        
        playSound('shot');
        const result = game.shoot(true);
        logAction(result.message, "action");
        updateUI();
        
        if (result.isReload) playSound('reload');
        if (game.checkGameOver()) await handleGameEnd();
        else if (!game.isPlayerTurn) await aiTurn();
    };
    
    elements.shootAiBtn.onclick = async () => {
        if (!game.isPlayerTurn) return;
        
        playSound('shot');
        const result = game.shoot(false);
        logAction(result.message, "action");
        updateUI();
        
        if (game.checkGameOver()) await handleGameEnd();
        else await aiTurn();
    };
    
    elements.peekBtn.onclick = () => {
        if (!game.isPlayerTurn) return;
        
        playSound('click');
        const bulletType = game.bullets[0] ? "LIVE" : "BLANK";
        logAction(`INSPECTED: NEXT BULLET IS ${bulletType}`, "player");
    };
}

// AI回合
async function aiTurn() {
    await delay(1500);
    const action = await ai.takeTurn(game);
    logAction(action.message, "enemy");
    updateUI();
    
    if (game.checkGameOver()) {
        await handleGameEnd();
    }
}

// 记录行动
function logAction(message, type) {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    elements.actionLog.prepend(entry);
    
    // 自动滚动
    elements.actionLog.scrollTop = 0;
    
    // 限制日志数量
    if (elements.actionLog.children.length > 20) {
        elements.actionLog.removeChild(elements.actionLog.lastChild);
    }
}

// 启动游戏
document.addEventListener('DOMContentLoaded', initGame);