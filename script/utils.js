// 异步延迟
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 播放音效
export function playSound(type) {
    const sound = document.getElementById(`${type}-sound`);
    if (!sound) return;
    
    sound.currentTime = 0;
    sound.volume = type === 'shot' ? 0.7 : 0.5;
    sound.play().catch(e => console.error("Sound error:", e));
}

// 更新生命值显示
export function updateHealthDisplay(element, health) {
    element.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const heart = document.createElement('div');
        heart.className = `heart ${i < health ? 'active' : 'dead'}`;
        heart.innerHTML = i < health ? '❤️' : '💀';
        element.appendChild(heart);
    }
}

// 创建子弹动画
export function createBulletElement(bulletType, index) {
    const bullet = document.createElement('div');
    bullet.className = `bullet ${bulletType ? 'live' : 'blank'}`;
    bullet.dataset.index = index;
    bullet.innerHTML = bulletType ? '🔥' : '❄️';
    return bullet;
}