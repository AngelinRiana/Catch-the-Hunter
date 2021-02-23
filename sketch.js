var player, hunter;
var playerPos = 150;
var counter = 9000, time = 90;
var speed = 0;

function preload() {
  background1img = loadImage("images/bg 1.png");
  playerImg = loadAnimation("images/Hunter 1.png","images/Hunter 2.png","images/Hunter 3.png","images/Hunter 4.png","images/Hunter 5.png","images/Hunter 6.png")
  player_end = loadAnimation("images/Hunter 2.png");
  hunterImg = loadAnimation("images/ENEMY 4.png","images/ENEMY 3.png","images/ENEMY 2.png","images/ENEMY 1.png")
  enemy_end = loadAnimation("images/ENEMY 3.png")
  fruit1 = loadImage("images/Apple.png");
  fruit2 = loadImage("images/Mango.png");
  fruit3 = loadImage("images/Banana.png");
  fruit4 = loadImage("images/orange.png");
  fruit5 = loadImage("images/Pear.png");
  fruit6 = loadImage("images/grapes.webp");
  
  obstacle1 = loadImage("images/Bush 1.png");
  obstacle2 = loadImage("images/log 1.png");
  obstacle3 = loadImage("images/Tree stump.png");
  obstacle4 = loadImage("images/logs.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  treeCut = createImg("images/tree.gif"); 
  treeCut.position(0,0);
  treeCut.size(width,height);

  setTimeout( function() {
  swal({
    title : "Save Trees",
    text : "Click on the button CHASE to catch the hunter and save the trees",
    type : "error",
    confirmButtonText : "CHASE",
    closeOnConfirm : true,
  }, 
    function () {
      treeCut.size (0,0);
      counter = 9000; 
      time = 90;
      speed = 0;
      player.frameDelay = 4; 
      hunter.frameDelay = 4; 
  }); 
  }, 3000
  );

  bg =createSprite(width/2,height/2 );
  bg.addImage(background1img);
  bg.scale = 1.4;
  bg.velocityX = -(5+speed);
  
  bg2 =createSprite(width,height/2);
  bg2.addImage(background1img);
  bg2.scale = 1.4;
  bg2.velocityX = -(5+speed);

  hunter = createSprite(width/2, height-160,  100);  
  hunter.addAnimation("escape", hunterImg);
  hunter.addAnimation("stop",enemy_end);
  hunter.scale = 0.8;

  player = createSprite(100, height-160, 50, 100); 
  player.addAnimation("running", playerImg);
  player.addAnimation("end", player_end);
  
  invisibleGround = createSprite(width/2, height-40, width, 10);
  invisibleGround.visible = false;

  fruitsGroup = new Group();

  obstaclesGroup = new Group();
} 

function draw() {
  background("green");  
  drawSprites();

  counter -= 2  ;
  time = Math.round(counter/100);  

  //console.log(hunter.frameDelay)

  textSize(50);
  textStyle(BOLD);
  fill("green");
  text("Time Left: " + time,camera.position.x+300, 50 );

  if(time > 0 && time<= 90) {
    chase(); 
  }

  if(player.isTouching(hunter) || time == 0){
    stop();
  }

  if(frameCount % 100 === 0  ) {
    //console.log(speed); 
    speed ++;
    player.frameDelay -= 0.5; 
    hunter.frameDelay -= 0.5; 
  }

  player.collide(invisibleGround);
  
}

function chase() {

  if(bg.x < 0) {
    bg.x = width/2; 
  }

  if(bg2.x < width/2) {
    bg2.x = width; 
  }

  player.x = playerPos;
  hunter.x = camera.position.x + 550;

  if(keyDown("space")) {
    player.velocityY  = -10;
  }
  player.velocityY += 0.5;
 

  fruits();
  obstacles();
  
  if(fruitsGroup.isTouching(player)) {
    fruitsGroup[0].destroy(); 
    playerPos += 100;
  }

  if(obstaclesGroup.isTouching(player)) {
    obstaclesGroup.destroyEach();   
    playerPos -= 150;
  }

  if(player.x < 150 ) {
    playerPos = 150;
  }

}

function fruits() {

  if(frameCount % 150 === 0) {
    fY = random(100, 300);
    fruit = createSprite(width,fY); 
    fruit.velocityX = -(10+ speed); 
    //fruit.scale = 0.3;
    fruit.lifetime = 300;

    var rand = Math.round(random(1,6))
      
    switch(rand) {
      case 1 : fruit.addImage(fruit1); 
               fruit.scale = 0.1;
              break;
      case 2 : fruit.addImage(fruit2); 
               fruit.scale = 0.5;
              break;
      case 3 : fruit.addImage(fruit3);
              fruit.scale = 0.3; 
              break;
      case 4 : fruit.addImage(fruit4); 
              fruit.scale = 0.3;
              break;
      case 5 : fruit.addImage(fruit5); 
              fruit.scale = 0.3;
              break;
      case 6 : fruit.addImage(fruit6);
               fruit.scale = 0.3; 
              break;
      default : break;
    }

    fruitsGroup.add(fruit); 
      
  }

}

function obstacles() {
  
  if(frameCount % 175 === 0) {
      obstacle = createSprite(width,height-90); 
      obstacle.velocityX = -(10 + speed); 
      //obstacle.scale = 0.3;
      obstacle.lifetime = 300;

      var rand = Math.round(random(1,4))
        
      switch(rand) {
        case 1 : obstacle.addImage(obstacle1); 
                  obstacle.scale = 1.2;
                break;
        case 2 : obstacle.addImage(obstacle2); 
                obstacle.scale = 0.6;
                break;
        case 3 : obstacle.addImage(obstacle3);
                obstacle.scale = 0.8; 
                break;
        case 4 : obstacle.addImage(obstacle4); 
                obstacle.scale = 1.7;
                break;
        default : break;
      }

      obstaclesGroup.add(obstacle); 
      
}

}

function stop() {
  player.changeAnimation("end", player_end);
  hunter.changeAnimation("stop",enemy_end); 
  
  var message, type;
  if (time === 0) {
    message = `Oops.....! the hunter escaped! ${"\n"} Try again`;
    type = "warning"; 
  }
  else {
    message = `Hoory! You have caught the hunter and saved the trees. ${"\n"} You are a tree saver`;
    type= "success";
  }

  swal({
    title : "Save Trees",
    text : message, 
    type : type,
    confirmButtonText : "Reset",
    closeOnConfirm : true,
  },
  function(){
    location.reload();
  }
  
  );

  bg.velocityX = 0;
  bg2.velocityX = 0;
  fruitsGroup.destoryEach();
  player.velocityX=0;
  hunter.velocityX=0;
  player.y =height-150;

  
}

