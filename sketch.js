var PLAY = 1
var END = 0
var gamestate = PLAY

var mouse, mousealive, mousedead
var cat, catimg
var ground, invGround, groundImg
var power, powerImg, powerGroup
var yarn, yarnImg, yarnGroup

var score

var gameover, restart
var gameOverImg, restartImg
var powerSound, checkpointSound, dieSound

function preload(){
    mousealive = loadImage("mousee.jpg")
    mousedead = loadImage("deadmousee.png")
    catimg = loadImage("kittykat.png")
    groundImg = loadImage("floor.png")
    powerImg = loadImage("cheesy.webp")
    yarnImg = loadImage("yarn.png")
    gameOverImg = loadImage("gameover.png")
    restartImg = loadImage("restart.jpg")

    //make sounds!!
}

function setup() {
    createCanvas(600,800)

    mouse = createSprite(500,750,20,650)
    mouse.addImage(mousealive)
    mouse.scale = 0.5
    mouse.x = 500
    mouse.y = 750
    mouse.velocityX = -2

    cat = createSprite(550,750,20,750)
    cat.addImage(catimg)
    cat.scale = 0.5
    cat.x = 550
    cat.y = 750
    cat.velocityX = -2

    ground = createSprite(300,800,600,2)
    ground.addImage(groundImg)
    ground.x = 300/2

    gameover = createSprite(300, 350)
    gameover.addImage(gameOverImg)

    restart = createSprite(300,400)
    restart.addImage(restartImg)

    gameover.scale = 0.5
    gameover.scale = 0.5

    invGround = createSprite(300,790,600,125)
    invGround.visible = false

    powerGroup = new Group()
    yarnGroup = new Group()

    mouse.setCollider("circle",0,0,40)
    mouse.debug = false

    cat.setCollider("circle",0,0,40)
    cat.debug = false

    score = 0
}

function draw() {
    background("pink")
    
    text("Score: "+score, 500, 50)

    if(gamestate === PLAY){
        console.log("Hi")
        gameover.visible = false
        restart.visible = false

        mouse.visible = true
        ground.visible = true
        cat.visible = true

        ground.velocityX = -(3 + 4*score/100)

        score = score + Math.round(frameCount/300)

        if ((score % 1000 === 0) && (score > 0)){
            //put checkpoint sound
            console.log("Hi")
        }

        if (ground.x < 0){
            ground.x = 300
        }

        if (keyDown("RIGHTARROW")){
            mouse.velocityX += 5
        }

        if(keyDown("LEFTARROW")){
            mouse.velocityX -=5

        }

        spawnYarn()
        spawnPower()

        mouse.collide(invGround)
        cat.collide(invGround)

        if (mouse.isTouching(power)){
            mouse.velocityX = mouse.velocityX - 2
        }

        if (mouse.isTouching(yarn)){
            mouse.velocityX = mouse.velocityX + 1
        }

        if (cat.isTouching(mouse)){
            gamestate = END
            //diesound
        }
    }
    
    else if (gamestate === END){
        gameover.visible = true
        restart.visible = true

        ground.velocityX = 0
        cat.velocityX = 0
        mouse.velocityX = 0
        mouse.changeImage(mousedead)

        yarn.setLifetimeEach(-1)
        power.setLifetimeEach(-1)

        yarnGroup.setVelocityXEach(0)
        powerGroup.setVelocityXEach(0)

        if (mousePressedOver(restart)){
            reset()
        }
    }
    drawSprites()
}


function spawnYarn(){
    if (frameCount % 60 === 0){
        var yarn = createSprite(300,790,600,125)
        yarn.x = Math.round(random(1,600))
        yarn.velocityX = 6 + score/100
        yarn.addImage(yarnImg)
        yarn.scale = 0.3
        yarn.lifetime = 300
        yarnGroup.add(yarn)
    }
}

function spawnPower(){
    if (frameCount % 60 === 0){
        var power = createSprite(300,790,600,125)
        power.x = Math.round(random(1,600))
        power.velocityX = 4
        power.addImage(powerImg)
        power.scale = 0.3
        power.lifetime = 300
        powerGroup.add(power)
    }
}

function reset(){
    gamestate = PLAY
    gameover.visible = false
    restart.visible = false
    yarnGroup.destroyEach()
    powerGroup.destroyEach()
    score = 0
    mouse.changeImage("alive",mousealive)
}