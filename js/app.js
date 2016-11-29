var coordinate = {'x': 320, 'y': 320}

var level = [
    {'name': 'bedroom'},
    {'name': 'outside'},
    {'name': 'shop'}
]

var directions;

var hero;

var map;
var object;
var outside;

var sprite = {
        'x': 32,
        'y': 36,
        'nombre': 12
    };
var heroCG;

var collisions;
var collisionsCG;

var door;
var doorCG;

var house;
var houseCG;

var potion;
var potion_img;
var potionCG;

var game = new Phaser.Game(
        coordinate.x, coordinate.y,
        Phaser.CANVAS, 'game',
        { create: create, preload: preload, update: update }
    );
function preload() {
    game.load.tilemap('room', 'src/room.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('house_inside', 'src/room.json', null, Phaser.Tilemap.TILED_JSON);

    game.load.image('sol', 'src/sol.jpg');
    game.load.image('house_inside', 'src/house_inside.png');
    game.load.image('outside', 'src/outside.png');

    game.load.image('potion', 'src/potion.png');
    game.load.image('pearl', 'src/pearl.png');

    game.load.spritesheet('ranger', 'src/ranger_m.png', sprite.x, sprite.y, sprite.nombre);

}

function create() {
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.world.setBounds(0, 0, 640, 640);

    game.camera.x = 0;
    game.camera.y = 0;

    directions = game.input.keyboard.createCursorKeys();
    game.physics.p2.setImpactEvents(true);

    map = game.add.tilemap('room');

    map.addTilesetImage('sol', 'sol');
    map.addTilesetImage('outside', 'outside');
    map.addTilesetImage('sol', 'sol');
    object = game.add.tilemap('house_inside');
    object.addTilesetImage('house_inside', 'house_inside');

    heroCG = game.physics.p2.createCollisionGroup();
    doorCG = game.physics.p2.createCollisionGroup();
    houseCG = game.physics.p2.createCollisionGroup();
    collisionsCG = game.physics.p2.createCollisionGroup();
    potionCG = game.physics.p2.createCollisionGroup();

    door = game.physics.p2.convertCollisionObjects(map, "Door", true);
    door[0].setCollisionGroup(doorCG);
    door[0].collides(heroCG);
    house = game.physics.p2.convertCollisionObjects(map, "House", true);

    house[0].setCollisionGroup(houseCG);
    house[0].collides(heroCG);

    collisions = game.physics.p2.convertCollisionObjects(map, "Collisions", true);


    potion = game.physics.p2.convertCollisionObjects(map, "Potion", true);
    // potion[0].setCollisionGroup(houseCG);
    // potion[0].collides(heroCG);

    for(var collision in collisions)
    {
        collisions[collision].setCollisionGroup(collisionsCG);
        collisions[collision].collides(heroCG);
    }
    map.createLayer('room');
    object.createLayer('house_inside');

    potion_img = game.add.image(potion.x, potion.y, 'potion');
    hero = game.add.sprite(150,170, 'ranger');

    potion[0].setCollisionGroup(potionCG);

    game.physics.p2.enable(hero, false);
    hero.body.setCircle(15);
    hero.anchor.setTo(1, 1);
    hero.animations.add('left',[9,10,11],10,true);
    hero.animations.add('right',[3,4,5],10,true);
    hero.animations.add('up',[0,1,2],10,true);
    hero.animations.add('down',[6,7,8],10,true);
    hero.body.setCollisionGroup(heroCG);

    hero.body.collides(collisionsCG);
    hero.body.collides(doorCG);
    hero.body.collides(houseCG);
    hero.body.onBeginContact.add(outHandler);

    hero.frame = 3;

}
function update(){
    heroMove();
    console.log(hero.body.x);

}

function heroMove() {
    hero.body.setZeroVelocity();
    if (directions.left.isDown) {
        hero.body.x += -1;

        hero.play('left');
    } else if (directions.right.isDown) {
        hero.body.x += 1;

        hero.play('right');
    } else if (directions.up.isDown) {
        hero.body.y -= 1;
        hero.play('up');
    } else if (directions.down.isDown) {
        hero.body.y += 1;
        hero.play('down');
    } else {
        hero.animations.stop();
    }
}
function outHandler(body, shape1, shape2) {
    if(shape2.collisionGroup == doorCG.mask) {
        game.camera.x = 320;
        game.camera.y = 0;
        hero.body.x = 420;

        hero.body.y = 130;
    } else if (shape2.collisionGroup == houseCG.mask) {
        game.camera.x = 0;
        game.camera.y = 0;
        hero.body.x = 170;
        hero.body.y = 260;
    } else if(shape2.collisionGroup == potionCG.mask) {
        potion_img.kill();
    }
}


