 
var PLAY = 1;
var END = 0;
var SALIDA =2;
var gameState = PLAY;

var cohete,coheteimg;
var ground;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var starGroup, star1, star2;
var escenarioImg
var score=0;
var jumpSound, collidedSound;

var gameOver,gameOverImg, restart, restartImg;
var invisibleGround
var izquierda = false;
var derecha = false;
var escenario;
function preload(){
  jumpSound = loadSound("jump.wav")
  collidedSound = loadSound("collided.wav")
  
  escenarioImg = loadImage("images.jpg")
  
  coheteimg = loadImage("cohete.png");
  
  obstacle1 = loadImage("asteroide1.png");
  obstacle2 = loadImage("asteroide2.png");
  obstacle3 = loadImage("asteroide3.png");

  star1 = loadImage("star1.png")
  star2 = loadImage("star2.png")
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  escenario = createSprite(windowWidth,windowHeight);
  escenario.addImage(escenarioImg)
  

  cohete = createSprite(width/2,height-100,20,50);
  cohete.addImage(coheteimg)
  cohete.setCollider('circle',0,0,30)
  cohete.scale = 1.8
  //cohete.debug=true

  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;

  restart = createSprite(width/2,height/2 + 30);
  restart.addImage(restartImg);
  restart.scale = 0.6;

  gameOver.visible = false;
  restart.visible = false;
  
 invisibleGround =createSprite()
 invisibleGround.visible =false

  starGroup = new Group();
  obstaclesGroup = new Group();
  obstacle1.scale =
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(0)
  drawSprites();
  textSize(20);
  fill("White")
  text("Puntuación: "+ score,30,50,);
  console.log(gameState)
  if (cohete.x > windowWidth + 100){
    gameState = END;
  }

  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    //No puedes mover una imagen, el movimiento se le aplica al sprite que tiene la imagen
    
    if(touches.length>0){
      if(touches[0].x< windowWidth/2-50){
        izquierda = true;
      }
      if(touches[0].x> windowWidth/2+50){
        derecha = true;
      }
      touches= [];
    }

    if((izquierda || keyDown(LEFT_ARROW))) {
      jumpSound.play()
      cohete.velocityX = -10;
      izquierda = false;
      
    }
    if((derecha || keyDown(RIGHT_ARROW))) {
      jumpSound.play( )
      cohete.velocityX = 10;
      derecha= false;
    }

    spawnObstacles();
    spawnStars();

    if(cohete.x<10){
      gameState = SALIDA
      console.log("salida");
    }
    if(obstaclesGroup.isTouching(cohete)){
      console.log("se detecta colision");
      collidedSound.play()
      gameState = END;
    }

    
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //establecer la velocidad de cada objeto del juego como 0
    cohete.velocityX = 0;
    cohete.x = windowWidth/2;
    obstaclesGroup.setVelocityYEach(0);
    starGroup.setVelocityYEach(0);
  
    //establecer lifetime de los objetos del juego para que no sean destruidos nunca
    obstaclesGroup.setLifetimeEach(-1);
    starGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  else if (gameState === SALIDA){
    obstaclesGroup.destroyEach();
    starGroup.destroyEach();
    reset();
  }
  
  
  
}

function spawnStars() {
  //escribir aquí el código para aparecer las nubes
  if (frameCount % 50 === 0) {
    var star = createSprite(Math.round(random(100,windowWidth)),-95,20,30)
    star.scale = 0.5;
    //star.debug =true

    star.velocityY = 5;

    var randS = Math.round(random(1,2));
    switch(randS) {
      case 1: star.addImage(star1);
              break;
      case 2: star.addImage(star2);
              break;
      default: break;
    }
     //asignar lifetime a la variable
    star.lifetime = 175;
    
    //ajustar la profundidad
    star.depth =cohete.depth;
    cohete.depth = cohete.depth+1;
    
    //agregar cada nube al grupo
    starGroup.add(star);
  }
  
}

function spawnObstacles() {
  if(frameCount % 15 === 0) {
    var obstacle = createSprite(Math.round(random(100,windowWidth)),-95,20,30);
    obstacle.setCollider('circle',0,0,25)
    //obstacle.debug = true
  
    obstacle.velocityY = (15 + 3*score/100);
    
    //generar obstáculos al azar
    var randO = Math.round(random(1,3));
    switch(randO) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3); 
              break;
      default: break;
    }
    
    //asignar escala y lifetime al obstáculo        
    obstacle.scale = 2.5;
    obstacle.lifetime = 60;
    obstacle.depth = cohete.depth;
    cohete.depth +=1;
    //agregar cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
    restart.depth = obstacle.depth + 1;
    gameOver.depth = obstacle.depth+1;
  }
}

function reset(){
  obstaclesGroup.destroyEach();
      starGroup.destroyEach();
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  cohete.x = width/2;
  
  score = 0;
  
}
