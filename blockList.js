const blockList = [
    {
        name: 'Air'
    },
    {//1
        pic: 'dirt.png',
        name: 'Dirt',
        multiside: false
    },
    {//2
        pic: 'grass_block_top.png',
        name: 'Grass',
        multiside: true,
        sides: {
            0: 'grass_block_side.png',
            1: 'grass_block_side.png',
            2: 'grass_block_side.png',
            3: 'grass_block_side.png',
            4: 'grass_block_top.png',
            5: 'dirt.png',
        }
    },
    {//3
        pic: 'stone.png',
        name: 'Stone',
        multiside: false
    },
    {//4
        pic: 'cobblestone.png',
        name: 'Cobblestone',
        multiside: false
    },
    {//5
        pic: 'sand.png',
        name: 'Sand',
        multiside: false
    },
    {//6
        pic: 'bedrock.png',
        name: 'Bedrock',
        multiside: false
    },
    {//7
        pic: 'oak_planks.png',
        name: 'Planks',
        multiside: false
    },
    {//8
        pic: 'oak_log.png',
        name: 'Tree Log',
        multiside: true,
        sides: {
            0: 'oak_log.png',
            1: 'oak_log.png',
            2: 'oak_log.png',
            3: 'oak_log.png',
            4: 'oak_log_top.png',
            5: 'oak_log_top.png',
        }
    },
    {//9
        pic: 'oak_leaves.png',
        name: 'Leaves',
        multiside: false
    },
    {//10
        pic: 'oak_sapling_temp.png',
        name: 'Sapling',
        multiside: false
    },
    {//11
        pic: 'cobblestone_red.png',
        name: 'Red Cobblestone',
        multiside: false
    },
    {//12
        pic: 'cobblestone_blue.png',
        name: 'Blue Cobblestone',
        multiside: false
    },
    {//13
        pic: 'cobblestone_green.png',
        name: 'Green Cobblestone',
        multiside: false
    },
    {//14
        pic: 'cobblestone_yellow.png',
        name: 'Yellow Cobblestone',
        multiside: false
    },
];