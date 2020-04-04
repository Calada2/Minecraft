// document.addEventListener('contextmenu', event => event.preventDefault());

const mapRadius = 8;
const heightLimit = 29;

const blocks = [];
let blockData = [];

function constructWorld() {
  for (let x = -mapRadius; x <= mapRadius; ++x) {
    blocks[x] = [];
    blockData[x] = [];
    for (let z = -mapRadius; z <= mapRadius; ++z) {
      blocks[x][z] = [];
      blockData[x][z] = [];
      for (let y = 0; y <= heightLimit + 3; ++y) {
        blocks[x][z][y] = constructCubeDom();
        blocks[x][z][y].style.transform = `translateZ(${z * 100}px) translateX(${x * 100}px) translateY(${y * -100}px)`;
        blocks[x][z][y].x = x;
        blocks[x][z][y].y = y;
        blocks[x][z][y].z = z;

        let type;
        if (y > 9)
          type = 0;
        else if (y > 8)
          type = 2;
        else if (y > 6)
          type = 1;
        else if (y > 0)
          type = 3;
        else
          type = 6;
        //blockData[x][z][y] = (y >= 10 ? 0 : (y >= 9 ? 2 : (y == 0 ? 6 : 3)));
        blockData[x][z][y] = type;

      }
    }
  }
}

function constructCubeDom(id) {
  /* let block = null;

    if(id > 0)
    {

    }*/

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
function addFace(type, side) {
  let face = document.createElement('face');
  face.className = 'face';
  face.side = side;
  if (blockList[type].multiside) {
    face.style.backgroundImage = `url(textures/${blockList[type].sides[side]})`;
  } else {
    face.style.backgroundImage = `url(textures/${blockList[type].pic})`;
  }

  if (side < 4)
    face.style.transform = `rotateY(${side * 90}deg) translateZ(50px)`;
  else
    face.style.transform = `rotateX(${90 + side * 180}deg) translateZ(50px)`;

  return face;
}
function renderGame() {
  for (let x in blockData) {
    //console.log(x);
    for (let z in blockData[x]) {
      for (let y in blockData[x][z]) {

        if (blockData[x][z][y] != 0) {
          blockUpdate(x, z, y);
        }

        //  console.log(block.faces);

      }
    }
  }
}

function isAir(x, z, y) {
  if (blockData[x] == undefined || blockData[x][z] == undefined || blockData[x][z][y] == undefined) {
    return false;
  } else if (blockData[x][z][y] == 0)
    return true;
  return false;

}

function blockUpdate(x, z, y) {

  if (blockData[x] != undefined && blockData[x][z] != undefined && blockData[x][z][y] != undefined) {
    let block = blocks[x][z][y];
    let type = blockData[x][z][y];

    if (block.childNodes.length > 0) {
      block.parentNode.removeChild(block);
      block.innerHTML = '';
    }

    if (type != 0) {

      let visibleFaces = 0;
      if (isAir(x, z - -1, y)) {
        let elem = addFace(type, 0);
        block.faces[0] = elem;
        block.appendChild(elem);
        ++visibleFaces;
      }
      if (isAir(x, z - 1, y)) {
        let elem = addFace(type, 2);
        block.faces[2] = elem;
        block.appendChild(elem);
        ++visibleFaces;
      }
      if (isAir(x - -1, z, y)) {
        let elem = addFace(type, 1);
        block.faces[1] = elem;
        block.appendChild(elem);
        ++visibleFaces;
      }
      //console.log(block.faces);
      if (isAir(x - 1, z, y)) {
        let elem = addFace(type, 3);
        block.faces[3] = elem;
        block.appendChild(elem);
        ++visibleFaces;
      }
      if (isAir(x, z, y - -1)) {
        let elem = addFace(type, 4);
        block.faces[4] = elem;
        block.appendChild(elem);
        ++visibleFaces;
      }
      if (isAir(x, z, y - 1)) {
        let elem = addFace(type, 5);
        block.faces[5] = elem;
        block.appendChild(elem);
        ++visibleFaces;
      }

      if (visibleFaces > 0)
        document.querySelector('#scene').appendChild(blocks[x][z][y]);
    }
  }

  //  console.log(block.faces);
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
  document.querySelector('#camera').style.setProperty('--perspective', document.querySelector('#camera').clientHeight / 2 + 'px');
}
);

function refresh_pos() {
  var c = document.querySelector('#camera').style;
  c.setProperty('--x', player.pos.x * 100 + 'px');
  c.setProperty('--y', (player.pos.y + player.height) * 100 + 'px');
  c.setProperty('--z', player.pos.z * 100 + 'px');
  c.setProperty('--rotY', player.rot.x + 'rad');
  c.setProperty('--rotX', player.rot.y + 'rad');
}

document.querySelector('#gui').ondblclick = e=>{
  document.querySelector('#camera').requestPointerLock();
}
;

let fpsenabled = false;

document.querySelector('#camera').onmousemove = e=>{
  if (fpsenabled) {
    player.rot.x += (e.movementX / 100);
    player.rot.y -= (e.movementY / 100);
    if (player.rot.y < -Math.PI / 2)
      player.rot.y = -Math.PI / 2;
    else if (player.rot.y > Math.PI / 2)
      player.rot.y = Math.PI / 2;
  }

}
;

document.addEventListener('pointerlockchange', e=>{
  if (document.pointerLockElement === document.querySelector('#camera'))
    fpsenabled = true;
  else
    fpsenabled = false;
}
, false);

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
var keymovement = {
  x: 0,
  z: 0
};
var moving = false;
var keydownF = e=>{

  if (fpsenabled) {
    if (event.keyCode === keybinds.left) {
      if (!keypressed.left) {
        keymovement.x += 1;
        keypressed.left = true;
      }
    } else if (event.keyCode === keybinds.right) {
      if (!keypressed.right) {
        keymovement.x += -1;
        keypressed.right = true;
      }
    } else if (event.keyCode === keybinds.backward) {
      if (!keypressed.backward) {
        keymovement.z += -1;
        keypressed.backward = true;
      }
    } else if (event.keyCode === keybinds.forward) {
      if (!keypressed.forward) {
        keymovement.z += 1;
        keypressed.forward = true;
      }
    } else if (event.keyCode === keybinds.jump) {
      //if (Math.round(verticalSpeed / 200) == 0) {
      if (verticalSpeed == 0) {
        verticalSpeed = 4;
      }
    }

  }

}
;

var keyupF = e=>{

  if (fpsenabled) {
    if (event.keyCode === keybinds.left) {

      keymovement.x -= 1;
      keypressed.left = false;

    } else if (event.keyCode === keybinds.right) {

      keymovement.x -= -1;
      keypressed.right = false;

    } else if (event.keyCode === keybinds.backward) {

      keymovement.z -= -1;
      keypressed.backward = false;

    } else if (event.keyCode === keybinds.forward) {
      keymovement.z -= 1;
      keypressed.forward = false;
    }
  }
}
;

document.body.addEventListener('keydown', keydownF);
document.body.addEventListener('keyup', keyupF);

let gravity = 10;
let verticalSpeed = 0;

let prevTime = +new Date();
function gameloop() {
  let delta = +new Date() - prevTime;
  prevTime = +new Date();

  let moveVector = new Vector(keymovement.x,keymovement.z).unit();
  moveVector = rotate2dVector(moveVector, player.rot.x);

  player.pos.x += moveVector.x * delta / 400;
  if (Math.abs(Math.round(player.pos.x)) > mapRadius || blockData[-Math.round(player.pos.x)][-Math.round(player.pos.z)][Math.round(player.pos.y)] != 0 || blockData[-Math.round(player.pos.x)][-Math.round(player.pos.z)][Math.round(player.pos.y) + 1] != 0) {
    player.pos.x -= moveVector.x * delta / 400;
  }
  player.pos.z += moveVector.y * delta / 400;
  if (Math.abs(Math.round(player.pos.z)) > mapRadius || blockData[-Math.round(player.pos.x)][-Math.round(player.pos.z)][Math.round(player.pos.y)] != 0 || blockData[-Math.round(player.pos.x)][-Math.round(player.pos.z)][Math.round(player.pos.y) + 1] != 0) {
    player.pos.z -= moveVector.y * delta / 400;
  }

  // console.log('vs:' + verticalSpeed);
  // console.log('y:' + player.pos.y);

  verticalSpeed -= delta / 100;

  if (verticalSpeed <= 0 && blockData[-Math.round(player.pos.x)][-Math.round(player.pos.z)][Math.round(player.pos.y + verticalSpeed * delta / 500)] != 0) {
    verticalSpeed = 0;
    player.pos.y = Math.round(player.pos.y) - .5;
  }

  player.pos.y += verticalSpeed * delta / 500;

  refresh_pos();
  checkFocus();

}

function rotate2dVector(vec, by) {
  let length = vec.length();
  let ang = Math.atan2(vec.y, vec.x) + by;
  return (new Vector(Math.cos(ang),Math.sin(ang))).unit().multiply(length);
}
constructWorld();
renderGame();

let focusBlock = null;
let focusSide = null;

function checkFocus() {
  document.querySelector('#gui').hidden = true;
  let newFocusSide = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
  let newFocusBlock = newFocusSide.parentNode;

  if (newFocusBlock != focusBlock) {
    if (focusBlock != null)
      focusBlock.setAttribute('focus', 'false');

    if (newFocusBlock == document.body)
      focusBlock = null;
    else {
      focusSide = newFocusSide.side;
      focusBlock = newFocusBlock;
      focusBlock.setAttribute('focus', 'true');
    }
  } else if (focusBlock != null) {
    focusSide = newFocusSide.side;
  }
  document.querySelector('#gui').hidden = false;

}

function placeBlock(x, z, y, type) {
  if (blockData[x] != undefined && blockData[x][z] != undefined && blockData[x][z][y] != undefined && y != 0 && y < 30) {
    blockData[x][z][y] = type;

    blockUpdate(x, z, y);

    blockUpdate(x - 1, z, y);
    blockUpdate(x - -1, z, y);
    blockUpdate(x, z - 1, y);
    blockUpdate(x, z - -1, y);
    blockUpdate(x, z, y - 1);
    blockUpdate(x, z, y - -1);

  }
}

let activeBlock = 1;

document.querySelector('#camera').onmousedown = function(e) {

  //console.log(e.button);
  if (fpsenabled && focusBlock != null) {

    if (e.button == 2) {
      if (focusSide == 0)
        placeBlock(focusBlock.x, focusBlock.z - -1, focusBlock.y, activeBlock);
      else if (focusSide == 1)
        placeBlock(focusBlock.x - -1, focusBlock.z, focusBlock.y, activeBlock);
      else if (focusSide == 2)
        placeBlock(focusBlock.x, focusBlock.z - 1, focusBlock.y, activeBlock);
      else if (focusSide == 3)
        placeBlock(focusBlock.x - 1, focusBlock.z, focusBlock.y, activeBlock);
      else if (focusSide == 4)
        placeBlock(focusBlock.x, focusBlock.z, focusBlock.y - -1, activeBlock);
      else if (focusSide == 5)
        placeBlock(focusBlock.x, focusBlock.z, focusBlock.y - 1, activeBlock);

      //0: Z+
      //1: X+
      //2: Z-
      //3: X-
      //4: Y+
      //5: Y-
    } else if (e.button == 0) {
      placeBlock(focusBlock.x, focusBlock.z, focusBlock.y, 0);
    }
  }

}
;

window.addEventListener('wheel', e=>{
  let delta;
  e=>e.preventDefault();

  if (e.wheelDelta)
    delta = e.wheelDelta;
  else
    delta = -1 * e.deltaY;

  if (delta > 0)
    changeBlock(activeBlock == blockList.length - 1 ? 1 : activeBlock + 1);

  else if (delta < 0)
    changeBlock(activeBlock == 1 ? blockList.length - 1 : activeBlock - 1);

}
);

function changeBlock(id) {
  activeBlock = id;
  document.querySelector('#currentBlock').style.setProperty('--img', `url(textures/${blockList[id].pic})`);
}

function tick() {
  for (let x in blockData) {
    for (let z in blockData[x]) {
      for (let y in blockData[x][z]) {
        let block = blockData[x][z][y];
        switch (block) {
        case 1:
          {
            for (let x2 = -1; x2 <= 1; ++x2)
              for (let z2 = -1; z2 <= 1; ++z2)
                for (let y2 = -1; y2 <= 1; ++y2) {
                  // console.log(x - -x2 + '|' + z - -z2 + '|' + y - -y2);
                  /* console.log('X');
                                       console.log(x - -x2);
                                       console.log('Z');
                                       console.log(z - -z2);
                                       console.log('Y');
                                       console.log(y - -y2);
                                       console.log('---------------------');*/
                  if ((Math.abs(x - -x2) <= mapRadius && Math.abs(z - -z2) <= mapRadius && y - -y2 > 0 && y - -y2 <= heightLimit) && blockData[x - -x2][z - -z2][y - -y2] == 2 && blockData[x][z][y - -1] == 0 && Math.random() < .005) {
                    placeBlock(x, z, y, 2);
                  }
                }

            break;
          }
        case 10:
          {
            if (Math.random() < .15 && blockData[x][z][y - 1] == 2 && blockData[x][z][y - -1] == 0 && blockData[x][z][y - -2] == 0 && blockData[x][z][y - -3] == 0) {
              placeBlock(x, z, y, 0);
              buildStructure(x, z, y, 'tree', false);
            }
          }

        }
      }
    }
  }
}

function buildStructure(xp, zp, yp, structureName, replace) {
  let structure = structures[structureName];

  for (let x in structure) {
    for (let z in structure[x]) {
      for (let y in structure[x][z]) {
        if ((Math.abs(xp - -x) <= mapRadius && Math.abs(zp - -z <= mapRadius) && yp - -y > 0 && yp - y <= heightLimit) && (replace || blockData[xp - -x][zp - -z][yp - -y] == 0) && (structure[x][z][y] != undefined && structure[x][z][y] != -1)) {
          placeBlock(xp - -x, zp - -z, yp - -y, structure[x][z][y]);
        }
      }
    }
  }
}

buildStructure(-5, -5, 10, 'tree', false);

//player position should be represented in blocks

requestAnimationFrame(gameloop);
setInterval(tick, 1000);
