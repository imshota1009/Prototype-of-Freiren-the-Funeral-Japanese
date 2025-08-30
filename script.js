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
    let activeEnemies = []; // Replaces activeBoss
    let audioInitialized = false;

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
    
    const enemyDatabase = {
        forest: [
            { name: "スライム", sprite: "💧", stats: { hp: 40, atk: 10, def: 5 }, exp: 25, gold: 10, drops: [{ name: "魔石", chance: 0.5 }] },
            { name: "レッドスライム", sprite: "🩸", stats: { hp: 70, atk: 10, def: 5 }, exp: 75, gold: 150, drops: [{ name: "魔石", chance: 0.5 }] },
            { name: "ワイバーン", sprite: "🐲", stats: { hp: 150, atk: 25, def: 5 }, exp: 250, gold: 120, drops: [{ name: "魔石", chance: 0.5 }] },
            { name: "ゴブリン", sprite: "🧌", stats: { hp: 60, atk: 14, def: 8 }, exp: 40, gold: 20, drops: [{ name: "薬草", chance: 0.3 }] }
        ],
        plains: [
            { name: "コウモリ", sprite: "🦇", stats: { hp: 30, atk: 12, def: 3 }, exp: 20, gold: 8, drops: [] }
        ],
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
            { name: "サソリ", sprite: "🦂", stats: { hp: 80, atk: 25, def: 10 }, exp: 75, gold: 45, drops: [{ name: "解毒薬", chance: 0.5 }] }
        ],
        ruins: [
            { name: "ストーンゴーレム", sprite: "🗿", stats: { hp: 200, atk: 30, def: 25 }, exp: 150, gold: 100, drops: [{ name: "古代のコイン", chance: 0.2 }] },
            { name: "亡霊", sprite: "👻", stats: { hp: 120, atk: 35, def: 15 }, exp: 120, gold: 80, drops: [] }
        ],
        castle: [
            { name: "操られた衛兵", sprite: "💂", stats: { hp: 180, atk: 40, def: 25 }, exp: 120, gold: 80, drops: [{ name: "魔石", chance: 0.2 }] }
        ],
        mimic: [
             { name: "ミミック", sprite: "🎁", stats: { hp: 150, atk: 25, def: 20 }, exp: 100, gold: 150, drops: [{ name: "金貨", quantity: 100, chance: 1.0 }] }
        ]
    };

    const bossDatabase = {
        "aura": {
            name: "断頭台のアウラ",
            sprite: "😈",
            image: "aura_battle.png",
            stats: { hp: 2000, mp: 1000, atk: 40, def: 30 },
            exp: 100, gold: 500,
            special: "アゼリューゼ",
            actions: [
                { name: "断頭吏の斬撃", type: "physical", power: 1.1 },
                { name: "闇の波動", type: "magic", power: 2.3 },
                { name: "魂の葬送", type: "magic", power: 2.5 },
                { name: "精神支配の鞭", type: "physical", power: 1.2 }
            ]
        }
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
    const bgmElements = {
        title: document.getElementById('title-bgm'),
        map: document.getElementById('map-bgm'),
        battle: document.getElementById('battle-bgm'),
        boss: document.getElementById('boss-bgm'),
    };

    // ==================================================================
    //  BGM Control
    // ==================================================================
    function initializeAudio() {
        if (audioInitialized) return;
        Object.values(bgmElements).forEach(bgm => {
            bgm.volume = 0.5;
        });
        playBgm('title');
        audioInitialized = true;
    }

    function playBgm(track) {
        if (!audioInitialized) return;
        Object.values(bgmElements).forEach(bgm => bgm.pause());
        if (bgmElements[track]) {
            bgmElements[track].currentTime = 0;
            bgmElements[track].play().catch(e => console.error("Audio play failed:", e));
        }
    }


    // ==================================================================
    //  Screen Transition & Modals
    // ==================================================================
    const showScreen = (screenId) => {
        let isMenuScreen = false;
        screens.forEach(screen => {
            const isActive = screen.id === screenId;
            screen.classList.toggle('active', isActive);
            if(isActive && screen.classList.contains('menu-screen')) {
                isMenuScreen = true;
            }
        });

        if (screenId === 'main-game-screen') playBgm('map');
        else if (isMenuScreen || screenId === 'splash-screen' || screenId === 'character-creation-screen') playBgm('title');
        
        if (screenId === 'status-screen') updateStatusScreen();
        if (screenId === 'inventory-screen') updateInventoryScreen();
        if (screenId === 'spellbook-screen') updateSpellbookScreen();
        if (screenId === 'town-screen') updateTownScreen();
        if (screenId === 'quest-log-screen') updateQuestLogScreen();
    };

    const showModal = (modalId, show = true) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.toggle('active', show);
        }
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
        if (!audioInitialized) {
            initializeAudio();
        }
        showScreen('character-creation-screen');
    });

    document.getElementById('complete-creation-button').addEventListener('click', () => {
        const name = document.getElementById('player-name').value || "フリーレン";
        player = {
            name, race: 'elf', pClass: 'mage',
            level: 1, exp: 0, nextLevelExp: 100,
            x: 0, y: 0, currentMap: 'northernForest',
            gold: 50,
            equipment: {
                weapon: { name: "見習いの杖", atk: 5, level: 1 }
            },
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
    //  Map Logic
    // ==================================================================
    function loadMap(mapId, targetX, targetY) {
        const mapData = mapDatabase[mapId];
        if (!mapData) return;

        player.currentMap = mapId;
        temporaryMapChanges = {};
        mapSize = mapData.layout.length;
        gameMap.length = 0;
        mapContainer.innerHTML = '';
        mapContainer.style.gridTemplateColumns = `repeat(${mapSize}, 1fr)`;
        mapContainer.style.gridTemplateRows = `repeat(${mapSize}, 1fr)`;

        for (let y = 0; y < mapSize; y++) {
            gameMap[y] = [];
            for (let x = 0; x < mapSize; x++) {
                const tileCode = mapData.layout[y][x];
                let type = 'floor';
                 if ('fpT'.includes(tileCode)) type = {f: 'forest', p: 'plains', T: 'town'}[tileCode];
                if ('CwE'.includes(tileCode)) type = {C: 'cave_entrance', w: 'wall', E: 'cave_exit'}[tileCode];
                if ('sS'.includes(tileCode)) type = {s: 'snow', S: 'snow_portal'}[tileCode];
                if ('dAo'.includes(tileCode)) type = {d: 'desert', A: 'association_city', o: 'oasis'}[tileCode];
                if ('RX'.includes(tileCode)) type = {R: 'ruins', X: 'boss_portal'}[tileCode];
                if ('MDUo'.includes(tileCode)) type = {M: 'forest_portal', o: 'stairs_down', U: 'stairs_up', D: 'ruins_portal_down'}[tileCode];
                if (tileCode === 'B') type = 'chest';
                if (tileCode === 'V') type = 'village_entrance';
                if ('gH'.includes(tileCode)) type = {g: 'grass_village', H: 'house'}[tileCode];
                if (tileCode === 'k') type = 'fog';
                
                gameMap[y][x] = { type };
                const tileEl = document.createElement('div');
                tileEl.classList.add('map-tile');
                tileEl.id = `tile-${x}-${y}`;
                mapContainer.appendChild(tileEl);
            }
        }
        player.x = targetX !== undefined ? targetX : mapData.startPosition.x;
        player.y = targetY !== undefined ? targetY : mapData.startPosition.y;
        
        // Spawn wandering enemies
        activeEnemies = [];
        if (mapData.enemyCount > 0) {
            for (let i = 0; i < mapData.enemyCount; i++) {
                let enemyX, enemyY;
                do {
                    enemyX = Math.floor(Math.random() * mapSize);
                    enemyY = Math.floor(Math.random() * mapSize);
                } while (mapData.layout[enemyY][enemyX] !== ' ');

                const enemyData = JSON.parse(JSON.stringify(enemyDatabase[mapData.terrainType][0]));
                activeEnemies.push({
                    id: `e${i}`,
                    x: enemyX, y: enemyY,
                    data: enemyData
                });
            }
        }

        drawMap();
    }

    function drawMap() {
        const currentMapData = mapDatabase[player.currentMap];
        const npcs = currentMapData.npcs || {};

        for (let y = 0; y < mapSize; y++) {
            for (let x = 0; x < mapSize; x++) {
                const tileEl = document.getElementById(`tile-${x}-${y}`);
                const tileData = gameMap[y][x];
                tileEl.innerHTML = '';
                tileEl.classList.remove('player-tile');
                let symbol = '', color = '#fff', bgColor = '#000';
                
                const tempChange = temporaryMapChanges[`${y}-${x}`];
                if (tempChange && tempChange.type === 'flower_garden') {
                     symbol = '🌼'; color = '#FFB6C1';
                } else {
                    switch(tileData.type) {
                        case 'forest': symbol = '🌳'; color = '#228B22'; break;
                        case 'plains': symbol = '🌾'; color = '#90EE90'; break;
                        case 'town': case 'association_city': symbol = '🏰'; color = '#D3D3D3'; break;
                        case 'cave_entrance': symbol = '🕳️'; color = '#654321'; break;
                        case 'wall': bgColor = '#333'; break;
                        case 'floor': bgColor = '#666'; break;
                        case 'cave_exit': symbol = '⬆️'; color = '#fff'; bgColor = '#666'; break;
                        case 'snow': symbol = '❄️'; color = '#ADD8E6'; break;
                        case 'desert': symbol = '🏜️'; color = '#EDC9AF'; break;
                        case 'ruins': symbol = '🏛️'; color = '#888'; break;
                        case 'oasis': symbol = '💧'; color = '#4682B4'; break;
                        case 'snow_portal': case 'forest_portal': case 'ruins_portal': case 'boss_portal': case 'ruins_portal_down': symbol = '🌀'; color = '#fff'; break;
                        case 'stairs_up': symbol = '⬆️'; color = '#FFD700'; break;
                        case 'stairs_down': symbol = '⬇️'; color = '#FFD700'; break;
                        case 'village_entrance': symbol = '🏘️'; color = '#8B4513'; break;
                        case 'grass_village': symbol = '🌿'; color = '#3CB371'; break;
                        case 'house': symbol = '🏠'; color = '#A0522D'; break;
                        case 'fog': symbol = '💨'; color = '#B0C4DE'; break;
                        case 'chest':
                            const chestState = currentMapData.chests[`${y}-${x}`];
                            symbol = chestState && !chestState.opened ? '🎁' : '📦';
                            color = '#FFD700';
                            break;
                    }
                }
                
                const npc = npcs[`${y}-${x}`];
                if (npc) {
                    // Special case for Aura on her throne
                    if(npc.id === 'aura') symbol = '👑';
                    else symbol = npc.sprite;
                }

                tileEl.textContent = symbol;
                tileEl.style.color = color;
                tileEl.style.backgroundColor = bgColor;
            }
        }
        
        // Draw wandering enemies
        activeEnemies.forEach(enemy => {
             const enemyTile = document.getElementById(`tile-${enemy.x}-${enemy.y}`);
             if(enemyTile) enemyTile.textContent = enemy.data.sprite;
        });

        const playerTile = document.getElementById(`tile-${player.x}-${player.y}`);
        if(playerTile) {
            if(!temporaryMapChanges[`${player.y}-${player.x}`]) {
                 playerTile.textContent = '🧙';
            }
            playerTile.classList.add('player-tile');
        }
    }
    
    // Wandering enemies movement
    setInterval(() => {
        if (activeEnemies.length > 0 && document.querySelector('#main-game-screen.active')) {
            activeEnemies.forEach(enemy => {
                const directions = [{x:0, y:-1}, {x:0, y:1}, {x:-1, y:0}, {x:1, y:0}];
                const dir = directions[Math.floor(Math.random() * 4)];
                const newX = enemy.x + dir.x;
                const newY = enemy.y + dir.y;

                const targetTile = gameMap[newY] && gameMap[newY][newX];
                if (targetTile && targetTile.type === 'floor') {
                    enemy.x = newX;
                    enemy.y = newY;
                }
            });
            drawMap();
            checkEnemyCollision();
        }
    }, 1500);

    window.addEventListener('keydown', (e) => {
        if (document.querySelector('#main-game-screen.active')) {
            let newX = player.x, newY = player.y;
            if (e.key === 'ArrowUp') newY--;
            if (e.key === 'ArrowDown') newY++;
            if (e.key === 'ArrowLeft') newX--;
            if (e.key === 'ArrowRight') newX++;
            if (e.key === 'Enter') {
                interact();
                return;
            }
            
            const targetTile = gameMap[newY] && gameMap[newY][newX];
            if (targetTile && targetTile.type === 'fog') {
                addLog('霧が濃くて出られないようだ...', 'system');
                return;
            }

            const isNpc = mapDatabase[player.currentMap].npcs && mapDatabase[player.currentMap].npcs[`${newY}-${newX}`];
            if (targetTile && targetTile.type !== 'wall' && !isNpc) {
                delete temporaryMapChanges[`${player.y}-${player.x}`];
                player.x = newX;
                player.y = newY;
                drawMap();
                if (!checkEnemyCollision()) {
                    checkTileEvent();
                }
            }
        }
    });

    function checkEnemyCollision() {
        const enemyOnTile = activeEnemies.find(e => e.x === player.x && e.y === player.y);
        if (enemyOnTile) {
            startBattle('mobile', enemyOnTile);
            return true;
        }
        return false;
    }

    function checkTileEvent() {
        const currentMapData = mapDatabase[player.currentMap];
        const tileCode = currentMapData.layout[player.y][player.x];
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
            if (chest && !chest.opened) {
                openChest(player.y, player.x);
            }
        } else {
            const terrain = currentMapData.terrainType;
            if (terrain && tileCode !== 'o' && terrain !== 'village' && terrain !== 'castle' && terrain !== 'boss') {
                const encounterRate = { forest: 0.2, plains: 0.1, cave: 0.3, snow: 0.25, desert: 0.15, ruins: 0.28 }[terrain] || 0;
                if (Math.random() < encounterRate) {
                    startBattle(terrain);
                }
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

        player.quests.forEach(questState => {
            const questData = questDatabase[questState.id];
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${questData.title}</strong>
                <p>${questData.description}</p>
                <p>進捗: ${questState.progress} / ${questData.objective.required}</p>
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
    function startBattle(terrain, specificEnemy = null) {
        if (specificEnemy && specificEnemy.id === 'aura') {
            currentEnemy = JSON.parse(JSON.stringify(bossDatabase.aura));
            playBgm('boss');
        } else if (specificEnemy) {
            currentEnemy = JSON.parse(JSON.stringify(specificEnemy.data));
            currentEnemy.mobileId = specificEnemy.id; // Keep track of which one to remove
            playBgm('battle');
        } else {
            const possibleEnemies = enemyDatabase[terrain];
            currentEnemy = JSON.parse(JSON.stringify(possibleEnemies[Math.floor(Math.random() * possibleEnemies.length)]));
            playBgm('battle');
        }
        
        currentEnemy.hp = currentEnemy.stats.hp;
        battleLog = [`${currentEnemy.name}が現れた！`];
        updateBattleScreen();
        showScreen('battle-screen');
    }

    function updateBattleScreen() {
        document.getElementById('player-battle-name').textContent = player.name;
        document.getElementById('player-battle-hp').textContent = `HP: ${player.stats.hp} | MP: ${player.stats.mp}`;
        
        const enemySpriteEl = document.getElementById('enemy-sprite');
        const enemySpriteImgEl = document.getElementById('enemy-sprite-img');

        if (currentEnemy.image) {
            enemySpriteEl.style.display = 'none';
            enemySpriteImgEl.style.display = 'block';
            enemySpriteImgEl.src = currentEnemy.image;
        } else {
            enemySpriteEl.style.display = 'block';
            enemySpriteImgEl.style.display = 'none';
            enemySpriteEl.textContent = currentEnemy.sprite;
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
        runButton.disabled = !!currentEnemy.special; // Can't run from bosses
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
        if(currentEnemy.special === "アゼリューゼ" && currentEnemy.hp <= 100) {
            battleLog.push(`${currentEnemy.name}は服従させる魔法(アゼリューゼ)を唱えた！`);
            battleLog.push("服従の天秤が、両者の魔力量を測る…！");
            updateBattleScreen();

            setTimeout(() => {
                if (player.stats.mp > currentEnemy.stats.mp) {
                    battleLog.push(`「私の魂を天秤を載せたな」`);
                    battleLog.push(`「お前は私の魔力を見誤ったんだ」`);
                    battleLog.push(`「ふ、ふざけるな..私は500年以上生きた大魔族だ」`);
                    battleLog.push(`「アウラ、お前の前にいるのは、千年以上生きた魔法使いだ」`);
                    battleLog.push(`天秤は${player.name}に傾いた！`);
                    battleLog.push(`「アウラ、自害しろ」`);
                    battleLog.push(`「馬鹿な…この私が…」`);
                    currentEnemy.hp = 0;
                    winBattle();
                } else {
                    battleLog.push(`天秤は${currentEnemy.name}に傾いた！`);
                    battleLog.push("アウラはフリーレンを自害させた。");
                    player.stats.hp = 0;
                    loseBattle();
                }
            }, 2000);
            return;
        }

        let damage = 0;
        let actionName = "攻撃";

        if (currentEnemy.actions && currentEnemy.actions.length > 0) {
            const action = currentEnemy.actions[Math.floor(Math.random() * currentEnemy.actions.length)];
            actionName = action.name;
            damage = Math.max(1, Math.floor(currentEnemy.stats.atk * action.power) - player.stats.def);
        } else {
            damage = Math.max(1, currentEnemy.stats.atk - player.stats.def);
        }
        
        player.stats.hp = Math.max(0, player.stats.hp - damage);
        battleLog.push(`${currentEnemy.name}の${actionName}！ ${damage}のダメージを受けた。`);
        updateHUD();
        if (player.stats.hp <= 0) {
            loseBattle();
        } else {
            updateBattleScreen();
        }
    }
    
    function winBattle() {
        addLog(`${currentEnemy.name}を倒した！`, 'system');
        addLog(`${currentEnemy.exp}の経験値と${currentEnemy.gold}Gを手に入れた。`, 'system');
        player.exp += currentEnemy.exp;
        player.gold += currentEnemy.gold;
        
        player.quests.forEach(quest => {
            if (quest.objective.type === 'kill' && currentEnemy.name === quest.objective.target) {
                quest.progress++;
                addLog(`クエスト進捗: ${quest.progress}/${quest.objective.required}`, 'system');
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
        
        if (currentEnemy.mobileId) {
            activeEnemies = activeEnemies.filter(e => e.id !== currentEnemy.mobileId);
        }

        checkLevelUp();
        updateHUD();
        showScreen('main-game-screen');
        drawMap(); // Redraw map to remove defeated enemy
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
        // Buy List
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

        // Sell List
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
    //  Other Systems (Chests, Spells, Quests, NPCs)
    // ==================================================================
    function interact() {
        const directions = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];
        const npcs = mapDatabase[player.currentMap].npcs || {};
        
        for (const dir of directions) {
            const targetX = player.x + dir.x;
            const targetY = player.y + dir.y;
            const npc = npcs[`${targetY}-${targetX}`];
            if (npc) {
                if (npc.id === 'aura') {
                    showDialogue(npc.dialog);
                    // This is a special interaction that leads to a fight
                    document.getElementById('dialogue-close-button').onclick = () => {
                        showModal('dialogue-modal', false);
                        startBattle('boss', {id: 'aura'});
                         // Reset the onclick so it doesn't trigger for other dialogues
                        document.getElementById('dialogue-close-button').onclick = () => showModal('dialogue-modal', false);
                    };
                } else {
                    showDialogue(npc.dialog);
                }
                return;
            }
        }
    }

    function showDialogue(text) {
        document.getElementById('dialogue-text').textContent = text;
        showModal('dialogue-modal');
    }

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
            addLog(`新たな魔法、「${spellName}」を覚えた！`, 'system');
        } else {
            addLog('すでにその魔法は知っているようだ。', 'system');
        }
    }
    
    function castUtilitySpell(spellName) {
        const spell = spellDatabase[spellName];
        if (player.stats.mp < spell.cost) {
            addLog("MPが足りない！", 'system');
            return;
        }
        player.stats.mp -= spell.cost;
        addLog(`${spell.name}を唱えた。`, 'system');

        if (spell.effect === 'create_flowers') {
            temporaryMapChanges[`${player.y}-${player.x}`] = { type: 'flower_garden' };
            drawMap();
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
                        if (!chest || chest.opened) addLog(`【${dir.name}】宝箱は空のようだ。`, "system");
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
        updateSpellbookScreen();
        // Don't close the spellbook screen
    }

    function handleExamInteraction() {
        const dialogue = document.getElementById('examiner-dialogue');
        const currentQuest = player.quests.find(q => q.id === 'exam1');

        if (currentQuest) {
            const questData = questDatabase[currentQuest.id];
            if (currentQuest.progress >= questData.objective.required) {
                dialogue.textContent = "試験官: 「見事だ。約束通り、これを授けよう。」";
                const reward = questData.reward;
                if (reward.type === 'spell') {
                    learnSpell(reward.name);
                }
                player.quests = player.quests.filter(q => q.id !== 'exam1');
            } else {
                dialogue.textContent = `${questData.description} (現在 ${currentQuest.progress}/${questData.objective.required} 体)`;
            }
        } else {
            const questData = questDatabase["exam1"];
            dialogue.textContent = questData.description;
            player.quests.push({ id: 'exam1', progress: 0, objective: questData.objective });
            addLog("新たなクエストを受けた。", "system");
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
            player.stats.maxHp += 70;
            player.stats.maxMp += 150;
            player.stats.baseAtk += 12;
            player.stats.def += 10;
            player.stats.hp = player.stats.maxHp;
            player.stats.mp = player.stats.maxMp;
            addLog(`レベルアップして${player.level}になった！`, 'system');
        }
    }
    
    // ==================================================================
    //  Button Event Listeners
    // ==================================================================
    document.getElementById('start-creation-button').addEventListener('click', () => {
        if (!audioInitialized) {
            initializeAudio();
        }
        showScreen('character-creation-screen');
    });
    
    document.getElementById('status-button').addEventListener('click', () => showScreen('status-screen'));
    document.getElementById('inventory-button').addEventListener('click', () => showScreen('inventory-screen'));
    document.getElementById('spellbook-button').addEventListener('click', () => showScreen('spellbook-screen'));
    document.getElementById('quest-log-button').addEventListener('click', () => showScreen('quest-log-screen'));

    document.getElementById('status-close-button').addEventListener('click', () => showScreen('main-game-screen'));
    document.getElementById('inventory-close-button').addEventListener('click', () => showScreen('main-game-screen'));
    document.getElementById('spellbook-close-button').addEventListener('click', () => showScreen('main-game-screen'));
    document.getElementById('quest-log-close-button').addEventListener('click', () => showScreen('main-game-screen'));

    document.getElementById('inn-button').addEventListener('click', useInn);
    document.getElementById('town-exit-button').addEventListener('click', () => showScreen('main-game-screen'));
    document.getElementById('association-button').addEventListener('click', () => showScreen('magic-association-screen'));
    document.getElementById('association-exit-button').addEventListener('click', () => showScreen('town-screen'));
    document.getElementById('exam-button').addEventListener('click', handleExamInteraction);
    document.getElementById('shop-button').addEventListener('click', openShop);
    document.getElementById('shop-close-button').addEventListener('click', () => showModal('shop-modal', false));
    document.getElementById('blacksmith-button').addEventListener('click', openBlacksmith);
    document.getElementById('blacksmith-close-button').addEventListener('click', () => showModal('blacksmith-modal', false));
    document.getElementById('dialogue-close-button').addEventListener('click', () => showModal('dialogue-modal', false));

});





