function playGame() {

    if (health === 0) {
        if (playing === true) {
            playing = false;
            lose = true;
            for (var i = 0; i < enemies.length; i++) {
                enemies.shift();
            }
            pushExplosion(ship.x, ship.y, 1.5)
            attempts++;
            let records = localStorage.getItem("records")
            let list = JSON.parse(records);
            list.push({id: attempts, score: score});
            list.sort((a, b) => {
                return b.score - a.score;
            })
            localStorage.setItem("records", JSON.stringify(list));
        }
        ship.y = -10000;
    }

    if (menu) {
        drawMenu();
        moveMenuParticle();
        removeMenuParticles();
        canvas.style.cursor = "default";
    } else {
        if (playing && !won) {
            if(!sound)
            {
                music.currentTime = 0;
                music.loop = true;
                music.play();
                sound = true;
            }
            shipFire();
            spawnEnemy();
            spawnEntites();
            checkEnemy();
            checkEnemyBullets();
            checkShip();
            checkBoss();
            checkEntity();
            canvas.style.cursor = "none";
        }

        drawBackground();
        drawUI();
        drawMap();
        drawShip();
        drawShipBullets();
        drawEntities()
        drawEnemy();
        removeEnemy();
        drawEnemyBullets();
        removeEnemyBullets();
        removeShipBullets();
        moveMenuParticle();
        removeMenuParticles();

        if (won) {
            canvas.style.cursor = "default";
            playing = false;
            c.fillStyle = "#000000";
            c.font = "130px VT323";
            c.fillText("You Won!", 520, 300);

            drawButton(hover, "Main Menu", 570, 355, 300, 70, 580, 413)
            drawButton(hover_next, "Next Level", 570, 450, 300, 70, 580, 503)
        }

        if (lose) {
            canvas.style.cursor = "default";
            playing = false;
            c.fillStyle = "#000000";
            c.font = "130px VT323";
            c.fillText("Game Over!", 460, 300);
            drawButton(hover, "Main Menu", 570, 355, 300, 70, 580, 413)
        }
    }

    requestAnimationFrame(playGame);
}

function playAgain(){
    menu = true;
    health = maxHealth;
    score = 0;
    bossAlive = true;
    bossFiring = false;
    won = false;
    lose = false;
    underFire = false;
    killCounter = 0;

    for (var i = 0; i < enemies.length; i++) {
        enemies.shift();
    }
}

function lvlUp() {
    speed_ameba++;
    speed_fighter++;
    speed_fighter2++;
    speed_bullet_ship++;
    speed_bullet_fighter++;
    speed_bullet_fighter2++;
    lvl_current++;
}

function nextLevel() {
    bossAlive = true;
    bossFiring = false;
    won = false;
    lose = false;
    underFire = false;
    killCounter = 0;

    for (var i = 0; i < enemies.length; i++) {
        enemies.shift();
    }
    playing = true;
    add_health = 0;
    lvlUp()
}

function drawBackground() {
    var grd = c.createRadialGradient(750, 500, 5, 450, 100, 1600);
    grd.addColorStop(0, bgcolor);
    grd.addColorStop(1, "#000000");

// Fill with gradient
    c.fillStyle = grd;
    //c.fillStyle = "#aee100";
    c.fillRect(0, 0, canvas.width, canvas.height);
}

function drawUI() {

    for (var i = 0; i < maxHealth; i++)
    {
        if (i < health) {
            c.drawImage(heart.imgFull, 10 + (i * heart.width) + (i * 10), 5, heart.width, heart.height);
        } else {
            c.drawImage(heart.imgEmpty, 10 + (i * heart.width) + (i * 10), 5, heart.width, heart.height);
        }
    }

    c.fillStyle = "#000000";
    c.font = "130px VT323";
    c.fillText(score.toString(), 1100, 90);
    if(ship.missiles)
        c.drawImage(missile.img2, 960, 25, missile.width*2, missile.height*2)
    if(ship.auto)
    {
        c.fillStyle = "#696e32";
        c.fillRect(790, 15, 150 * auto_ammo.count/auto_ammo.capacity, 80)
        c.fillStyle = "#000000";
        c.strokeStyle = "#000000";
        c.strokeRect(790, 15, 150, 80);
        c.drawImage(ammo_loot.img_icon, 825, 24, ammo_loot.width, ammo_loot.height*4/5)
    }

    if (killCounter >= lvl_limit_boss) {
        for (var i = 0; i < enemies.length; i++) {
            if (enemies[i].type === "boss") {
                bossHP = enemies[i].lives;
                curr_boss = boss.name
            }
            if(enemies[i].type === "boss_fish")
            {
                bossHP = enemies[i].lives;
                curr_boss = boss_fish.name
            }
        }
        if(bossHP < 0)
            bossHP = 0;
        c.fillStyle = "#000000";
        c.font = "100px VT323";
        c.fillStyle = "#6f0000";
        c.fillRect(385, 15, 310 * bossHP/maxBossHP, 80)
        c.fillStyle = "#000000";
        c.strokeRect(385, 15, 310, 80);
        c.fillText(curr_boss, 400, 85);
    }
}

function drawShip() {
    if (!menu) {
        if(ship.auto)
        {
            c.drawImage(ship.img_laser, ship.x, ship.y, ship.width*4/3, ship.height);
        }
        else
            c.drawImage(ship.img, ship.x, ship.y, ship.width, ship.height);
        if (ship.missiles)
        {
            c.drawImage(missile.img2, ship.x + 22, ship.y-missile.height+7, missile.width, missile.height)
            c.drawImage(missile.img2, ship.x + 22, ship.y+missile.height+25, missile.width, missile.height)
        }
    }
}

function launchMissiles(ev) {
    if (ev.key === " " && playing && !won && !lose && ship.missiles)
    {
        missileLaunchSound.currentTime = 0;
        missileLaunchSound.play();
        ship.missiles = false;
        shipBullets.push({
            x:ship.x + 22,
            y:ship.y+missile.height+25,
            type: "missile"
        });
        shipBullets.push({
            x:ship.x + 22,
            y:ship.y-missile.height+7,
            type: "missile"
        });
    }
}

function shipSetPos(ev) {
    if (playing) {
        var rect = canvas.getBoundingClientRect();
        var mouseY = ev.clientY - rect.top - (ship.height / 2);
        var mouseX = ev.clientX - rect.left - (ship.width / 2);

        if (mouseX > 0 && mouseX < canvas.width * 2 / 3) {
            ship.x = mouseX;
            drawShip();
        }
        if (mouseY >= UIHeight && mouseY < canvas.height - 230) {
            ship.y = mouseY;
            drawShip();
        }
    }
}

function shipStartFire() {
    if(playing)
    {
        isShipFiring = true;
        pushShipBullet();
    }
}

function shipStopFire() {
    isShipFiring = false;
    shipFireClock = 0;
}

function pushShipBullet() {
    shipBullets.push({
        x: ship.x + ship.width,
        y: ship.y + (ship.height / 2) - 2,
        color: colors[randomInt(0, colors.length)]
    });
    shipShootSound.currentTime = 0;
    shipShootSound.play();
}

function shipFire() {
    if (isShipFiring) {
        if (ship.auto && shipFireClock % fireRate === 0) {
            pushShipBullet();
            auto_ammo.count--;
            if(auto_ammo.count <= 0)
            {
                ship.auto = false;
                auto_ammo.count = auto_ammo.capacity
            }
        }
        shipFireClock++;
    }
}

function drawShipBullets() {
    for (var i in shipBullets) {
        var _bullet = shipBullets[i];

        if(_bullet.type !== "missile") {
            c.fillStyle = _bullet.color;
            c.fillRect(_bullet.x, _bullet.y, bullet.width, bullet.height);
            _bullet.x += speed_bullet_ship;
        }
        else{
            c.drawImage(missile.img2, _bullet.x, _bullet.y, missile.width, missile.height);
            _bullet.x += speed_rocket;
        }
    }
}

function removeShipBullets() {
    if (shipBullets.length > 0 && shipBullets[0].x > canvas.width) {
        shipBullets.shift();
    }
}

function distanceToEnemy(b, e) {
    var dx = (b.x + bullet.width / 2) - (e.x + enemy.width / 2);
    var dy = (b.y + bullet.height / 2) - (e.y + enemy.height / 2);
    return Math.sqrt(dx * dx + dy * dy);
}

function distanceToShip(s, e) {
    var dx = (s.x + ship.width / 2) - (e.x + enemy.width / 2);
    var dy = (s.y + ship.height / 2) - (e.y + enemy.height / 2);
    return Math.sqrt(dx * dx + dy * dy);
}

function distanceEntityToShip(s, e_x, e_y, c_width, c_height) {
    var dx = (s.x + ship.width / 2) - (e_x + c_width / 2);
    var dy = (s.y + ship.height / 2) - (e_y + c_height / 2);
    return Math.sqrt(dx * dx + dy * dy);
}

function distanceToShipE(s, b) {
    var dx = (s.x + (ship.width / 2)) - b.x;
    var dy = (s.y + (ship.height / 2)) - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function distanceToBoss(b, e) {
    var dx = (b.x + bullet.width / 2) - (e.x + boss.width / 2);
    var dy = (b.y + bullet.height / 2) - (e.y + boss.height / 2);
    return Math.sqrt(dx * dx + dy * dy);
}

function distanceToBossLaser(bo) {
    var sh = ship.y + ship.height / 2;
    var b = bo.y + boss.height / 4;
    return Math.sqrt((sh - b) * (sh - b));
}

function spawnEntites() {
    if (killCounter >= (lvl_limit_boss * randomInt(11,15) / 20) && add_health < add_health_max && randomInt(1,100) > lvl_heal_drop_chance)
    {
        entities.push({
            x: canvas.width,
            y: randomInt(UIHeight + 10, canvas.height - 200),
            type: "heal"
        })
        add_health++;
    }
}

function drawEntities() {
    for(let i in entities)
    {
        var _entity = entities[i];
        if (_entity.type === "heal") {
            if(heart.clock === 90)
                heart.clock  = 0;
            if(heart.clock < 45)
                c.drawImage(heart.imgFull, _entity.x-(heart.width*3/8), _entity.y-(heart.width*3/8), heart.width*3/4, heart.height*3/4);
            else
                c.drawImage(heart.imgFull, _entity.x-(heart.width/3), _entity.y-(heart.width/3), heart.width*2/3, heart.height*2/3);
            heart.clock++;
        }
        else if (_entity.type === "explosion") {
            if(_entity.clock === 15)
                continue
            if(_entity.clock < 5)
                c.drawImage(explosion.img1, _entity.x-(explosion.w1*_entity.rad/4), _entity.y-(explosion.h1*_entity.rad/4), explosion.w1*_entity.rad, explosion.h1*_entity.rad);
            else if(_entity.clock > 5 && _entity.clock < 10)
                c.drawImage(explosion.img2, _entity.x-(explosion.w2*_entity.rad/4), _entity.y-(explosion.w2*_entity.rad/4), explosion.w2*_entity.rad, explosion.h2*_entity.rad);
            else if(_entity.clock > 10)
                c.drawImage(explosion.img3, _entity.x-(explosion.w2*_entity.rad/4), _entity.y-(explosion.w2*_entity.rad/4), explosion.w2*_entity.rad, explosion.h2*_entity.rad);
            _entity.clock++;
        }
        else if (_entity.type === "missile_loot") {
            if(missile_loot.clock === 80)
                missile_loot.clock  = 0;
            if(missile_loot.clock < 40)
                c.drawImage(missile_loot.img1, _entity.x-(missile_loot.width/2), _entity.y-(missile_loot.width/2), missile_loot.width, missile_loot.height);
            else
                c.drawImage(missile_loot.img2, _entity.x-(missile_loot.width/2), _entity.y-(missile_loot.width/2), missile_loot.width, missile_loot.height);
            missile_loot.clock++;
        }
        else if (_entity.type === "ammo_loot") {
            if(ammo_loot.clock === 80)
                ammo_loot.clock  = 0;
            if(ammo_loot.clock < 40)
                c.drawImage(ammo_loot.img1, _entity.x-(ammo_loot.width/2), _entity.y-(ammo_loot.width/2), ammo_loot.width, ammo_loot.height);
            else
                c.drawImage(ammo_loot.img2, _entity.x-(ammo_loot.width/2), _entity.y-(ammo_loot.width/2), ammo_loot.width, ammo_loot.height);
            ammo_loot.clock++;
        }
        _entity.x -= ground_offset_inc;
        console.log(_entity)
    }
}

function spawnEnemy() {
    if (enemies.length === 0 && killCounter >= lvl_limit_3) {
        bossAlive = false;
    }
    if (killCounter < lvl_limit_boss) {
        if (enemy.spawnClock % randomInt(60, 100) === 0) {
            enemies.push({
                x: canvas.width,
                y: randomInt(UIHeight + 10, canvas.height - 200),
                type: "easy",
            });
        }
        enemy.spawnClock++;

        if (killCounter >= lvl_limit_2) {
            if (enemy_fighter.spawnClock % randomInt(135, 350) === 0) {
                enemies.push({
                    x: canvas.width,
                    y: randomInt(UIHeight + 10, canvas.height - 200),
                    type: "medium",
                    shootClock: 0
                });
            }
            enemy_fighter.spawnClock++;
        }
        if (killCounter >= lvl_limit_3) {
            if (enemy_fighter2.spawnClock % randomInt(180, 590) === 0) {
                enemies.push({
                    x: canvas.width,
                    y: randomInt(UIHeight + 10, canvas.height - 200),
                    type: "hard",
                    shootClock: 0,
                    horizontal: randomInt(0, 1) == 0 ? 3 : -3
                });
            }
            enemy_fighter2.spawnClock++;
        }
    } else {
        if(!bossAlive && !won)
        {

            if (!bossAlive && !won && lvl_current % 2 !== 0) {
                enemies.push({
                    x: canvas.width - 400,
                    y: canvas.height / 2 - 200,
                    type: "boss",
                    shootClock: 0,
                    horizontal: randomInt(0, 1) == 0 ? 2 : -2,
                    lives: maxBossHP,
                    firing: false
                });
            }
            else if (!bossAlive && !won && lvl_current % 2 === 0) {
                enemies.push({
                    x: canvas.width - 400,
                    y: canvas.height / 2 - 200,
                    type: "boss_fish",
                    shootClock: 0,
                    horizontal: randomInt(0, 1) == 0 ? 2 : -2,
                    lives: maxBossHP,
                });
            }
            bossAlive = true;
        }
    }
}

function drawMap() {
    c.drawImage(ground.img1, ground_offset, 536, ground.img1.width,ground.img1.height);
    c.drawImage(ground.img1, ground_offset + ground.img1.width, 536, ground.img1.width,ground.img1.height);
    ground_offset -= ground_offset_inc;
    if (ground_offset <= -ground.img1.width)
        ground_offset = 0;
}

function drawEnemy() {
    for (var i in enemies) {
        var _enemy = enemies[i];


        if (_enemy.type === "easy") {
            c.drawImage(enemy.img1, _enemy.x, _enemy.y, enemy.width, enemy.height);
        } else if (_enemy.type === "medium") {
            c.drawImage(enemy_fighter.img1, _enemy.x, _enemy.y, enemy_fighter.width, enemy_fighter.height);
        } else if (_enemy.type === "hard") {
            c.drawImage(enemy_fighter2.img1, _enemy.x, _enemy.y, enemy_fighter2.width, enemy_fighter2.height);
        } else if (_enemy.type === "boss" ) {
            if (bossFiring === false) {
                c.drawImage(boss.img1, _enemy.x, _enemy.y, boss.width, boss.height);
            } else {
                c.drawImage(boss.img1, _enemy.x, _enemy.y, boss.width, boss.height);
                c.fillStyle = "#000000";
                c.fillRect(0, _enemy.y + 38, _enemy.x + 50, 50);
            }
        } else  if (_enemy.type === "boss_fish")
        {
            if (_enemy.shootClock % 40 < 20)
                c.drawImage(boss_fish.img, _enemy.x, _enemy.y, boss_fish.width, boss_fish.height);
            else
                c.drawImage(boss_fish.img2, _enemy.x+8, _enemy.y, boss_fish.width-10, boss_fish.height);
        }

        if (gif >= 1000000) {
            gif = 15;
        }

        if (_enemy.type === "easy") {
            _enemy.x -= speed_ameba;
        } else if (_enemy.type === "medium") {
            _enemy.x -= speed_fighter;

            if (_enemy.shootClock % fighter_firerate == 0) {
                enemyBullets.push({
                    x: _enemy.x,
                    y: _enemy.y,
                    type: "medium"
                });
            }
            _enemy.shootClock++;
        } else if (_enemy.type === "hard") {
            _enemy.x -= speed_fighter2;

            if (_enemy.y >= canvas.height - enemy_fighter2.height - 180 || _enemy.y <= UIHeight + 10) {
                _enemy.horizontal *= -1;
            }
            _enemy.y += _enemy.horizontal;

            if (_enemy.shootClock % 80 == 0) {
                enemyBullets.push({
                    x: _enemy.x - 20,
                    y: _enemy.y - 25,
                    type: "hard"
                });
                enemyBullets.push({
                    x: _enemy.x - 20,
                    y: _enemy.y + 30,
                    type: "hard"
                });
            }
            _enemy.shootClock++;

        } else if (_enemy.type === "boss") {
            if (_enemy.y >= canvas.height - boss.height - 205 || _enemy.y <= UIHeight) {
                _enemy.horizontal *= -1;
            }
            _enemy.y += _enemy.horizontal;

            if (_enemy.shootClock % 300 >= 0 && _enemy.shootClock % 300 <= 80) {
                bossFiring = true;
                if(_enemy.shootClock % 300 === 0)
                {
                    laserSound.currentTime = 0;
                    laserSound.play();
                }
            } else {
                bossFiring = false;
                if (_enemy.shootClock % 50 === 0) {
                    enemyBullets.push({
                        x: _enemy.x + 35,
                        y: _enemy.y + boss.height,
                        type: "hard"
                    });
                }
            }
            _enemy.shootClock++;
        } else if (_enemy.type === "boss_fish") {
            if (_enemy.y >= canvas.height - boss.height - 205 || _enemy.y <= UIHeight) {
                _enemy.horizontal *= -1;
            }
            _enemy.y += _enemy.horizontal;

            if (_enemy.shootClock % boss_fish_firerate === 0) {
                enemyBullets.push({
                    x: _enemy.x,
                    y: _enemy.y+boss_fish.height/2+20,
                    type: "medium"
                });
            }
            if(_enemy.shootClock % (boss_fish_firerate * randomInt(9,13)) === 0)
            {
                enemies.push({
                    x: _enemy.x,
                    y: _enemy.y+boss_fish.height/2,
                    type: "hard",
                    shootClock: 0,
                    horizontal: randomInt(0, 1) == 0 ? 3 : -3
                });
            }
            _enemy.shootClock++;
        }
    }
}

function drawEnemyBullets() {
    for (var i in enemyBullets) {
        var _bullet = enemyBullets[i];

        if (_bullet.type === "medium") {
            c.fillStyle = "#000000";
            c.fillRect(_bullet.x, _bullet.y, bullet.width, bullet.height);

            _bullet.x -= speed_bullet_fighter;
        } else if (_bullet.type === "hard") {
            c.fillStyle = "#000000";
            c.fillRect(_bullet.x, _bullet.y, bullet.width, bullet.height);
            _bullet.x -= speed_bullet_fighter2;
        }

    }
}

function checkEnemyBullets() {
    for (var i in enemyBullets) {
        var _bullet = enemyBullets[i];

        if (distanceToShipE(ship, _bullet) <= 20) {
            _bullet.x = 0;
            _bullet.y = -10000;

            health--;
        }
    }
}

function removeEnemyBullets() {
    if (enemyBullets.length > 0 && enemyBullets[0].x < 0) {
        enemyBullets.shift();
    }
}

function pushExplosion(x, y, rad) {
    entities.push({
        x: x,
        y: y,
        clock: 0,
        rad: rad,
        type: "explosion"
    })
    blastSound.currentTime = 0;
    blastSound.play();
}

function destroyEnemy(i) {
    let y = enemies[i].y
    let x = enemies[i].x
    enemies[i].y = -10000;
    enemies[i].x = 0;

    killCounter++;
    pushExplosion(x, y, 1.2)

    if (enemies[i].type === "easy") {
        score += scores.easy;
    } else if (enemies[i].type === "medium") {
        score += scores.medium;
        let ratio = randomInt(1,100)
        if(ratio < ammo_drop_hard_ratio) {
            entities.push({
                x: x,
                y: y,
                type: "ammo_loot"
            })
        }
    } else if (enemies[i].type === "hard") {
        score += scores.hard;
        let ratio = randomInt(1,100)
        if(ratio < heal_drop_hard_ratio) {
            entities.push({
                x: x,
                y: y,
                type: "heal"
            })
        } else if (heal_drop_hard_ratio < ratio && ratio < heal_drop_hard_ratio + missile_drop_hard_ratio) {
            entities.push({
                x: x,
                y: y,
                type: "missile_loot"
            })
        }
    }
}

function checkEnemy() {
    for (var i = 0; i < enemies.length; i++) {
        for (var j = 0; j < shipBullets.length; j++) {
            if(shipBullets[j].type === "missile" && shipBullets[j].x > canvas.width * 5/6)
            {
                pushExplosion(shipBullets[j].x, shipBullets[j].y, 1.7)
                shipBullets[j].y = -10000;
            }

            if (!won && enemies[i].type != "boss" && distanceToEnemy(shipBullets[j], enemies[i]) < enemy.width * 9 / 20) {
                if(shipBullets[j].type !== "missile")
                {
                    shipBullets[j].y = -10000;
                    shipBullets[j].x = canvas.width - bullet.width;
                }
                destroyEnemy(i);
            }

            if (!won && (enemies[i].type === "boss" || enemies[i].type === "boss_fish") && distanceToBoss(shipBullets[j], enemies[i]) < boss.width * 9 / 20) {
                if (enemies[i].lives > 0) {
                    if(shipBullets[j].type !== "missile")
                        enemies[i].lives--;
                    else {
                        pushExplosion(shipBullets[j].x, shipBullets[j].y, 1.7)
                        enemies[i].lives -= damage_rocket;
                        shipBullets[j].y = -10000;
                        shipBullets[j].x = canvas.width - bullet.width;
                    }
                }
                if(shipBullets[j].type !== "missile")
                    shipBullets[j].y = -10000;
            }
            if (!won && (enemies[i].type === "boss" || enemies[i].type === "boss_fish") && enemies[i].lives <= 0) {

                bossAlive = false;
                killCounter++;
                score += scores.boss;
                won = true;
                pushExplosion(shipBullets[j].x, shipBullets[j].y, 1.7)
                for (var x = 0; x < enemies.length; x++) {
                    enemies.pop();
                }

            }
        }
    }
}

function removeEnemy() {
    if (enemies.length > 0 && enemies[0].x <= 0) {
        enemies.shift();
    }
}

function checkShip() {
    for (var i = 0; i < enemies.length; i++) {
        if (distanceToShip(ship, enemies[i]) < ship_collision_range) {
            enemies[i].y = -10000;
            enemies[i].x = 0;

            health--;
        }
    }
}

function checkEntity() {
    for (var i = 0; i < entities.length; i++) {
        if (distanceEntityToShip(ship, entities[i].x-heart.width*3/8, entities[i].y-heart.height*3/8, heart.width*3/4, heart.height*3/4) < ship_collision_range) {

            if(entities[i].type === "heal" && health < maxHealth)
            {
                entities[i].y = -10000;
                entities[i].x = 0;
                health++;
            }
            else if(entities[i].type === "missile_loot" && !ship.missiles) {
                entities[i].y = -10000;
                entities[i].x = 0;
                missilePickedSound.currentTime = 0;
                missilePickedSound.play();
                ship.missiles = true;
            }
            else if(entities[i].type === "ammo_loot") {
                entities[i].y = -10000;
                entities[i].x = 0;
                ammoPickedSound.currentTime = 0;
                ammoPickedSound.play();
                ship.auto = true;
                auto_ammo.count = auto_ammo.capacity;
            }
        }
    }
}

function checkBoss() {
    for (var i = 0; i < enemies.length; i++) {
        if (!won && enemies[i].type === "boss") {
            if (!bossFiring) {
                underFire = false;
            }

            if (bossFiring && distanceToBossLaser(enemies[i]) < ship.height && !underFire) {
                health--;
                underFire = true;
            }
        }
    }
}