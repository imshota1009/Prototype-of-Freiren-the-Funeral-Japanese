// ==================================================================
//  Map Database
// ==================================================================
// TILE KEY:
// f: Forest, p: Plains, s: Snow, d: Desert, R: Ruins, g: grass_village, k: Fog
// T: Town, C: Cave, A: Association, V: Village Entrance
// w: Wall, ' ': Floor, B: Chest, H: House
// Portals: S, M, D(esert), U(p), o(D)own, X (Snow, Forest, Desert, Up, Down, Boss Exit)
// NPCs: 1, 2, 3... / Special: A(ura)
// ==================================================================

const mapDatabase = {
    "northernForest": {
        name: "北の森",
        terrainType: "forest",
        layout: [
            ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
            ['f', 'p', 'p', 'p', 'B', 'f', 'f', 'f', 'f', 'p', 'p', 'p', 'p', 'p', 'f'],
            ['f', 'p', 'p', 'p', 'p', 'p', 'f', 'f', 'p', 'p', 'p', 'V', 'p', 'p', 'f'],
            ['f', 'p', 'p', 'T', 'p', 'p', 'f', 'p', 'p', 'p', 'B', 'f', 'f', 'p', 'f'],
            ['f', 'f', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'f', 'f', 'f', 'p', 'f'],
            ['f', 'f', 'f', 'f', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'f'],
            ['f', 'f', 'B', 'f', 'f', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'f', 'f', 'f'],
            ['f', 'f', 'f', 'f', 'f', 'f', 'p', 'p', 'p', 'f', 'f', 'p', 'f', 'f', 'f'],
            ['f', 'f', 'f', 'f', 'f', 'f', 'p', 'p', 'p', 'f', 'f', 'p', 'C', 'p', 'f'],
            ['f', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'f'],
            ['f', 'p', 'p', 'p', 'p', 'p', 'f', 'f', 'f', 'p', 'p', 'B', 'p', 'p', 'f'],
            ['f', 'p', 'f', 'f', 'f', 'p', 'p', 'p', 'p', 'p', 'f', 'f', 'f', 'p', 'f'],
            ['f', 'p', 'p', 'p', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'p', 'p', 'p', 'f'],
            ['f', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'f'],
            ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],
        ],
        startPosition: { x: 7, y: 13 },
        portals: {
            'S': { targetMap: 'snowyPlains', targetX: 7, targetY: 13 },
            'D': { targetMap: 'southernDesert', targetX: 7, targetY: 1 },
            'C': { targetMap: 'goblinCave', targetX: 1, targetY: 13 },
            'V': { targetMap: 'villageOutskirts', targetX: 7, targetY: 13 },
            'T': { isTown: true, name: "聖都シュトラール", facilities: ["inn", "shop", "blacksmith"] }
        },
        chests: {
            '1-4':  { opened: false, content: { type: 'item', name: '薬草', quantity: 2 } },
            '3-10': { opened: false, content: { type: 'spell', name: '火の魔法' } },
            '6-2':  { opened: false, content: { type: 'mimic' } },
            '10-11':{ opened: false, content: { type: 'item', name: '金貨', quantity: 150 } },
        }
    },
    "villageOutskirts": {
        name: "リーゲル峡谷の村",
        terrainType: "village",
        layout: [
            ['f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f'],
            ['f', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'f'],
            ['f', 'g', 'H', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'H', 'g', 'H', 'g', 'f'],
            ['f', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'f'],
            ['f', 'g', 'g', 'g', 'g', 'p', 'p', 'p', 'p', 'p', 'g', 'g', 'g', 'g', 'f'],
            ['f', 'g', 'H', 'g', 'p', 'p', '1', 'p', 'p', 'p', 'p', 'g', 'H', 'g', 'f'],
            ['f', 'g', 'g', 'g', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'g', 'g', 'g', 'f'],
            ['f', 'g', 'g', 'g', 'p', 'p', 'p', 'T', 'p', 'p', 'p', 'g', 'g', 'g', 'f'],
            ['f', 'g', 'g', 'g', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'g', '2', 'g', 'f'],
            ['f', 'g', 'H', 'g', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'g', 'H', 'g', 'f'],
            ['f', 'g', 'g', 'g', 'g', 'p', 'p', 'p', 'p', 'p', 'g', 'g', 'g', 'g', 'f'],
            ['f', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'f'],
            ['f', 'g', 'H', 'g', 'g', 'H', 'g', '3', 'g', 'H', 'g', 'g', 'H', 'g', 'f'],
            ['f', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'f'],
            ['f', 'f', 'f', 'f', 'f', 'f', 'f', 'M', 'f', 'f', 'f', 'f', 'f', 'f', 'f'],
        ],
        portals: {
            'M': { targetMap: 'northernForest', targetX: 11, targetY: 2 },
            'T': { isTown: true, name: "村の広場", facilities: ["inn"] }
        },
        chests: {},
        npcs: {
            '5-6': { id: 'villager1', sprite: '👨‍🌾', dialog: "最近、森の奥で物騒な音がするんだ。気をつけてくだされ。" },
            '8-12': { id: 'villager2', sprite: '👩‍🍳', dialog: "あら、旅の方かい？この村にはこれといって名物はないけど、ゆっくりしていくといいよ。" },
            '12-7': { id: 'villager3', sprite: '👴', dialog: "わしらの若い頃は、もっと魔物も少なかったんじゃがのう…。" }
        }
    },
    "southernDesert": {
        name: "南部砂漠",
        terrainType: "desert",
        layout: [
            ['M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M'],
            ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'B', 'd'],
            ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd'],
            ['d', 'd', 'd', 'd', 'd', 'B', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd'],
            ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd'],
            ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'A', 'd', 'd', 'd'],
            ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd'],
            ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd'],
            ['d', 'B', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd'],
            ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd'],
            ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd'],
            ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'B', 'd', 'd', 'd', 'd', 'd', 'd', 'd'],
            ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd'],
            ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd'],
            ['k', 'k', 'k', 'k', 'k', 'k', 'k', 'U', 'k', 'k', 'k', 'k', 'k', 'k', 'k'],
        ],
        portals: {
            'M': { targetMap: 'northernForest', targetX: 7, targetY: 13 },
            'U': { targetMap: 'ruinedCapital', targetX: 7, targetY: 1 }, // ★修正点: 王都への到着地点を上部に変更
            'A': { isTown: true, name: "魔法都市オイサースト", facilities: ["inn", "association"] }
        },
        chests: {
            '1-13': { opened: false, content: { type: 'item', name: '解毒薬', quantity: 3 } },
            '3-5':  { opened: false, content: { type: 'mimic' } },
            '8-1':  { opened: false, content: { type: 'item', name: '金貨', quantity: 300 } },
            '11-7': { opened: false, content: { type: 'spell', name: '砂嵐' } },
        }
    },
    "ruinedCapital": {
        name: "忘れ去られた王都",
        terrainType: "ruins",
        startPosition: { x: 7, y: 1 }, // ★修正点: スタート地点を上部に変更
        layout: [
            ['k', 'k', 'k', 'k', 'k', 'k', 'k', 'D', 'k', 'k', 'k', 'k', 'k', 'k', 'k'], // ★修正点: 砂漠への出口を上部に設置
            ['k', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'k'],
            ['k', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'B', 'R', 'R', 'R', 'R', 'R', 'k'],
            ['k', 'R', 'R', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'R', 'R', 'R', 'k'],
            ['k', 'R', 'R', ' ', 'w', 'w', 'w', ' ', 'w', 'w', ' ', 'R', 'R', 'R', 'k'],
            ['k', 'R', 'R', ' ', 'w', ' ', ' ', 'B', ' ', 'w', ' ', 'R', 'R', 'R', 'k'],
            ['k', 'R', 'R', ' ', 'w', ' ', 'X', ' ', ' ', 'w', ' ', 'R', 'R', 'R', 'k'],
            ['k', 'R', 'R', ' ', 'w', 'w', ' ', 'w', 'w', 'w', ' ', 'R', 'R', 'R', 'k'],
            ['k', 'R', 'R', ' ', ' ', ' ', 'B', ' ', ' ', ' ', ' ', 'R', 'R', 'R', 'k'],
            ['k', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'k'],
            ['k', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'k'],
            ['k', 'R', 'R', 'B', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'k'],
            ['k', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'k'],
            ['k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k'],
            ['k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k'],
        ],
        portals: {
            'X': { targetMap: 'demonLordsCastleF1', targetX: 7, targetY: 13 },
            'D': { targetMap: 'southernDesert', targetX: 7, targetY: 13 } // ★修正点: 出口の定義
        },
        chests: {
            '2-8': { opened: false, content: { type: 'item', name: 'エーテル', quantity: 1 } },
            '5-7': { opened: false, content: { type: 'spell', name: 'ゴーレムを破壊する魔法' } },
            '8-6': { opened: false, content: { type: 'mimic' } },
            '11-3':{ opened: false, content: { type: 'item', name: '古代のコイン', quantity: 5 } },
        }
    },
    "demonLordsCastleF1": {
        name: "旧魔王城 1階",
        terrainType: "castle",
        layout: [
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
            ['w', ' ', ' ', ' ', 'w', ' ', ' ', ' ', ' ', ' ', 'w', ' ', ' ', ' ', 'w'],
            ['w', ' ', 'w', ' ', 'w', ' ', 'w', 'w', 'w', ' ', 'w', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', ' ', ' ', ' ', ' ', 'B', ' ', ' ', ' ', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', ' ', 'w', ' ', 'w'],
            ['w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w'],
            ['w', 'w', 'w', 'w', 'w', ' ', 'w', 'w', 'w', 'w', 'w', 'w', 'w', ' ', 'w'],
            ['w', ' ', ' ', ' ', 'w', ' ', ' ', 'U', ' ', ' ', 'w', ' ', ' ', ' ', 'w'],
            ['w', ' ', 'w', ' ', 'w', 'w', 'w', 'w', 'w', 'w', 'w', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', 'w', 'w', 'w', 'w', 'B', 'w', 'w', 'w', 'w', 'w', ' ', 'w'],
            ['w', ' ', ' ', ' ', ' ', ' ', 'w', ' ', 'w', ' ', ' ', ' ', ' ', ' ', 'w'],
            ['w', 'w', 'w', 'w', 'w', ' ', 'w', ' ', 'w', ' ', 'w', 'w', 'w', 'w', 'w'],
            ['w', ' ', ' ', ' ', ' ', ' ', ' ', 'X', ' ', ' ', ' ', ' ', ' ', ' ', 'w'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
        ],
        portals: {
            'X': { targetMap: 'ruinedCapital', targetX: 6, targetY: 6 },
            'U': { targetMap: 'demonLordsCastleF2', targetX: 7, targetY: 7 }
        },
        chests: {
            '3-7': { opened: false, content: { type: 'item', name: 'エーテル', quantity: 1 } },
            '10-7':{ opened: false, content: { type: 'item', name: '金貨', quantity: 1000 } },
        },
        enemyCount: 3
    },
    "demonLordsCastleF2": {
        name: "旧魔王城 2階",
        terrainType: "castle",
        layout: [
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
            ['w', ' ', ' ', ' ', ' ', ' ', 'w', ' ', 'w', ' ', ' ', ' ', ' ', ' ', 'w'],
            ['w', ' ', 'w', 'w', 'w', ' ', 'w', ' ', 'w', ' ', 'w', 'w', 'w', ' ', 'w'],
            ['w', ' ', ' ', ' ', 'w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w', ' ', 'w'],
            ['w', 'w', 'w', ' ', 'w', 'w', 'w', 'w', 'w', 'w', 'w', ' ', 'w', 'B', 'w'],
            ['w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', 'w', 'w', 'w', 'w', ' ', 'w', 'w', 'w', 'w', 'w', ' ', 'w'],
            ['w', ' ', 'w', ' ', ' ', ' ', 'o', ' ', 'U', ' ', ' ', ' ', ' ', ' ', 'w'],
            ['w', ' ', 'w', 'w', 'w', 'w', 'w', ' ', 'w', 'w', 'w', 'w', 'w', ' ', 'w'],
            ['w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w', ' ', 'w'],
            ['w', 'B', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', ' ', 'w', ' ', 'w'],
            ['w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w', ' ', ' ', ' ', ' ', ' ', 'w'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', ' ', 'w', ' ', 'w', 'w', 'w', 'w', 'w'],
            ['w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
        ],
        portals: {
            'U': { targetMap: 'demonLordsCastleF3', targetX: 8, targetY: 7 },
            'o': { targetMap: 'demonLordsCastleF1', targetX: 6, targetY: 7 }
        },
        chests: {
            '4-13': { opened: false, content: { type: 'mimic' } },
            '10-1': { opened: false, content: { type: 'item', name: 'エーテル', quantity: 2 } },
        },
        enemyCount: 3
    },
    "demonLordsCastleF3": {
        name: "旧魔王城 3階",
        terrainType: "castle",
        layout: [
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
            ['w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'B', 'w'],
            ['w', ' ', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', ' ', 'w', 'w'],
            ['w', ' ', 'w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w', ' ', 'w', 'w'],
            ['w', ' ', 'w', ' ', 'w', 'w', 'w', 'w', 'w', 'w', ' ', 'w', ' ', ' ', 'w'],
            ['w', ' ', 'w', ' ', 'w', ' ', ' ', ' ', ' ', 'w', ' ', 'w', 'w', ' ', 'w'],
            ['w', ' ', 'w', ' ', 'w', ' ', 'w', 'w', ' ', 'w', ' ', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'o', ' ', 'w', ' ', 'w', 'U', ' ', 'w', 'w', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', ' ', 'w', ' ', 'w', 'w', ' ', 'w', ' ', ' ', 'w', ' ', 'w'],

            ['w', ' ', 'w', ' ', 'w', ' ', ' ', ' ', ' ', 'w', ' ', 'w', 'w', ' ', 'w'],
            ['w', ' ', 'w', ' ', 'w', 'w', 'w', 'w', 'w', 'w', ' ', 'w', ' ', ' ', 'w'],
            ['w', ' ', 'w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w', ' ', 'w', 'w'],
            ['w', ' ', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'B', 'w', 'w'],
            ['w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
        ],
        portals: {
            'U': { targetMap: 'demonLordsCastleF4', targetX: 7, targetY: 7 },
            'o': { targetMap: 'demonLordsCastleF2', targetX: 2, targetY: 7 }
        },
        chests: {
            '1-13': { opened: false, content: { type: 'spell', name: '聖なる光' } },
            '12-12': { opened: false, content: { type: 'item', name: '金貨', quantity: 2000 } },
        },
        enemyCount: 4
    },
    "demonLordsCastleF4": {
        name: "旧魔王城 4階",
        terrainType: "castle",
        layout: [
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
            ['w', 'B', ' ', ' ', 'w', ' ', 'w', ' ', 'w', ' ', 'w', ' ', ' ', 'B', 'w'],
            ['w', ' ', 'w', ' ', 'w', ' ', 'w', ' ', 'w', ' ', 'w', 'w', 'w', ' ', 'w'],
            ['w', ' ', 'w', ' ', 'w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w'],
            ['w', ' ', 'w', 'w', 'w', ' ', 'w', 'w', 'w', 'w', 'w', 'w', 'w', ' ', 'w'],
            ['w', ' ', ' ', ' ', ' ', ' ', 'w', ' ', ' ', ' ', ' ', ' ', 'w', ' ', 'w'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', ' ', 'w', 'w', 'w', 'w', 'w', ' ', 'w'],
            ['w', 'o', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'U', 'w'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', ' ', 'w', 'w', 'w', 'w', 'w', ' ', 'w'],
            ['w', ' ', ' ', ' ', ' ', ' ', 'w', ' ', ' ', ' ', ' ', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', 'w', 'w', ' ', 'w', 'w', 'w', 'w', 'w', 'w', 'w', ' ', 'w'],
            ['w', ' ', 'w', ' ', 'w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w'],
            ['w', ' ', 'w', ' ', 'w', ' ', 'w', ' ', 'w', ' ', 'w', 'w', 'w', ' ', 'w'],
            ['w', 'B', ' ', ' ', 'w', ' ', 'w', ' ', 'w', ' ', 'w', ' ', ' ', 'B', 'w'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
        ],
        portals: {
            'U': { targetMap: 'demonLordsCastleF5', targetX: 13, targetY: 7 },
            'o': { targetMap: 'demonLordsCastleF3', targetX: 1, targetY: 7 }
        },
        chests: {
            '1-1':  { opened: false, content: { type: 'mimic' } },
            '1-13': { opened: false, content: { type: 'mimic' } },
            '13-1': { opened: false, content: { type: 'mimic' } },
            '13-13':{ opened: false, content: { type: 'mimic' } },
        },
        enemyCount: 5
    },
    "demonLordsCastleF5": {
        name: "旧魔王城 玉座の間",
        terrainType: "boss",
        layout: [
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
            ['w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w'],
            ['w', ' ', 'w', 'w', 'w', ' ', 'w', 'A', 'w', ' ', 'w', 'w', 'w', ' ', 'w'],
            ['w', ' ', 'w', ' ', ' ', ' ', 'w', ' ', 'w', ' ', ' ', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', ' ', 'w', 'w', 'w', ' ', 'w', 'w', 'w', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', ' ', 'w'],
            ['w', ' ', ' ', ' ', ' ', ' ', ' ', 'o', ' ', ' ', ' ', ' ', ' ', ' ', 'w'],
            ['w', ' ', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', ' ', 'w'],
            ['w', ' ', 'w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', ' ', 'w', 'w', 'w', ' ', 'w', 'w', 'w', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', ' ', ' ', ' ', 'w', ' ', 'w', ' ', ' ', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', 'w', 'w', ' ', 'w', ' ', 'w', ' ', 'w', 'w', 'w', ' ', 'w'],
            ['w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
        ],
        portals: {
            'o': { targetMap: 'demonLordsCastleF4', targetX: 7, targetY: 7 }
        },
        chests: {},
        npcs: {
            '2-7': { id: 'aura', sprite: '😈', dialog: "「よく来たな、エルフ。ヒンメルはもういない。ここがお前の墓標となる」" }
        },
        enemyCount: 0
    },
    "goblinCave": {
        name: "ゴブリンの洞窟",
        terrainType: "cave",
        layout: [
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
            ['w', ' ', ' ', ' ', 'w', ' ', 'B', ' ', ' ', ' ', 'w', ' ', ' ', ' ', 'w'],
            ['w', ' ', 'w', ' ', 'w', ' ', 'w', 'w', 'w', ' ', 'w', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', ' ', ' ', ' ', 'w', ' ', ' ', ' ', ' ', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', 'w', 'w', 'w', 'w', ' ', 'w', 'w', 'w', 'w', 'w', ' ', 'w'],
            ['w', ' ', ' ', 'B', ' ', ' ', ' ', ' ', 'w', ' ', ' ', ' ', ' ', ' ', 'w'],
            ['w', 'w', 'w', 'w', 'w', ' ', 'w', 'w', 'w', ' ', 'w', 'w', 'w', 'w', 'w'],
            ['w', ' ', ' ', ' ', 'w', ' ', 'w', ' ', ' ', ' ', 'w', ' ', ' ', ' ', 'w'],
            ['w', ' ', 'w', ' ', 'w', ' ', 'w', 'B', 'w', ' ', 'w', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', ' ', ' ', ' ', ' ', ' ', 'w', ' ', ' ', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', ' ', 'w'],
            ['w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'B', ' ', ' ', ' ', 'w'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', ' ', 'w', 'w', 'w', 'w', 'w'],
            ['w', 'E', ' ', ' ', ' ', ' ', 'w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
        ],
        portals: { 'E': { targetMap: 'northernForest', targetX: 12, targetY: 8 } },
        chests: {
            '1-6':  { opened: false, content: { type: 'item', name: '金貨', quantity: 50 } },
            '5-3':  { opened: false, content: { type: 'item', name: '薬草', quantity: 3 } },
            '8-7':  { opened: false, content: { type: 'mimic' } },
            '11-10':{ opened: false, content: { type: 'spell', name: '明かりの魔法' } },
        }
    },
    "snowyPlains": {
        name: "雪深き辺境",
        terrainType: "snow",
        layout: [
            ['f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f'],
            ['f', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 'f'],
            ['f', 's', 's', 'T', 's', 'f', 'f', 's', 'f', 'f', 's', 'B', 'C', 's', 'f'],
            ['f', 's', 's', 's', 's', 's', 'f', 's', 'f', 's', 's', 's', 's', 's', 'f'],
            ['f', 's', 'f', 'f', 'f', 's', 's', 's', 's', 's', 'f', 'f', 'f', 's', 'f'],
            ['f', 's', 's', 's', 'B', 's', 's', 's', 's', 's', 's', 's', 's', 's', 'f'],
            ['f', 'f', 'f', 'f', 'f', 's', 's', 's', 's', 's', 'f', 'f', 'f', 'f', 'f'],
            ['f', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 'f'],
            ['f', 's', 'B', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 'f'],
            ['f', 's', 'f', 'f', 'f', 'f', 's', 's', 's', 'f', 'f', 'f', 'f', 's', 'f'],
            ['f', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 'f'],
            ['f', 's', 's', 's', 's', 's', 's', 's', 's', 'B', 's', 's', 's', 's', 'f'],
            ['f', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 'f'],
            ['f', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 'f'],
            ['M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M'],
        ],
        portals: {
            'M': { targetMap: 'northernForest', targetX: 7, targetY: 1 },
            'C': { targetMap: 'iceCave', targetX: 7, targetY: 13 },
            'T': { isTown: true, name: "辺境の村", facilities: ["inn", "shop"] }
        },
        chests: {
            '2-11': { opened: false, content: { type: 'item', name: '暖かい外套', quantity: 1 } },
            '5-4':  { opened: false, content: { type: 'spell', name: '氷の矢' } },
            '8-2':  { opened: false, content: { type: 'item', name: '金貨', quantity: 200 } },
            '11-9': { opened: false, content: { type: 'mimic' } },
        }
    },
    "iceCave": {
        name: "氷結洞窟",
        terrainType: "snow",
        layout: [
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
            ['w', ' ', ' ', 'w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w', ' ', 'B', 'w'],
            ['w', ' ', 'w', 'w', ' ', 'w', 'w', ' ', 'w', 'w', ' ', 'w', ' ', 'w', 'w'],
            ['w', ' ', ' ', 'w', ' ', ' ', ' ', ' ', ' ', 'w', ' ', ' ', ' ', ' ', 'w'],
            ['w', 'w', ' ', 'w', 'w', 'w', ' ', 'w', ' ', 'w', 'w', 'w', 'w', ' ', 'w'],
            ['w', ' ', ' ', ' ', ' ', 'w', ' ', 'w', 'B', ' ', ' ', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', 'w', ' ', 'w', ' ', 'w', 'w', 'w', 'w', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w', ' ', ' ', ' ', 'w'],
            ['w', ' ', 'w', ' ', 'w', 'w', 'w', 'w', 'w', ' ', 'w', 'w', 'w', 'w', 'w'],
            ['w', ' ', ' ', ' ', ' ', ' ', 'B', ' ', 'w', ' ', ' ', ' ', ' ', ' ', 'w'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', ' ', 'w', ' ', 'w', 'w', 'w', ' ', 'w'],
            ['w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w', ' ', 'w'],
            ['w', ' ', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'B', 'w', ' ', 'w'],
            ['w', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'w', ' ', 'E', ' ', 'w'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
        ],
        portals: { 'E': { targetMap: 'snowyPlains', targetX: 12, targetY: 2 } },
        chests: {
            '1-13': { opened: false, content: { type: 'item', name: 'エーテル', quantity: 2 } },
            '5-8':  { opened: false, content: { type: 'mimic' } },
            '9-6':  { opened: false, content: { type: 'item', name: '金貨', quantity: 500 } },
            '12-11':{ opened: false, content: { type: 'spell', name: '聖なる光' } },
        }
    }
};



