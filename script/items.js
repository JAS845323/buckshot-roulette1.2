export const ITEMS = {
    huazi: {
        name: "CIGARETTE",
        description: "Heal 1 HP (Fake blood in Round 3)",
        use(game) {
            if (game.currentRound < 3 && !game.isFakeBlood) {
                game.playerHealth = Math.min(game.playerHealth + 1, 3);
                return "HEALED +1 HP";
            }
            return "FAKE BLOOD - NO EFFECT";
        }
    },
    handcuffs: {
        name: "HANDCUFFS",
        description: "Skip enemy's next turn",
        use(game) {
            game.aiSkipsNextTurn = true;
            return "ENEMY SKIPPED NEXT TURN";
        }
    },
    knife: {
        name: "KNIFE",
        description: "Next shot deals 2x damage",
        use(game) {
            game.nextShotDamageMultiplier = 2;
            return "NEXT SHOT WILL PIERCE";
        }
    },
    drink: {
        name: "DRINK",
        description: "Remove next bullet from chamber",
        use(game) {
            if (game.bullets.length > 0) {
                const removed = game.bullets.pop();
                return removed ? 
                    "REMOVED LIVE ROUND" : 
                    "REMOVED BLANK ROUND";
            }
            return "CHAMBER EMPTY";
        }
    },
    magnifier: {
        name: "MAGNIFIER",
        description: "Inspect next bullet",
        use(game) {
            if (game.bullets.length === 0) return "CHAMBER EMPTY";
            return game.bullets[0] ? 
                "NEXT: LIVE ROUND 🔥" : 
                "NEXT: BLANK ROUND ❄️";
        }
    }
};