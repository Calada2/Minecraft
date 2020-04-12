const mapRadius = 8;
const heightLimit = 29;

const blocks = [];
let blockData = [];
function constructWorld()
{
    for(let x = -mapRadius; x <= mapRadius; ++x)
    {
        blocks[x] = [];
        blockData[x] = [];
        for(let z = -mapRadius; z <= mapRadius; ++z)
        {
            blocks[x][z] = [];
            blockData[x][z] = [];
            for(let y = 0; y <= heightLimit + 3; ++y)
            {
                blocks[x][z][y] = constructCubeDom();
                blocks[x][z][y].style.transform = `translateZ(${z*100}px) translateX(${x*100}px) translateY(${y*-100}px)`;
                blocks[x][z][y].x = x;
                blocks[x][z][y].y = y;
                blocks[x][z][y].z = z;

                let type;
                if(y > 9) type = 0;
                else if(y > 8) type = 2;
                else if(y > 6) type = 1;
                else if(y > 0) type = 3;
                else type = 6;
                //blockData[x][z][y] = (y >= 10 ? 0 : (y >= 9 ? 2 : (y == 0 ? 6 : 3)));
                blockData[x][z][y] = type;

            }
        }
    }
}

function constructCubeDom(id)
{
    let block = document.createElement('div');
    block.className = 'block';
    block.type = id;
    block.faces = [];


    return block;

    //0: Z+
    //1: X+
    //2: Z-
    //3: X-
    //4: Y+
    //5: Y-

    //transform Y is reversed
}
function addFace(type, side)
{
    let face = document.createElement('face');
    face.className = 'face';
    face.side = side;
    if(blockList[type].multiside)
    {
        face.style.backgroundImage = `url(textures/${blockList[type].sides[side]})`;
    }
    else if(blockList[type].xshape)
    {
        face.style.backgroundImage = `none`;
    }
    else
    {
        face.style.backgroundImage = `url(textures/${blockList[type].pic})`;
    }

    if(side < 4)
        face.style.transform = `rotateY(${side * 90}deg) translateZ(50px)`;
    else
        face.style.transform = `rotateX(${90 + side * 180}deg) translateZ(50px)`;

    return face;
}
function renderGame()
{
    for(let x in blockData)
    {
        for(let z in blockData[x])
        {
            for(let y in blockData[x][z])
            {

                if(blockData[x][z][y] != 0)
                {
                    blockUpdate(x,z,y);
                }
            }
        }
    }
}

function isAir(x,z,y)
{
    if(blockData[x] == undefined || blockData[x][z] == undefined || blockData[x][z][y] == undefined)
    {
        return false;
    }
    else if(blockData[x][z][y] == 0)
        return true;
    return false;


}

function isTransparent(x,z,y)
{
    if(blockData[x] == undefined || blockData[x][z] == undefined || blockData[x][z][y] == undefined)
    {
        return false;
    }
    else if(blockList[blockData[x][z][y]].transparent)
        return true;
    return false;


}

function isXShaped(x,z,y)
{
    if(blockData[x] == undefined || blockData[x][z] == undefined || blockData[x][z][y] == undefined)
    {
        return false;
    }
    else if(blockList[blockData[x][z][y]].xshape)
        return true;
    return false;


}

function blockUpdate(x,z,y)
{

    if(blockData[x] != undefined && blockData[x][z] != undefined && blockData[x][z][y] != undefined)
    {
        let block = blocks[x][z][y];
        let type = blockData[x][z][y];

        if(block.childNodes.length > 0)
        {
            block.parentNode.removeChild(block);
            block.innerHTML = '';
        }


        if(type != 0)
        {

            let blockTransparent = isTransparent(x,z,y);
            let blockXShaped = isXShaped(x,z,y);
            let visibleFaces = 0;
            if(isAir(x,z - -1,y) || isXShaped(x,z - -1,y) || (isTransparent(x,z - -1,y) && !blockTransparent))
            {
                let elem = addFace(type, 0);
                block.faces[0] = elem;
                block.appendChild(elem);
                ++visibleFaces;
            }
            if(isAir(x,z - 1,y) || isXShaped(x,z - 1,y) || ( isTransparent(x,z - 1,y) && !blockTransparent))
            {
                let elem = addFace(type, 2);
                block.faces[2] = elem;
                block.appendChild(elem);
                ++visibleFaces;
            }
            if(isAir(x - -1,z,y) || isXShaped(x - -1,z,y) || ( isTransparent(x - -1,z,y) && !blockTransparent))
            {
                let elem = addFace(type, 1);
                block.faces[1] = elem;
                block.appendChild(elem);
                ++visibleFaces;
            }
            if(isAir(x - 1,z,y) || isXShaped(x - 1,z,y) || (isTransparent(x - 1,z,y) && !blockTransparent))
            {
                let elem = addFace(type, 3);
                block.faces[3] = elem;
                block.appendChild(elem);
                ++visibleFaces;
            }
            if(isAir(x,z,y - -1) || isXShaped(x,z,y - -1) || (isTransparent(x,z,y - -1) && !blockTransparent))
            {
                let elem = addFace(type, 4);
                block.faces[4] = elem;
                block.appendChild(elem);
                ++visibleFaces;
            }
            if(isAir(x,z,y - 1) || isXShaped(x,z,y - 1) || (isTransparent(x,z,y - 1) && !blockTransparent))
            {
                let elem = addFace(type, 5);
                block.faces[5] = elem;
                block.appendChild(elem);
                ++visibleFaces;
            }

            if(visibleFaces > 0)
            {

                if(blockList[blockData[x][z][y]].xshape)
                {
                    addXshape(block, type);
                }
                document.querySelector('#scene').appendChild(blocks[x][z][y]);
            }
        }
    }
}
function addXshape(block, type)
{
    let side = document.createElement('div');
    side.className = 'face2';
    side.style.backgroundImage = `url(textures/${blockList[type].pic})`;
    side.style.transform = 'rotateY(45deg)';
    block.appendChild(side.cloneNode(true));
    side.style.transform = 'rotateY(-45deg)';
    block.appendChild(side.cloneNode(true));
}
const player = {
    height: 1.3,
    pos: {
        x: 0,
        y: 9.5,
        z: 0
    },
    rot: {
        x: 0,
        y: 0
    }
};

window.addEventListener('resize', e=>{
    document.querySelector('#camera').style.setProperty('--perspective', document.querySelector('#camera').clientHeight/2 + 'px');
});

function refresh_pos() {
    var c = document.querySelector('#camera').style;
    c.setProperty('--x', player.pos.x * 100 + 'px');
    c.setProperty('--y', (player.pos.y + player.height) * 100 + 'px');
    c.setProperty('--z', player.pos.z * 100 + 'px');
    c.setProperty('--rotY', player.rot.x + 'rad');
    c.setProperty('--rotX', player.rot.y + 'rad');
}

document.querySelector('#gui').ondblclick = e =>
{
    document.querySelector('#camera').requestPointerLock();
};

let fpsenabled = false;

document.querySelector('#camera').onmousemove = e => {
    if(fpsenabled) {
        player.rot.x += (e.movementX / 100);
        player.rot.y -= (e.movementY / 100);
        if (player.rot.y < -Math.PI / 2) player.rot.y = -Math.PI / 2;
        else if (player.rot.y > Math.PI / 2) player.rot.y = Math.PI / 2;
    }

};

document.addEventListener('pointerlockchange', e=>{
    if(document.pointerLockElement === document.querySelector('#camera')) fpsenabled = true;
    else fpsenabled = false;
}, false);


var moveinteval;
var keybinds = {
    left: 65,
    right: 68,
    forward: 87,
    backward: 83,
    jump: 32
};
var keypressed = {
    left: false,
    right: false,
    forward: false,
    backward: false,
    jump: false
};
var keymovement = {x:0,z:0};
var moving = false;
var keydownF =  e => {

    if(fpsenabled) {
        if (event.keyCode === keybinds.left) {
            if (!keypressed.left) {
                keymovement.x += 1;
                keypressed.left = true;
            }
        }
        else if (event.keyCode === keybinds.right) {
            if (!keypressed.right) {
                keymovement.x += -1;
                keypressed.right = true;
            }
        }
        else if (event.keyCode === keybinds.backward) {
            if (!keypressed.backward) {
                keymovement.z += -1;
                keypressed.backward = true;
            }
        }
        else if (event.keyCode === keybinds.forward) {
            if (!keypressed.forward) {
                keymovement.z += 1;
                keypressed.forward = true;
            }
        }
        else if (event.keyCode === keybinds.jump) {
            //if (Math.round(verticalSpeed / 200) == 0) {
            if (verticalSpeed == 0) {
                verticalSpeed = 4;
            }
        }

    }


};

var keyupF = e => {

    if(fpsenabled) {
        if (event.keyCode === keybinds.left) {

            keymovement.x -= 1;
            keypressed.left = false;

        }
        else if (event.keyCode === keybinds.right) {

            keymovement.x -= -1;
            keypressed.right = false;

        }
        else if (event.keyCode === keybinds.backward) {

            keymovement.z -= -1;
            keypressed.backward = false;

        }
        else if (event.keyCode === keybinds.forward) {
            keymovement.z -= 1;
            keypressed.forward = false;
        }
    }
};

document.body.addEventListener('keydown',keydownF);
document.body.addEventListener('keyup',keyupF);

let gravity = 10;
let verticalSpeed = 0;

let prevTime = +new Date();

let occupiedBlock = [];
let occupiedBlockData = [];

function updateOccupiedBlocks()
{
    occupiedBlock[0] = {
        x: -Math.round(player.pos.x),
        z: -Math.round(player.pos.z),
        y: Math.round(player.pos.y)
    };
    occupiedBlock[1] = {
        x: -Math.round(player.pos.x),
        z: -Math.round(player.pos.z),
        y: Math.round(player.pos.y) + 1
    };

    occupiedBlockData[0] = blockList[blockData[occupiedBlock[0].x][occupiedBlock[0].z][occupiedBlock[0].y]];
    occupiedBlockData[1] = blockList[blockData[occupiedBlock[1].x][occupiedBlock[1].z][occupiedBlock[1].y]];

}
function gameloop()
{
    let delta = +new Date() - prevTime;
    prevTime = +new Date();

    let moveVector = new Vector(keymovement.x,keymovement.z).unit();
    moveVector = rotate2dVector(moveVector, player.rot.x);




    player.pos.x += moveVector.x * delta / 400;
    updateOccupiedBlocks();
    if(Math.abs(occupiedBlock[0].x) > mapRadius || (occupiedBlockData[0].id  != 0 && !occupiedBlockData[0].xshape) || (occupiedBlockData[1].id  != 0 && !occupiedBlockData[1].xshape))
    {
        player.pos.x -= moveVector.x * delta / 400;
    }

    player.pos.z += moveVector.y * delta / 400;
    updateOccupiedBlocks();
    if(Math.abs(occupiedBlock[0].z) > mapRadius || (occupiedBlockData[0].id  != 0 && !occupiedBlockData[0].xshape) || (occupiedBlockData[1].id  != 0 && !occupiedBlockData[1].xshape))
    {
        player.pos.z -= moveVector.y * delta / 400;
    }


    verticalSpeed -= delta/100;
    let blockBelow = blockList[blockData[-Math.round(player.pos.x)][-Math.round(player.pos.z)][Math.round(player.pos.y + verticalSpeed * delta/500)]];
    let blockAbove = blockList[blockData[-Math.round(player.pos.x)][-Math.round(player.pos.z)][Math.round(player.pos.y + verticalSpeed * delta/500 - -1.8)]];
    if(verticalSpeed <= 0 &&  blockBelow.id != 0 && !blockBelow.xshape)
    {
        verticalSpeed = 0;
        player.pos.y = Math.round(player.pos.y) - .5;
    }
    else if(verticalSpeed >= 0 &&  blockAbove.id != 0 && !blockAbove.xshape)
    {
        verticalSpeed = 0;
        //player.pos.y = Math.round(player.pos.y) - .5;
    }


    player.pos.y += verticalSpeed * delta/500;





    refresh_pos();
    checkFocus();

}



function rotate2dVector(vec, by)
{
    let length = vec.length();
    let ang = Math.atan2(vec.y,vec.x) + by;
    return (new Vector(Math.cos(ang), Math.sin(ang))).unit().multiply(length);
}
constructWorld();
renderGame();

let focusBlock = null;
let focusSide = null;

function checkFocus()
{
    document.querySelector('#gui').hidden = true;
    let newFocusSide = document.elementFromPoint(innerWidth/2,innerHeight/2);
    let newFocusBlock = newFocusSide.parentNode;

    if(newFocusBlock != focusBlock)
    {
        if(focusBlock != null) focusBlock.setAttribute('focus','false');

        if(newFocusBlock == document.body) focusBlock = null;
        else
        {
            focusSide = newFocusSide.side;
            focusBlock = newFocusBlock;
            focusBlock.setAttribute('focus','true');
        }
    }
    else if(focusBlock != null)
    {
        focusSide = newFocusSide.side;
    }
    document.querySelector('#gui').hidden = false;

}

function placeBlock(x, z, y, type)
{
    updateOccupiedBlocks();
    if(blockData[x] != undefined && blockData[x][z] != undefined && blockData[x][z][y] != undefined && y != 0 && y < 30 && (!(occupiedBlock[0].x == x && occupiedBlock[0].z == z && (occupiedBlock[0].y == y || occupiedBlock[0].y + 1 == y)) || type == 0 || blockList[type].xshape))
    {
        blockData[x][z][y] = type;

        blockUpdate(x,z,y);

        blockUpdate(x - 1,z,y);
        blockUpdate(x - -1,z,y);
        blockUpdate(x,z - 1,y);
        blockUpdate(x,z - -1,y);
        blockUpdate(x,z,y - 1);
        blockUpdate(x,z,y - -1);

    }
}

let activeBlock = 1;

document.querySelector('#camera').onmousedown = function (e) {


    if(fpsenabled && focusBlock != null)
    {


        if(e.button == 2)
        {
            if(focusSide == 0) placeBlock(focusBlock.x,focusBlock.z - -1, focusBlock.y, activeBlock);
            else if(focusSide == 1) placeBlock(focusBlock.x - -1,focusBlock.z, focusBlock.y, activeBlock);
            else if(focusSide == 2) placeBlock(focusBlock.x,focusBlock.z - 1, focusBlock.y, activeBlock);
            else if(focusSide == 3) placeBlock(focusBlock.x - 1,focusBlock.z, focusBlock.y, activeBlock);
            else if(focusSide == 4) placeBlock(focusBlock.x,focusBlock.z, focusBlock.y - -1, activeBlock);
            else if(focusSide == 5) placeBlock(focusBlock.x,focusBlock.z, focusBlock.y - 1, activeBlock);

            //0: Z+
            //1: X+
            //2: Z-
            //3: X-
            //4: Y+
            //5: Y-
        }
        else if(e.button == 0)
        {
            placeBlock(focusBlock.x,focusBlock.z, focusBlock.y, 0);
        }
        else if(e.button == 1)
        {
            let block = blockData[focusBlock.x][focusBlock.z][focusBlock.y];
            if(block > 0)changeBlock(block);
        }
    }


};

window.addEventListener('wheel', e => {
    let delta;
    e => e.preventDefault();

    if (e.wheelDelta)
        delta = e.wheelDelta;
    else
        delta = -1 * e.deltaY;

    if (delta > 0)
        changeBlock(activeBlock == blockList.length - 1 ? 1 : activeBlock + 1);

    else if (delta < 0)
        changeBlock(activeBlock == 1 ? blockList.length - 1 : activeBlock - 1);



});

function changeBlock(id)
{
    activeBlock = id;
    document.querySelector('#currentBlock').style.setProperty('--img', `url(textures/${blockList[id].pic})`);
}

function tick()
{
    for(let x in blockData)
    {
        for(let z in blockData[x])
        {
            for(let y in blockData[x][z])
            {
                let block = blockData[x][z][y];
                switch (block) {
                    case 1:
                    {
                        for(let x2 = -1; x2 <= 1; ++x2)
                            for(let z2 = -1; z2 <= 1; ++z2)
                                for(let y2 = -1; y2 <= 1; ++y2)
                                {

                                    if((Math.abs(x - -x2) <= mapRadius && Math.abs(z - -z2) <= mapRadius && y - -y2 > 0 && y - -y2 <= heightLimit) &&
                                        blockData[x - -x2][z - -z2][y - -y2] == 2 && blockData[x][z][y - -1] == 0 && Math.random() < .005)
                                    {
                                        placeBlock(x,z,y,2);
                                    }
                                }

                        break;
                    }
                    case 2:
                    {
                        if(blockData[x][z][y - -1] != 0 && !blockList[blockData[x][z][y - -1]].xshape && Math.random() < .008)
                        {
                            placeBlock(x,z,y,1);
                        }
                        break;
                    }
                    case 10:
                    {
                        if(Math.random() < .015 && blockData[x][z][y-1] == 2 && blockData[x][z][y - -1] == 0 && blockData[x][z][y - -2] == 0 && blockData[x][z][y - -3] == 0 && !(occupiedBlock[0].x == x && occupiedBlock[0].z == z && occupiedBlock[0].y >= y && occupiedBlock[0].y <= y - -4))
                        {
                            placeBlock(x,z,y,0);
                            buildStructure(x,z,y,'tree',false);
                        }
                    }

                }
            }
        }
    }
}

function buildStructure(xp, zp, yp, structureName, replace)
{
    let structure = structures[structureName];

    for(let x in structure) {
        for (let z in structure[x]) {
            for (let y in structure[x][z]) {
                if((Math.abs(xp - -x) <= mapRadius && Math.abs(zp - -z <= mapRadius) && yp - -y > 0 && yp - y <= heightLimit) && (replace || blockData[xp - -x][zp - -z][yp - -y] == 0) && (structure[x][z][y] != undefined && structure[x][z][y] != -1))
                {
                    placeBlock(xp - -x, zp - -z, yp - -y,structure[x][z][y]);
                }
            }
        }
    }
}

buildStructure(-5,-5,10, 'tree', false);

setInterval(gameloop, 1000/60);
setInterval(tick, 1000);