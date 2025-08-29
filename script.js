document.addEventListener('DOMContentLoaded', () => {
    // ==================================================================
    //  Game Data and State Management
    // ==================================================================
    let player = {};
    let currentEnemy = {};
    let battleLog = [];
    let gameMap = [];
    let mapSize = 0;
    let temporaryMapChanges = {};
    let activeBosses = {};

    // --- Databases ---
    const itemDatabase = {
        "薬草": { type: "item", sellPrice: 5 },
        "魔石": { type: "item", sellPrice: 10 },
        "解毒薬": { type: "item", sellPrice: 8 },
        "古代のコイン": { type: "item", sellPrice: 50 },
        "暖かい外套": { type: "item", sellPrice: 25 },
        "エーテル": { type: "item", sellPrice: 100 },
    };

    const weaponDatabase = {
        "見習いの杖": { type: "weapon", atk: 5, price: 50 },
        "樫の杖": { type: "weapon", atk: 12, price: 200 },
        "魔導士の杖": { type: "weapon", atk: 25, price: 1000 },
    };
    
    const bossDatabase = {
        "aura": {
            id: "aura",
            name: "断頭台のアウラ",
            sprite: "😈",
            image: "aura_battle.png",
            stats: { hp: 700, mp: 1000, atk: 20, def: 30, spd: 25, luck: 15 },
            exp: 5000,
            gold: 1000,
            isBoss: true,
            drops: [{ name: "魔石", chance: 1.0, quantity: 10 }],
            abilities: [
                { type: 'damage', name: '斬撃', power: 2.2 },
                { type: 'damage', name: '魔力の斬撃', power: 3.2, cost: 50 },
                { type: 'special', name: 'アゼリューゼ', trigger: { hp_below: 100 } }
            ]
        }
    };
    
    const enemyDatabase = {
        forest: [
            { name: "スライム", sprite: "💧", stats: { hp: 40, atk: 10, def: 5 }, exp: 25, gold: 10, drops: [{ name: "魔石", chance: 0.5 }] },
            { name: "ゴブリン", sprite: "🧌", stats: { hp: 60, atk: 14, def: 8 }, exp: 40, gold: 20, drops: [{ name: "薬草", chance: 0.3 }] }
        ],
        village: [],
        cave: [
            { name: "大コウモリ", sprite: "🦇", stats: { hp: 70, atk: 15, def: 5 }, exp: 50, gold: 25, drops: [] },
            { name: "ゴブリン兵", sprite: "🧌", stats: { hp: 80, atk: 18, def: 10 }, exp: 60, gold: 30, drops: [{ name: "魔石", chance: 0.8 }] }
        ],
        snow: [
            { name: "氷狼", sprite: "🐺", stats: { hp: 70, atk: 16, def: 6 }, exp: 55, gold: 28, drops: [] },
            { name: "フロストゴブリン", sprite: "🧌", stats: { hp: 90, atk: 20, def: 12 }, exp: 70, gold: 40, drops: [{ name: "魔石", chance: 0.9 }] }
        ],
        desert: [
            { name: "サンドワーム", sprite: "🐛", stats: { hp: 100, atk: 22, def: 15 }, exp: 80, gold: 50, drops: [] },
        ],
        ruins: [
            { name: "ストーンゴーレム", sprite: "🗿", stats: { hp: 200, atk: 30, def: 25 }, exp: 150, gold: 100, drops: [{ name: "古代のコイン", chance: 0.2 }] },
        ],
        mimic: [
             { name: "ミミック", sprite: "🎁", stats: { hp: 150, atk: 25, def: 20 }, exp: 100, gold: 150, drops: [{ name: "金貨", quantity: 100, chance: 1.0 }] }
        ],
        boss: []
    };

    const spellDatabase = {
        "ゾルトラーク": { type: "damage", cost: 5, power: 2.2, name: "ゾルトラーク" },
        "ジュドラジルム": { type: "damage", cost: 30, power: 9.0, name: "ジュドラジルム" },
        "ヴォルザンベル": { type: "damage", cost: 25, power: 6.5, name: "ヴォルザンベル" },
        "宝箱判別魔法": { type: "utility", cost: 10, effect: "appraise_chest", name: "宝箱判別魔法" },
        "花畑を出す魔法": { type: "utility", cost: 20, effect: "create_flowers", name: "花畑を出す魔法" },
        "火の魔法": { type: "damage", cost: 15, power: 2.5, name: "火の魔法" },
        "回復魔法": { type: "heal", cost: 10, power: 30, name: "回復魔法" },
        "氷の矢": { type: "damage", cost: 12, power: 2.0, name: "氷の矢" },
        "聖なる光": { type: "heal", cost: 25, power: 80, name: "聖なる光" },
        "砂嵐": { type: "damage", cost: 20, power: 3.0, name: "砂嵐" },
        "ゴーレムを破壊する魔法": { type: "damage", cost: 28, power: 3.8, name: "ゴーレムを破壊する魔法" },
        "明かりの魔法": { type: "utility", cost: 5, effect: "light", name: "明かりの魔法" },
    };

    const questDatabase = {
        "exam1": {
            id: "exam1",
            title: "一級魔法使い試験",
            description: "試験官: 「最初の試験だ。雪原に生息するフロストゴブリンを3体討伐してきなさい。」",
            objective: { type: "kill", target: "フロストゴブリン", required: 3 },
            reward: { type: "spell", name: "砂嵐" }
        }
    };


    // --- DOM Elements ---
    const screens = document.querySelectorAll('.screen');
    const mapContainer = document.getElementById('map-container');
    const logWindow = document.getElementById('log-window');
    const titleBgm = document.getElementById('title-bgm');
    const mapBgm = document.getElementById('map-bgm');
    const battleBgm = document.getElementById('battle-bgm');
    const bossBgm = document.getElementById('boss-bgm');

    // ==================================================================
    //  BGM Control
    // ==================================================================
    const allBgms = [titleBgm, mapBgm, battleBgm, bossBgm];
    function playBgm(trackId) {
        allBgms.forEach(bgm => {
            if (bgm.id === trackId) {
                if (bgm.paused) {
                    bgm.play().catch(e => console.log("BGM再生がユーザー操作待ちです。"));
                }
            } else {
                bgm.pause();
                bgm.currentTime = 0;
            }
        });
    }

    // ==================================================================
    //  Screen Transition & Modals
    // ==================================================================
    const showScreen = (screenId) => {
        screens.forEach(screen => {
            screen.classList.toggle('active', screen.id === screenId);
        });

        if (screenId === 'main-game-screen') {
            playBgm('map-bgm');
        } else if (screenId === 'battle-screen') {
            // Battle BGM is handled in startBattle to differentiate boss/normal
        } else if (screenId.includes('screen')) {
            playBgm('title-bgm');
        }
        
        if (screenId === 'status-screen') updateStatusScreen();
        if (screenId === 'inventory-screen') updateInventoryScreen();
        if (screenId === 'spellbook-screen') updateSpellbookScreen();
        if (screenId === 'town-screen') updateTownScreen();
        if (screenId === 'quest-log-screen') updateQuestLogScreen();
    };

    const showModal = (modalId, show = true) => {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.toggle('active', show);
    };

    // ==================================================================
    //  Log Output
    // ==================================================================
    function addLog(message, type = 'system') {
        const p = document.createElement('p');
        p.textContent = message;
        p.className = `log-${type}`;
        logWindow.appendChild(p);
        logWindow.scrollTop = logWindow.scrollHeight;
    }

    // ==================================================================
    //  Character Creation
    // ==================================================================
    document.getElementById('start-creation-button').addEventListener('click', () => {
        showScreen('character-creation-screen');
    });

    document.body.addEventListener('click', () => {
        if (titleBgm.paused && document.querySelector('#splash-screen.active')) {
             playBgm('title-bgm');
        }
    }, { once: true });


    document.getElementById('complete-creation-button').addEventListener('click', () => {
        const name = document.getElementById('player-name').value || "フリーレン";
        player = {
            name, race: 'elf', pClass: 'mage',
            level: 1, exp: 0, nextLevelExp: 100,
            x: 0, y: 0, currentMap: 'northernForest',
            gold: 50,
            equipment: { weapon: { name: "見習いの杖", atk: 5, level: 1 } },
            inventory: [{ name: "薬草", quantity: 10 }],
            spells: ["ゾルトラーク", "ジュドラジルム", "ヴォルザンベル", "宝箱判別魔法", "花畑を出す魔法", "回復魔法"],
            quests: [],
            stats: { hp: 0, maxHp: 0, mp: 0, maxMp: 0, baseAtk: 0, def: 0, spd: 0, luck: 0 }
        };

        const baseStats = { elf: { hp: 120, mp: 3000, atk: 8, def: 50, spd: 12, luck: 10 } };
        const classMods = { mage: { hp: 0.8, mp: 1.5, atk: 0.8, def: 0.9, spd: 1.0, luck: 1.0 } };

        player.stats.maxHp = Math.floor(baseStats.elf.hp * classMods.mage.hp);
        player.stats.hp = player.stats.maxHp;
        player.stats.maxMp = Math.floor(baseStats.elf.mp * classMods.mage.mp);
        player.stats.mp = player.stats.maxMp;
        player.stats.baseAtk = Math.floor(baseStats.elf.atk * classMods.mage.atk);
        player.stats.def = Math.floor(baseStats.elf.def * classMods.mage.def);
        player.stats.spd = Math.floor(baseStats.elf.spd * classMods.mage.spd);
        player.stats.luck = Math.floor(baseStats.elf.luck * classMods.mage.luck);
        
        initializeGame();
    });
    
    // ==================================================================
    //  Game Initialization
    // ==================================================================
    function initializeGame() {
        loadMap(player.currentMap);
        updateHUD();
        addLog(`${player.name}の旅が始まった。`, 'system');
        showScreen('main-game-screen');
    }

    // ==================================================================
    //  Map and NPC/Boss Logic
    // ==================================================================
    function initializeBosses() {
        if (!activeBosses.aura) {
            activeBosses.aura = {
                ...JSON.parse(JSON.stringify(bossDatabase.aura)),
                map: 'auraThroneRoom',
                x: 7, y: 2
            };
        }
    }

    function loadMap(mapId, targetX, targetY) {
        const mapData = mapDatabase[mapId];
        if (!mapData) return;

        player.currentMap = mapId;
        temporaryMapChanges = {};
        mapSize = mapData.layout.length;
        gameMap.length = 0;
        mapContainer.innerHTML = '';
        mapContainer.style.gridTemplateColumns = `repeat(${mapSize}, 1fr)`;
        
        for (let y = 0; y < mapSize; y++) {
            gameMap[y] = [];
            for (let x = 0; x < mapSize; x++) {
                const tileEl = document.createElement('div');
                tileEl.classList.add('map-tile');
                tileEl.id = `tile-${x}-${y}`;
                mapContainer.appendChild(tileEl);
            }
        }

        if (mapId === 'auraThroneRoom') {
            initializeBosses();
        }

        player.x = targetX !== undefined ? targetX : (mapData.startPosition ? mapData.startPosition.x : 7);
        player.y = targetY !== undefined ? targetY : (mapData.startPosition ? mapData.startPosition.y : 13);
        drawMap();
    }

    function drawMap() {
        const currentMapData = mapDatabase[player.currentMap];
        for (let y = 0; y < mapSize; y++) {
            for (let x = 0; x < mapSize; x++) {
                const tileEl = document.getElementById(`tile-${x}-${y}`);
                const tileCode = currentMapData.layout[y][x];
                tileEl.innerHTML = '';
                tileEl.className = 'map-tile';
                let symbol = '', color = '#fff', bgColor = '#000';
                
                const tempChange = temporaryMapChanges[`${y}-${x}`];
                if (tempChange && tempChange.type === 'flower_garden') {
                     symbol = '🌼';
                } else {
                    switch(tileCode) {
                        case 'f': symbol = '🌳'; break;
                        case 'p': symbol = '🌾'; break;
                        case 'g': symbol = '☘️'; break;
                        case 'H': symbol = '🏠'; break;
                        case 'T': case 'A': symbol = '🏰'; break;
                        case 'C': symbol = '🕳️'; break;
                        case 'V': symbol = '🏁'; break;
                        case 'w': bgColor = '#333'; break;
                        case ' ': bgColor = '#666'; break;
                        case 'E': case 'U': symbol = '⬆️'; bgColor = '#666'; break;
                        case 's': symbol = '❄️'; break;
                        case 'd': symbol = '🏜️'; break;
                        case 'R': symbol = '🏛️'; break;
                        case 'o': symbol = '💧'; break;
                        case 'S': case 'M': case 'D': case 'X': symbol = '🌀'; break;
                        case 'B':
                            const chestState = currentMapData.chests[`${y}-${x}`];
                            symbol = chestState && !chestState.opened ? '🎁' : '📦';
                            break;
                    }
                }
                tileEl.textContent = symbol;
                tileEl.style.backgroundColor = bgColor;
            }
        }
        
        if (currentMapData.npcs) {
            Object.keys(currentMapData.npcs).forEach(key => {
                const [y, x] = key.split('-').map(Number);
                const npc = currentMapData.npcs[key];
                document.getElementById(`tile-${x}-${y}`).textContent = npc.sprite;
            });
        }

        Object.values(activeBosses).forEach(boss => {
            if (boss.map === player.currentMap) {
                document.getElementById(`tile-${boss.x}-${boss.y}`).textContent = boss.sprite;
            }
        });

        const playerTile = document.getElementById(`tile-${player.x}-${player.y}`);
        if(!temporaryMapChanges[`${player.y}-${player.x}`]) {
             playerTile.textContent = '🧝‍♀️';
        }
        playerTile.classList.add('player-tile');
    }
    
    function moveBosses() {
        Object.values(activeBosses).forEach(boss => {
            if (boss.map !== player.currentMap) return;
            
            const moves = [{x:0, y:-1}, {x:0, y:1}, {x:-1, y:0}, {x:1, y:0}];
            const move = moves[Math.floor(Math.random() * moves.length)];
            const newX = boss.x + move.x;
            const newY = boss.y + move.y;
            
            const mapLayout = mapDatabase[boss.map].layout;
            if (mapLayout[newY] && mapLayout[newY][newX] !== 'w' && !(newX === player.x && newY === player.y)) {
                boss.x = newX;
                boss.y = newY;
            }
        });
    }

    window.addEventListener('keydown', (e) => {
        if (document.querySelector('#main-game-screen.active')) {
            let newX = player.x, newY = player.y;
            if (e.key === 'ArrowUp') newY--;
            if (e.key === 'ArrowDown') newY++;
            if (e.key === 'ArrowLeft') newX--;
            if (e.key === 'ArrowRight') newX++;
            
            const mapLayout = mapDatabase[player.currentMap].layout;
            if (mapLayout[newY] && mapLayout[newY][newX] !== 'w') {
                delete temporaryMapChanges[`${player.y}-${player.x}`];
                player.x = newX;
                player.y = newY;
                moveBosses();
                drawMap();
                checkTileEvent();
            }
        }
    });

    function checkTileEvent() {
        const currentMapData = mapDatabase[player.currentMap];
        const tileCode = currentMapData.layout[player.y][player.x];
        
        for (const boss of Object.values(activeBosses)) {
            if (boss.map === player.currentMap && player.x === boss.x && player.y === boss.y) {
                startBattle(null, boss.id);
                return;
            }
        }
        
        const npc = currentMapData.npcs && currentMapData.npcs[`${player.y}-${player.x}`];
        if (npc) {
            document.getElementById('dialogue-text').textContent = npc.dialog;
            showModal('dialogue-modal');
            return;
        }

        const portal = currentMapData.portals && currentMapData.portals[tileCode];
        if (portal) {
            if (portal.isTown) {
                showScreen('town-screen');
            } else {
                addLog('別のエリアに移動した。', 'system');
                loadMap(portal.targetMap, portal.targetX, portal.targetY);
            }
        } else if (tileCode === 'B') {
            const chest = currentMapData.chests[`${player.y}-${player.x}`];
            if (chest && !chest.opened) openChest(player.y, player.x);
        } else {
            const terrain = currentMapData.terrainType;
            if (terrain && terrain !== 'boss' && terrain !== 'village') {
                const encounterRate = { forest: 0.2, cave: 0.3, snow: 0.25, desert: 0.15, ruins: 0.28 }[terrain] || 0;
                if (Math.random() < encounterRate) startBattle(terrain);
            }
        }
    }
    
    // ==================================================================
    //  UI Updates
    // ==================================================================
    function updateHUD() {
        document.getElementById('hud-name').textContent = `${player.name} | Lv ${player.level}`;
        document.getElementById('hp-value').textContent = `${player.stats.hp} / ${player.stats.maxHp}`;
        document.getElementById('mp-value').textContent = `${player.stats.mp} / ${player.stats.maxMp}`;
        document.getElementById('exp-value').textContent = `${player.exp} / ${player.nextLevelExp}`;
        document.getElementById('hp-bar').style.width = `${(player.stats.hp / player.stats.maxHp) * 100}%`;
        document.getElementById('mp-bar').style.width = `${(player.stats.mp / player.stats.maxMp) * 100}%`;
        document.getElementById('exp-bar').style.width = `${(player.exp / player.nextLevelExp) * 100}%`;
    }
    
    function getTotalAtk() {
        return player.stats.baseAtk + (player.equipment.weapon ? player.equipment.weapon.atk : 0);
    }
    
    function updateStatusScreen() {
        const weapon = player.equipment.weapon;
        document.getElementById('status-grid').innerHTML = `
            <span>HP</span><span>${player.stats.hp} / ${player.stats.maxHp}</span>
            <span>MP</span><span>${player.stats.mp} / ${player.stats.maxMp}</span>
            <span>攻撃力</span><span>${getTotalAtk()} (基礎:${player.stats.baseAtk} + 杖:${weapon.atk})</span>
            <span>防御力</span><span>${player.stats.def}</span>
            <span>素早さ</span><span>${player.stats.spd}</span>
            <span>運</span><span>${player.stats.luck}</span>
            <span>装備中の杖</span><span>${weapon.name} +${weapon.level}</span>
        `;
    }

    function updateInventoryScreen() {
        document.getElementById('gold-display').textContent = `所持金: ${player.gold} G`;
        const list = document.getElementById('inventory-list');
        list.innerHTML = '';
        player.inventory.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} x ${item.quantity}`;
            list.appendChild(li);
        });
        if (player.inventory.length === 0) list.innerHTML = '<li>何も持っていない</li>';
    }
    
    function updateSpellbookScreen() {
        const list = document.getElementById('spellbook-list');
        list.innerHTML = '';
        player.spells.forEach(spellName => {
            const spell = spellDatabase[spellName];
            const li = document.createElement('li');
            li.innerHTML = `<span>${spell.name} (MP: ${spell.cost})</span>`;
            if (spell.type === 'utility') {
                const useButton = document.createElement('button');
                useButton.textContent = '使用';
                useButton.className = 'game-button small-button';
                useButton.disabled = player.stats.mp < spell.cost;
                useButton.onclick = () => castUtilitySpell(spellName);
                li.appendChild(useButton);
            }
            list.appendChild(li);
        });
    }

    function updateQuestLogScreen() {
        const list = document.getElementById('quest-list');
        list.innerHTML = '';
        if (player.quests.length === 0) {
            list.innerHTML = '<li>現在受けているクエストはありません。</li>';
            return;
        }

        player.quests.forEach(quest => {
            const questData = questDatabase[quest.id];
            const li = document.createElement('li');
            const progress = quest.progress >= questData.objective.required ? "達成" : `${quest.progress} / ${questData.objective.required}`;
            li.innerHTML = `
                <h3>${questData.title}</h3>
                <p>${questData.description}</p>
                <p>進捗: ${progress}</p>
            `;
            list.appendChild(li);
        });
    }

    function updateTownScreen() {
        const portal = mapDatabase[player.currentMap].portals[mapDatabase[player.currentMap].layout[player.y][player.x]];
        document.getElementById('town-name').textContent = portal.name;
        
        const facilities = portal.facilities || [];
        document.getElementById('shop-button').style.display = facilities.includes('shop') ? 'inline-block' : 'none';
        document.getElementById('blacksmith-button').style.display = facilities.includes('blacksmith') ? 'inline-block' : 'none';
        document.getElementById('association-button').style.display = facilities.includes('association') ? 'inline-block' : 'none';
    }


    // ==================================================================
    //  Battle Logic
    // ==================================================================
    function startBattle(terrain, bossId = null) {
        if (bossId) {
            currentEnemy = JSON.parse(JSON.stringify(bossDatabase[bossId]));
            playBgm('boss-bgm');
        } else {
            const possibleEnemies = enemyDatabase[terrain];
            currentEnemy = JSON.parse(JSON.stringify(possibleEnemies[Math.floor(Math.random() * possibleEnemies.length)]));
            playBgm('battle-bgm');
        }
        
        currentEnemy.hp = currentEnemy.stats.hp;
        currentEnemy.mp = currentEnemy.stats.mp;
        currentEnemy.auserleseUsed = false;
        
        battleLog = [`${currentEnemy.name}が現れた！`];
        updateBattleScreen();
        showScreen('battle-screen');
    }

    function updateBattleScreen() {
        document.getElementById('player-battle-name').textContent = player.name;
        document.getElementById('player-battle-hp').textContent = `HP: ${player.stats.hp} | MP: ${player.stats.mp}`;
        
        const enemySprite = document.getElementById('enemy-sprite');
        const enemySpriteImg = document.getElementById('enemy-sprite-img');

        if (currentEnemy.isBoss) {
            enemySprite.style.display = 'none';
            enemySpriteImg.style.display = 'block';
            enemySpriteImg.src = currentEnemy.image;
        } else {
            enemySprite.style.display = 'block';
            enemySpriteImg.style.display = 'none';
            enemySprite.textContent = currentEnemy.sprite;
        }

        document.getElementById('enemy-battle-name').textContent = currentEnemy.name;
        document.getElementById('enemy-battle-hp').textContent = `HP: ${currentEnemy.hp}`;
        document.getElementById('battle-log').innerHTML = battleLog.join('<br>');

        const actionsContainer = document.getElementById('battle-actions');
        actionsContainer.innerHTML = '';

        player.spells.forEach(spellName => {
            const spell = spellDatabase[spellName];
            if (spell.type === 'utility') return;
            
            const button = document.createElement('button');
            button.className = 'game-button';
            button.textContent = `${spell.name} (MP:${spell.cost})`;
            button.disabled = player.stats.mp < spell.cost;
            button.onclick = () => playerAction(spellName);
            actionsContainer.appendChild(button);
        });

        const runButton = document.createElement('button');
        runButton.className = 'game-button';
        runButton.textContent = '逃げる';
        runButton.disabled = currentEnemy.isBoss;
        runButton.onclick = () => playerAction('run');
        actionsContainer.appendChild(runButton);
    }

    const playerAction = (action) => {
        if (action === 'run') {
            battleLog.push(`${player.name}は逃げようと試みた。`);
            if (Math.random() < 0.25) {
                battleLog.push('うまく逃げ切れた！');
                updateBattleScreen();
                setTimeout(() => {
                    showScreen('main-game-screen');
                    addLog('戦闘から逃げ出した。', 'system');
                }, 1500);
            } else {
                battleLog.push('しかし、回り込まれてしまった！');
                document.getElementById('battle-actions').innerHTML = '';
                setTimeout(enemyAction, 1000);
                updateBattleScreen();
            }
            return;
        }

        const spell = spellDatabase[action];
        player.stats.mp -= spell.cost;

        if (spell.type === 'damage') {
            const damage = Math.max(1, Math.floor(getTotalAtk() * spell.power) - currentEnemy.stats.def);
            currentEnemy.hp = Math.max(0, currentEnemy.hp - damage);
            battleLog.push(`${player.name}は${spell.name}を唱えた！ ${damage}のダメージ。`);
        } else if (spell.type === 'heal') {
            const healAmount = spell.power;
            player.stats.hp = Math.min(player.stats.maxHp, player.stats.hp + healAmount);
            battleLog.push(`${player.name}は${spell.name}を唱えた！ HPが${healAmount}回復した。`);
        }

        if (currentEnemy.hp <= 0) {
            winBattle();
            return;
        }
        
        document.getElementById('battle-actions').innerHTML = '';
        setTimeout(enemyAction, 1000);
        updateBattleScreen();
    };

    function enemyAction() {
        if (currentEnemy.id === 'aura' && currentEnemy.hp <= 100 && !currentEnemy.auserleseUsed) {
            performAuserlese();
            return;
        }

        const ability = currentEnemy.abilities ? currentEnemy.abilities[Math.floor(Math.random() * currentEnemy.abilities.length)] : null;
        let damage = 0;
        let actionMessage = `${currentEnemy.name}の攻撃！`;
        
        if (ability && ability.type === 'damage') {
            if(ability.cost && currentEnemy.mp >= ability.cost) {
                currentEnemy.mp -= ability.cost;
                actionMessage = `${currentEnemy.name}は${ability.name}を放った！`;
            }
            damage = Math.max(1, Math.floor(currentEnemy.stats.atk * ability.power) - player.stats.def);
        } else {
             damage = Math.max(1, currentEnemy.stats.atk - player.stats.def);
        }

        player.stats.hp = Math.max(0, player.stats.hp - damage);
        battleLog.push(`${actionMessage} ${damage}のダメージを受けた。`);
        updateHUD();
        if (player.stats.hp <= 0) {
            loseBattle();
        } else {
            updateBattleScreen();
        }
    }
    
    function performAuserlese() {
        currentEnemy.auserleseUsed = true;
        battleLog.push("断頭台のアウラは服従させる魔法(アゼリューゼ)を唱えた！");
        battleLog.push("服従の天秤が魔力を測る…！");
        updateBattleScreen();

        setTimeout(() => {
            if (player.stats.mp >= currentEnemy.stats.mp) {
                battleLog.push("フリーレンの魔力の方が上回った！");
                battleLog.push("「…なぜ」断頭台のアウラは自害した。");
                currentEnemy.hp = 0;
                updateBattleScreen();
                setTimeout(winBattle, 1500);
            } else {
                battleLog.push("アウラの魔力が上回った…！フリーレンは操られてしまった。");
                player.stats.hp = 0;
                updateBattleScreen();
                setTimeout(loseBattle, 1500);
            }
        }, 2000);
    }

    function winBattle() {
        addLog(`${currentEnemy.name}を倒した！`, 'system');
        addLog(`${currentEnemy.exp}の経験値と${currentEnemy.gold}Gを手に入れた。`, 'system');
        player.exp += currentEnemy.exp;
        player.gold += currentEnemy.gold;
        
        if (currentEnemy.isBoss) {
            delete activeBosses[currentEnemy.id];
        }

        player.quests.forEach(quest => {
            const questData = questDatabase[quest.id];
            if (quest.progress < questData.objective.required && questData.objective.type === 'kill' && currentEnemy.name === questData.objective.target) {
                quest.progress++;
                addLog(`クエスト進捗: ${quest.progress}/${questData.objective.required}`, 'system');
            }
        });

        if (currentEnemy.drops) {
            currentEnemy.drops.forEach(drop => {
                if (Math.random() < drop.chance) {
                    addItemToInventory(drop.name, drop.quantity || 1);
                    addLog(`${drop.name}を手に入れた！`, 'item');
                }
            });
        }

        checkLevelUp();
        updateHUD();
        showScreen('main-game-screen');
    }
    
    function loseBattle() {
        battleLog.push('目の前が真っ暗になった...');
        updateBattleScreen();

        setTimeout(() => {
            player.stats.hp = player.stats.maxHp;
            player.stats.mp = player.stats.maxMp;
            addLog('しかし、不思議な力で完全に回復した！', 'system');
            updateHUD();
            showScreen('main-game-screen');
        }, 2000);
    }
    
    // ==================================================================
    //  Town Facilities
    // ==================================================================
    function useInn() {
        const cost = 10;
        if (player.gold >= cost) {
            player.gold -= cost;
            player.stats.hp = player.stats.maxHp;
            player.stats.mp = player.stats.maxMp;
            addLog(`宿屋に泊まり、HPとMPが全回復した。`, 'system');
            updateHUD();
        } else {
            addLog('お金が足りないようだ。', 'system');
        }
    }
    
    function openShop() {
        updateShop();
        showModal('shop-modal');
    }

    function updateShop() {
        const buyList = document.getElementById('shop-buy-list');
        buyList.innerHTML = '';
        Object.keys(weaponDatabase).forEach(key => {
            const weapon = weaponDatabase[key];
            const li = document.createElement('li');
            li.innerHTML = `<span>${key} (ATK ${weapon.atk}) - ${weapon.price}G</span>`;
            const buyButton = document.createElement('button');
            buyButton.textContent = '買う';
            buyButton.className = 'game-button small-button';
            buyButton.disabled = player.gold < weapon.price;
            buyButton.onclick = () => buyItem(key, 'weapon');
            li.appendChild(buyButton);
            buyList.appendChild(li);
        });

        const sellList = document.getElementById('shop-sell-list');
        sellList.innerHTML = '';
        player.inventory.forEach(item => {
            const itemData = itemDatabase[item.name];
            if (!itemData) return;

            const li = document.createElement('li');
            li.innerHTML = `<span>${item.name} x${item.quantity} - ${itemData.sellPrice}G</span>`;
            const sellButton = document.createElement('button');
            sellButton.textContent = '売る';
            sellButton.className = 'game-button small-button';
            sellButton.onclick = () => sellItem(item.name);
            li.appendChild(sellButton);
            sellList.appendChild(li);
        });
        if(player.inventory.length === 0) sellList.innerHTML = '<li>売るものがない</li>';
    }

    function buyItem(itemName, itemType) {
        if (itemType === 'weapon') {
            const weapon = weaponDatabase[itemName];
            if (player.gold >= weapon.price) {
                player.gold -= weapon.price;
                player.equipment.weapon = { name: itemName, atk: weapon.atk, level: 1};
                addLog(`${itemName}を購入し、装備した。`, 'item');
                updateShop();
            }
        }
    }

    function sellItem(itemName) {
        const itemData = itemDatabase[itemName];
        const itemInInventory = player.inventory.find(i => i.name === itemName);
        if (itemData && itemInInventory) {
            player.gold += itemData.sellPrice;
            itemInInventory.quantity--;
            if (itemInInventory.quantity <= 0) {
                player.inventory = player.inventory.filter(i => i.name !== itemName);
            }
            addLog(`${itemName}を売却した。`, 'item');
            updateShop();
        }
    }
    
    function openBlacksmith() {
        updateBlacksmith();
        showModal('blacksmith-modal');
    }

    function updateBlacksmith() {
        const weapon = player.equipment.weapon;
        const upgradeCost = 50 * Math.pow(weapon.level, 2);
        const materialCost = weapon.level;
        const info = document.getElementById('blacksmith-info');
        info.innerHTML = `
            <p>現在の杖: ${weapon.name} +${weapon.level} (ATK: ${weapon.atk})</p>
            <p>次のレベル: +${weapon.level + 1}</p>
            <p>費用: ${upgradeCost}G</p>
            <p>必要な素材: 魔石 x${materialCost}</p>
        `;
        document.getElementById('upgrade-button').onclick = () => upgradeWeapon(upgradeCost, materialCost);
    }
    
    function upgradeWeapon(goldCost, materialCost) {
        const material = player.inventory.find(i => i.name === '魔石');
        if (player.gold >= goldCost && material && material.quantity >= materialCost) {
            player.gold -= goldCost;
            material.quantity -= materialCost;
            if (material.quantity <= 0) {
                player.inventory = player.inventory.filter(i => i.name !== '魔石');
            }
            player.equipment.weapon.level++;
            player.equipment.weapon.atk += Math.floor(weaponDatabase[player.equipment.weapon.name].atk * 0.2 * player.equipment.weapon.level);
            addLog(`${player.equipment.weapon.name}を強化した！`, 'system');
            updateBlacksmith();
        } else {
            addLog('お金か素材が足りないようだ。', 'system');
        }
    }


    // ==================================================================
    //  Other Systems (Chests, Spells, Quests)
    // ==================================================================
    function openChest(y, x) {
        const chest = mapDatabase[player.currentMap].chests[`${y}-${x}`];
        if (!chest || chest.opened) {
            addLog('この宝箱は空だ。', 'system');
            return;
        };
        
        const content = chest.content;
        if (content.type === 'mimic') {
            addLog('宝箱はミミックだった！', 'battle');
            chest.opened = true;
            drawMap();
            startBattle('mimic');
            return;
        }

        chest.opened = true;
        if (content.type === 'item') {
            if (content.name === '金貨') {
                player.gold += content.quantity;
                addLog(`宝箱を開けた！ ${content.quantity}Gを見つけた。`, 'item');
            } else {
                addItemToInventory(content.name, content.quantity);
                addLog(`宝箱を開けた！ ${content.name}を${content.quantity}個見つけた。`, 'item');
            }
        } else if (content.type === 'spell') {
            addLog(`宝箱を開けた！ 「${content.name}」の巻物を見つけた。`, 'item');
            learnSpell(content.name);
        }
        
        drawMap();
        updateHUD();
    }
    
    function learnSpell(spellName) {
        if (!player.spells.includes(spellName)) {
            player.spells.push(spellName);
            addLog(`新たな魔法、${spellName}を覚えた！`, 'system');
        } else {
            addLog('すでにその魔法は知っているようだ。', 'system');
        }
    }
    
    function castUtilitySpell(spellName) {
        const spell = spellDatabase[spellName];
        if (player.stats.mp < spell.cost) {
            addLog("MPが足りない！", 'system');
            showScreen('main-game-screen');
            return;
        }
        player.stats.mp -= spell.cost;
        addLog(`${spell.name}を唱えた。`, 'system');

        if (spell.effect === 'create_flowers') {
            temporaryMapChanges[`${player.y}-${player.x}`] = { type: 'flower_garden' };
        }
        if (spell.effect === 'appraise_chest') {
            let foundChest = false;
            const directions = [{ x: 0, y: -1, name: '北' }, { x: 0, y: 1, name: '南' }, { x: -1, y: 0, name: '西' }, { x: 1, y: 0, name: '東' }];

            for (const dir of directions) {
                const targetX = player.x + dir.x;
                const targetY = player.y + dir.y;

                if (targetY >= 0 && targetY < mapSize && targetX >= 0 && targetX < mapSize) {
                    const currentMapData = mapDatabase[player.currentMap];
                    const tileCode = currentMapData.layout[targetY][targetX];

                    if (tileCode === 'B') {
                        foundChest = true;
                        const chest = currentMapData.chests[`${targetY}-${targetX}`];
                        if (!chest || chest.opened) addLog(`${dir.name}にある宝箱は空のようだ。`, "system");
                        else if (chest.content.type === 'mimic') {
                            if (Math.random() < 0.99) addLog(`【${dir.name}】強大な魔力を感じる…これはミミックだ！`, "system");
                            else addLog(`【${dir.name}】これは本物の宝箱のようだ…？`, "system");
                        } else {
                             addLog(`【${dir.name}】これは本物の宝箱のようだ。`, "system");
                        }
                    }
                }
            }
            if (!foundChest) addLog("周囲に鑑定できる宝箱はない。", "system");
        }
        
        updateHUD();
        drawMap();
        showScreen('main-game-screen');
    }

    function handleExamInteraction() {
        const dialogue = document.getElementById('examiner-dialogue');
        const quest = player.quests.find(q => q.id === 'exam1');

        if (quest) {
            const questData = questDatabase[quest.id];
            if (quest.progress >= questData.objective.required) {
                dialogue.textContent = "試験官: 「見事だ。約束通り、これを授けよう。」";
                const reward = questData.reward;
                if (reward.type === 'spell') {
                    learnSpell(reward.name);
                }
                player.quests = player.quests.filter(q => q.id !== 'exam1');
            } else {
                dialogue.textContent = `${questData.description} (現在 ${quest.progress}/${questData.objective.required} 体)`;
            }
        } else {
            const questData = questDatabase["exam1"];
            dialogue.textContent = questData.description;
            player.quests.push({ id: 'exam1', progress: 0 });
        }
    }


    function addItemToInventory(itemName, quantity) {
        const existingItem = player.inventory.find(item => item.name === itemName);
        if (existingItem) existingItem.quantity += quantity;
        else player.inventory.push({ name: itemName, quantity });
    }

    function checkLevelUp() {
        if (player.exp >= player.nextLevelExp) {
            player.level++;
            player.exp -= player.nextLevelExp;
            player.nextLevelExp = Math.floor(player.nextLevelExp * 1.5);
            player.stats.maxHp += 15;
            player.stats.maxMp += 10;
            player.stats.baseAtk += 2;
            player.stats.def += 3;
            player.stats.hp = player.stats.maxHp;
            player.stats.mp = player.stats.maxMp;
            addLog(`レベルアップして${player.level}になった！`, 'system');
        }
    }
    
    // ==================================================================
    //  Button Event Listeners
    // ==================================================================
    document.getElementById('status-button').addEventListener('click', () => showScreen('status-screen'));
    document.getElementById('inventory-button').addEventListener('click', () => showScreen('inventory-screen'));
    document.getElementById('spellbook-button').addEventListener('click', () => showScreen('spellbook-screen'));
    document.getElementById('quest-log-button').addEventListener('click', () => showScreen('quest-log-screen'));
    document.getElementById('status-close-button').addEventListener('click', () => showScreen('main-game-screen'));
    document.getElementById('inventory-close-button').addEventListener('click', () => showScreen('main-game-screen'));
    document.getElementById('spellbook-close-button').addEventListener('click', () => showScreen('main-game-screen'));
    document.getElementById('quest-log-close-button').addEventListener('click', () => showScreen('main-game-screen'));
    document.getElementById('dialogue-close-button').addEventListener('click', () => showModal('dialogue-modal', false));
    document.getElementById('inn-button').addEventListener('click', useInn);
    document.getElementById('town-exit-button').addEventListener('click', () => showScreen('main-game-screen'));
    document.getElementById('association-button').addEventListener('click', () => showScreen('magic-association-screen'));
    document.getElementById('association-exit-button').addEventListener('click', () => showScreen('town-screen'));
    document.getElementById('exam-button').addEventListener('click', handleExamInteraction);
    document.getElementById('shop-button').addEventListener('click', openShop);
    document.getElementById('shop-close-button').addEventListener('click', () => showModal('shop-modal', false));
    document.getElementById('blacksmith-button').addEventListener('click', openBlacksmith);
    document.getElementById('blacksmith-close-button').addEventListener('click', () => showModal('blacksmith-modal', false));

});

