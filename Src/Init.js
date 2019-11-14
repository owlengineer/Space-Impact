function init()
{
    var ship = {
        img: new Image(),
        x: 10,
        y: 200,
        height: 31,
        width: 46
    };

    var heart = {
        imgFull: new Image(),
        imgEmpty: new Image(),
        height: 40,
        width: 40
    };

    var enemy = {
        img1: new Image(),
        img2: new Image(),
        height: 23,
        width: 46,
        spawnClock: 15
    };

    var boss = {
        img1: new Image(),
        img2: new Image(),
        height: 100,
        width: 100
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

    var bullet = {height: 5, width: 15};

    ship.img.src = "Sprites/ship_blue.png";
    heart.imgFull.src = "Sprites/heart_1.png";
    heart.imgEmpty.src = "Sprites/heart_2.png";
    soundImg.on.src = "Sprites/soundOn.png";
    soundImg.off.src = "Sprites/soundOff.png";
    enemy.img1.src = "Sprites/enemy_white1.png";
    enemy.img2.src = "Sprites/enemy_white2.png";
    boss.img1.src = "Sprites/swoop01.png";
    boss.img2.src = "Sprites/swoop02.png";

    var UIHeight = 50;

    var enemies = [];
    var shipBullets = [];
    var enemyBullets = [];
    var menuParticles = [];
    var isShipFiring = false;
    var fireRate = 15;
    var shipFireClock = fireRate;
    var maxHealth = 3;
    var health = maxHealth;
    var playing = true;
    var menu = true;
    var gif = 0;
    var score = 0;
    var bossAlive = true;
    var bossFiring = false;
    var won = false;
    var lose = false;
    var underFire = false;

    var killCounter = 0;

    var sound = false;
    var hover = false;


    var colors = [
        "#E832CC",
        "#FE6961",
        "#E6C415",
        "#C4E51B",
        "#64FE6E",
        "#29F7A1",
        "#05C3E6",
        "#6765FD",
        "#FDFF00",
        "#5dff53"
    ];

    canvas.addEventListener('mousemove', shipSetPos, false);
    canvas.addEventListener('mousemove', menuButtonHover, false);
    canvas.addEventListener('mousedown', shipStartFire, false);
    canvas.addEventListener('mousedown', onButtonClick, false);
    canvas.addEventListener('mouseup', shipStopFire, false);

    var requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;
}
