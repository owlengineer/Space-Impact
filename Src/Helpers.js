function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// 1 button
function onButtonFirstClick(ev) {
    let ly = 450, ry = 520, lx = 570, rx = 870;

    if(menu)
    {
        var rect = canvas.getBoundingClientRect();
        var mouseX = ev.clientX - rect.left;
        var mouseY = ev.clientY - rect.top;

        if (mouseY >= ly && mouseY <= ry && mouseX >= lx && mouseX <= rx) {
            records = true;
        }
    }

    if (won || lose) {
        var rect = canvas.getBoundingClientRect();
        var mouseX = ev.clientX - rect.left;
        var mouseY = ev.clientY - rect.top;

        if (mouseY >= ly && mouseY <= ry && mouseX >= lx && mouseX <= rx) {
            nextLevel();
            bgcolor = bgcolors[randomInt(0,5)]
        }
    }
}

// 2 button
function onButtonClick(ev) {
    let ly = 355, ry = 425, lx = 570, rx = 870;
    if (menu) {
        var rect = canvas.getBoundingClientRect();
        var mouseX = ev.clientX - rect.left;
        var mouseY = ev.clientY - rect.top;

        if (mouseY >= ly && mouseY <= ry && mouseX >= lx && mouseX <= rx) {
            menu = false;
            playing = true;
        }
    }

    if(won || lose) {
        if(lose)
            setDefaults();
        var rect = canvas.getBoundingClientRect();
        var mouseX = ev.clientX - rect.left;
        var mouseY = ev.clientY - rect.top;

        if (mouseY >= ly && mouseY <= ry && mouseX >= lx && mouseX <= rx) {
            playAgain();
        }
    }
}

function setDefaults() {

    lvl_limit_1 = 5;
    lvl_limit_2 = 10;
    lvl_limit_3 = 20;
    lvl_limit_boss = 45;
    lvl_current = 1;

    speed_ameba = 10;
    speed_fighter = 5;
    speed_fighter2 = 8;
    speed_bullet_ship = 12;
    speed_bullet_fighter = 11;
    speed_bullet_fighter2 = 14;

    add_health = 0;
    ship.missiles = false;
    ship.auto = false;
}