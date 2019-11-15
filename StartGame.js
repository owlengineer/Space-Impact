var canvas = document.getElementById("GameScene");
var c = canvas.getContext("2d");

var ship_h = 62;
var ship_w = 92;
var ship_collision_range = 31;
var curr_boss = null;

var lvl_limit_1 = 5;
var lvl_limit_2 = 10;
var lvl_limit_3 = 20;
var lvl_limit_boss = 45;
var lvl_max = 3;
var lvl_current = 1;
var attempts = 0;

// 10% chance of heal from hard fighter
var heal_drop_hard_ratio = 10;
var missile_drop_hard_ratio = 15;
var ammo_drop_hard_ratio = 15;
var lvl_heal_drop_chance = 50;

var add_health = 0;
var add_health_max = 1;

var ground = {
    img1: new Image()
}

var ship = {
    img: new Image(),
    img_laser: new Image(),
    x: 10,
    y: 200,
    height: ship_h,
    width: ship_w,
    missiles: false,
    auto: false
};

var auto_ammo = {
    capacity: 100,
    count: 100
}

var missile = {
    img: new Image(),
    img2: new Image(),
    width: 48,
    height: 30
}

var  missile_loot = {
    img1: new Image(),
    img2: new Image(),
    width: 80,
    height: 80,
    clock: 0
}

var ammo_loot = {
    img1: new Image(),
    img2: new Image(),
    img_icon: new Image(),
    width: 80,
    height: 80,
    clock: 0
}

var heart = {
    imgFull: new Image(),
    imgEmpty: new Image(),
    height: 100,
    width: 100,
    clock: 0
};

var enemy = {
    img1: new Image(),
    img2: new Image(),
    height: 42,
    width: 76,
    spawnClock: 15
};

var enemy_fighter = {
    img1: new Image(),
    height: 46,
    width: 80,
    spawnClock: 0
};

var enemy_fighter2 = {
    img1: new Image(),
    height: 46,
    width: 80,
    spawnClock: 0
};

var boss = {
    img1: new Image(),
    img2: new Image(),
    name: "Koscript",
    height: 240,
    width: 240
};

var boss_fish = {
    img: new Image(),
    img2: new Image(),
    name: "Sockets",
    height: 218,
    width: 240
};

var soundImg = {
    on: new Image(),
    off: new Image()
};

var scores = {
    easy: 50,
    medium: 100,
    hard: 300,
    boss: 5000
};

var explosion = {
    img1: new Image(),
    img2: new Image(),
    img3: new Image(),
    w1: 75,
    h1: 65,
    w2: 100,
    h2: 93,
    clock: 0
}

var bullet = {height: 9, width: 28};
var bgcolor = "#aee100";

ship.img.src = "Sprites/ship_black.png";
ship.img_laser.src = "Sprites/ship_laser.png";
heart.imgFull.src = "Sprites/heart_1.png";
heart.imgEmpty.src = "Sprites/heart_2.png";
soundImg.on.src = "Sprites/soundOn.png";
soundImg.off.src = "Sprites/soundOff.png";
enemy.img1.src = "Sprites/ameba.png";
enemy.img2.src = "Sprites/ameba.png";
enemy_fighter.img1.src = "Sprites/fighter.png";
enemy_fighter2.img1.src = "Sprites/fighter2.png";
boss.img1.src = "Sprites/swoop01.png";
boss_fish.img.src = "Sprites/fish.png";
boss_fish.img2.src = "Sprites/fish2.png";
ground.img1.src = "Sprites/ground.png";
missile.img.src = "Sprites/missile.png";
missile.img2.src = "Sprites/missile_rot.png";
explosion.img1.src = "Sprites/explode1.png"
explosion.img2.src = "Sprites/explode2.png"
explosion.img3.src = "Sprites/explode3.png"
missile_loot.img1.src = "Sprites/missile_loot1.png"
missile_loot.img2.src = "Sprites/missile_loot2.png"
ammo_loot.img1.src = "Sprites/ammo_loot1.png"
ammo_loot.img2.src = "Sprites/ammo_loot2.png"
ammo_loot.img_icon.src = "Sprites/ammo.png"

var shipShootSound = new Audio('Sounds/shiplaser.wav');
var blastSound = new Audio('Sounds/explosion.wav');
var laserSound = new Audio('Sounds/mahLazer.wav');
var ammoPickedSound = new Audio('Sounds/ammo_picked.mp3');
var missilePickedSound = new Audio('Sounds/missile_picked.mp3');
var missileLaunchSound = new Audio('Sounds/missile_launch.mp3');
var music = new Audio('Sounds/music.mp3')

music.volume = 0.05
laserSound.volume = 0.07;
shipShootSound.volume = 0.05;
blastSound.volume = 0.075;
ammoPickedSound.volume = 0.14;
missilePickedSound.volume = 0.15;
missileLaunchSound.volume = 0.12;

var ground_offset = 0;
var ground_offset_inc = 3;
var speed_ameba = 10;
var speed_fighter = 5;
var speed_fighter2 = 8;
var speed_bullet_ship = 11;
var speed_bullet_fighter = 11;
var speed_bullet_fighter2 = 12;
var speed_rocket = 15;

var damage_rocket = 40;

var UIHeight = 110;
var enemies = [];
var entities = [];
var shipBullets = [];
var enemyBullets = [];
var menuParticles = [];
var isShipFiring = false;
var fireRate = 9;
var fighter_firerate = 40;
var boss_fish_firerate = 20;
var shipFireClock = fireRate;
var maxHealth = 3;
var health = maxHealth;
var playing = false;
var menu = true;
var gif = 0;
var score = 0;
var bossAlive = true;
var bossFiring = false;
var records = false;
var won = false;
var lose = false;
var underFire = false;
var bossHP = 0;
var maxBossHP = 200;

var killCounter = 0;

var hover = false;
var sound = false;
var hover_next = false;

var colors = [
    "#000000",
];

var bgcolors = [
    "#aee100",
    "#00ae2b",
    "#17AE71",
    "#4CAE8B",
    "#8CAE3E",
    "#00903D"
];

canvas.addEventListener('mousemove', shipSetPos, false);
canvas.addEventListener('mousemove', menuFirstButtonHover, false);
canvas.addEventListener('mousemove', menuSecondButtonHover, false);
canvas.addEventListener('mousedown', shipStartFire, false);
canvas.addEventListener('mousedown', onButtonClick, false);
canvas.addEventListener('mousedown', onButtonFirstClick, false);
canvas.addEventListener('mouseup', shipStopFire, false);

document.addEventListener('keydown', launchMissiles, false);

window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

window.onload = () => {
    localStorage.setItem("records", "[]")
    playGame();
}
