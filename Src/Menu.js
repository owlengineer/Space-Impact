
function drawButton(flag, text, x,y,w,h, xo, yo) {
    if (!flag) {
        c.strokeStyle = "#000000";
        c.lineWidth = 4;
        c.strokeRect(x, y, w, h);
        c.fillStyle = "#000000";
        c.font = "70px VT323";
        c.fillText(text, xo, yo);
    } else {
        c.fillStyle = "#059900";
        c.fillRect(x, y, w, h);
        c.strokeStyle = "#000000";
        c.lineWidth = 4;
        c.strokeRect(x, y, w, h);
        c.fillStyle = "#000000";
        c.font = "70px VT323";
        c.fillText(text, xo, yo);
    }
}

function drawMenu() {

    drawBackground();

    if (randomInt(0, 3) === 0) {
        menuParticles.push({
            x: canvas.width,
            y: randomInt(0, canvas.height),
            color: colors[randomInt(0, colors.length)],
            w: randomInt(4, 20)
        });
    }

    for (var i in menuParticles) {
        var particle = menuParticles[i];

        c.fillStyle = particle.color;
        c.fillRect(particle.x, particle.y, particle.w, 4);
    }

    c.fillStyle = "#151515";
    c.font = "120px VT323";
    c.fillText("Space Impact", 430, 300);
    drawButton(hover, "Play Game", 570, 355, 300, 70, 580, 413)

    c.fillText("Records:", 610, 490);
    let recordsList = localStorage.getItem("records");
    let list = JSON.parse(recordsList);
    for (let i in list) {
        if (i > 2)
            break;
        c.fillText((parseInt(i)+1) + ": " + list[i].score, 610, 560 + i * 50);
    }

    c.fillStyle = "#ffffff";
    c.font = "16px";
}

function menuSecondButtonHover(ev, ly=450, ry=520, lx=570, rx=870) {
    if (menu) {
        var rect = canvas.getBoundingClientRect();
        var mouseX = ev.clientX - rect.left;
        var mouseY = ev.clientY - rect.top;

        if (mouseY >= ly && mouseY <= ry && mouseX >= lx && mouseX <= rx) {
            hover_next = true;
        } else {
            hover_next = false;
        }
    }

    if(won || lose){
        var rect = canvas.getBoundingClientRect();
        var mouseX = ev.clientX - rect.left;
        var mouseY = ev.clientY - rect.top;

        if (mouseY >= ly && mouseY <= ry && mouseX >= lx && mouseX <= rx) {
            hover_next = true;
        } else {
            hover_next = false;
        }
    }
}

function menuFirstButtonHover(ev, ly=355, ry=425, lx=425, rx=870) {
    if (menu) {
        var rect = canvas.getBoundingClientRect();
        var mouseX = ev.clientX - rect.left;
        var mouseY = ev.clientY - rect.top;

        if (mouseY >= ly && mouseY <= ry && mouseX >= lx && mouseX <= rx) {
            hover = true;
        } else {
            hover = false;
        }
    }

    if(won || lose){
        var rect = canvas.getBoundingClientRect();
        var mouseX = ev.clientX - rect.left;
        var mouseY = ev.clientY - rect.top;

        if (mouseY >= ly && mouseY <= ry && mouseX >= lx && mouseX <= rx) {
            hover = true;
        } else {
            hover = false;
        }
    }
}

function removeMenuParticles() {
    if (menuParticles.length > 0 && menuParticles[0].x < 0) {
        menuParticles.shift();
    }
}

function moveMenuParticle() {
    for (var i in menuParticles) {
        var particle = menuParticles[i];
        particle.x -= 12;
    }
}