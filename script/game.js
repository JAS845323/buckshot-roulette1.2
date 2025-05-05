export class BuckshotRoulette {
    constructor() {
        this.playerHealth = 3;
        this.aiHealth = 3;
        this.currentRound = 1;
        this.isPlayerTurn = true;
        this.bullets = [];
        this.aiSkipsNextTurn = false;
        this.nextShotDamageMultiplier = 1;
        this.isFakeBlood = false;
        this.currentItems = [];
        this.maxItemsPerRound = [0, 2, 4]; // 每回合道具数量
    }

    async initRound(round) {
        this.currentRound = round;
        this.isPlayerTurn = true;
        this.aiSkipsNextTurn = false;
        this.isFakeBlood = (round === 3);
        
        // 生成子弹（实弹至少占40%）
        const bulletCount = [3, 5, 8][round - 1];
        const liveCount = Math.max(1, Math.floor(bulletCount * 0.4));
        this.bullets = [
            ...Array(liveCount).fill(true),
            ...Array(bulletCount - liveCount).fill(false)
        ];
        await this.shuffleBullets();
        
        // 抽取道具
        this.drawRandomItems(this.maxItemsPerRound[round - 1]);
    }

    async shuffleBullets() {
        // 洗牌动画效果
        const display = document.getElementById('bullet-display');
        display.classList.add('shuffling');
        
        // Fisher-Yates洗牌算法
        for (let i = this.bullets.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.bullets[i], this.bullets[j]] = [this.bullets[j], this.bullets[i]];
            await delay(100);
        }
        
        display.classList.remove('shuffling');
    }

    drawRandomItems(count) {
        const allItems = Object.keys(ITEMS);
        this.currentItems = [];
        
        for (let i = 0; i < Math.min(count, allItems.length); i++) {
            const randomIndex = Math.floor(Math.random() * allItems.length);
            this.currentItems.push(allItems.splice(randomIndex, 1)[0]);
        }
    }

    shoot(targetSelf) {
        if (this.bullets.length === 0) {
            this.initRound(this.currentRound);
            return { message: "CLICK... RELOADING", isReload: true };
        }

        const bullet = this.bullets.shift();
        let result = {
            message: "",
            damage: 0,
            isTurnEnd: false
        };

        if (bullet) { // 实弹
            const damage = 1 * this.nextShotDamageMultiplier;
            this.nextShotDamageMultiplier = 1;
            
            if (targetSelf) {
                this.playerHealth -= damage;
                result.message = `BANG! YOU TOOK ${damage} DAMAGE`;
            } else {
                this.aiHealth -= damage;
                result.message = `BOOM! ENEMY TOOK ${damage} DAMAGE`;
            }
            result.damage = damage;
            result.isTurnEnd = true;
        } else { // 空包弹
            result.message = targetSelf ? 
                "*click*... SAFE (YOUR TURN CONTINUES)" : 
                "*click*... MISSED";
            result.isTurnEnd = !targetSelf;
        }

        // 切换回合
        if (result.isTurnEnd && !this.aiSkipsNextTurn) {
            this.isPlayerTurn = !this.isPlayerTurn;
        } else if (this.aiSkipsNextTurn) {
            result.message += " | ENEMY SKIPPED";
            this.aiSkipsNextTurn = false;
        }

        return result;
    }

    useItem(itemType) {
        const item = ITEMS[itemType];
        if (!item || !this.currentItems.includes(itemType)) {
            return { success: false, message: "INVALID ITEM" };
        }

        this.currentItems.splice(this.currentItems.indexOf(itemType), 1);
        return {
            success: true,
            message: item.use(this),
            itemName: item.name
        };
    }

    checkGameOver() {
        if (this.playerHealth <= 0) {
            return this.currentRound === 3 ? 
                "YOU DIED... GAME OVER" : 
                "ENEMY SPARED YOU... FOR NOW";
        }
        if (this.aiHealth <= 0) return "ENEMY DEFEATED!";
        if (this.bullets.length === 0 && this.currentRound === 3) {
            return "OUT OF AMMO... DRAW";
        }
        return null;
    }
}