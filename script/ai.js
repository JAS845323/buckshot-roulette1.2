import { delay } from './utils.js';

export class AI {
    constructor() {
        this.actionDelay = 4000;
    }

    async takeTurn(game) {
        await delay(1000);
        
        // 30%概率使用道具
        if (game.currentItems.length > 0 && Math.random() < 0.3) {
            const itemType = this.chooseItem(game);
            const result = game.useItem(itemType);
            await delay(this.actionDelay);
            return {
                action: "ITEM",
                message: `ENEMY USED ${result.itemName}: ${result.message}`
            };
        }

        // 决定开枪目标（25%概率对自己开枪）
        const shootSelf = Math.random() < 0.25;
        await delay(1000);
        
        const result = game.shoot(shootSelf);
        await delay(this.actionDelay);
        
        return {
            action: "SHOOT",
            message: `ENEMY SHOT ${shootSelf ? "THEMSELVES" : "YOU"}: ${result.message}`
        };
    }

    chooseItem(game) {
        // 优先使用手铐或华子
        const priorityItems = ['handcuffs', 'huazi'];
        for (const item of priorityItems) {
            if (game.currentItems.includes(item)) return item;
        }
        // 随机选择剩余道具
        return game.currentItems[
            Math.floor(Math.random() * game.currentItems.length)
        ];
    }
}