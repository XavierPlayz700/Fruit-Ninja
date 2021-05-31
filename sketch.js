//Game States
var gameState = "menu";

var knife,fruit ,monster,fruitGroup,monsterGroup, score,highScore,r,randomFruit, position;
var knifeImage , fruit1, fruit2 ,fruit3,fruit4, monsterImage, gameOverImage, back, backgroundImage;

var logo, logoImg;
var start, stImg, restart, reImg;
var song, menu, swoosh, over;

function preload(){
  
  logoImg = loadImage("logo.png");
  stImg = loadImage("Start Button.png");
  reImg = loadImage("Restart.png");
  
  knifeImage = loadImage("knife.png");
  monsterImage = loadAnimation("alien1.png","alien2.png")
  fruit1 = loadImage("fruit1.png");
  fruit2 = loadImage("fruit2.png");
  fruit3 = loadImage("fruit3.png");
  fruit4 = loadImage("fruit4.png");
  gameOverImage = loadImage("gameover.png");
  backgroundImage = loadImage("Fruit Ninja Background.png");

  //load sound here
  menu = loadSound("Menu.mp3");
  song = loadSound("Play.mp3");
  swoosh = loadSound("swoosh.mp3");
  over = loadSound("gameover.mp3");
}



function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Background UwU
   back = createSprite(width / 2, height / 2, width, height);
   back.addImage(backgroundImage);
   back.scale = 2;
  
  //Presenting The Knife UwU
   knife=createSprite(40,200,20,20);
   knife.addImage(knifeImage);
   knife.scale=0.7;
   knife.history = [];
   knife.visible = false;
  
  //set collider for sword
  knife.setCollider("rectangle",-0,-20,75,100);
  
   logo = createSprite(width / 2, height / 4)
   logo.addImage(logoImg);
  
   start = createSprite(width / 2, height / 2 + height / 4);
   start.addImage(stImg);
   start.scale = 0.25;
  
   restart = createSprite(width / 2, height / 2 + height / 4);
   restart.addImage(reImg);
   restart.scale = 0.3;
   restart.visible = false;

  // Score variables and Groups
  score=0;
  highScore=0;
  fruitGroup=createGroup();
  monsterGroup=createGroup();
  
  swoosh.setVolume(0.5);
  
  menu.loop();
}

function draw() {
  background("lightblue");
  
    var v = createVector(knife.x, knife.y);
    
    knife.history.push(v);
  
  if (mouseWentDown(LEFT) && mouseIsOver(start) && gameState === "menu"){
    start.visible = false;
    logo.visible = false;
    
    knife.visible = true;
    
    menu.stop();
    swoosh.play();
    song.loop();
    
    knife.history = [];
    
    gameState = "play";
  }
  
  if(gameState==="play"){
    
    if (highScore <= score){
      highScore = score;
    }
    
    //Call fruits and Monster function
    fruits();
    Monster();
    
    // Move sword with mouse
    knife.y=World.mouseY;
    knife.x=World.mouseX;
  
    // Increase score if sword touching fruit
    if(fruitGroup.isTouching(knife)){
      fruitGroup.destroyEach();
      swoosh.play();
      score++;
    }
    else
    {
      // Go to end state if sword touching enemy
      if(monsterGroup.isTouching(knife)){
        song.stop();
        over.setVolume(0.5);
        over.play();
        gameState="over";
        
        //add gameover sound here
        
        fruitGroup.destroyEach();
        monsterGroup.destroyEach();
        fruitGroup.setVelocityXEach(0);
        monsterGroup.setVelocityXEach(0);
        
        // Change the animation of sword to gameover and reset its position
        knife.addImage(gameOverImage);
        knife.scale=2;
        knife.x=width / 2;
        knife.y=height / 4;
        
        // Restart Button Functions
        restart.visible = true;
      }
    }
  }
  
     if (mouseIsOver(restart) && mouseWentDown(LEFT) && gameState === "over"){
          score = 0;
       
          over.stop();
       
          knife.addImage(knifeImage);
          knife.scale = 0.7;
          knife.history = [];
          restart.visible = false;
          
          gameState = "play";
          song.loop();
        }
  
  drawSprites();
  
  if (gameState === "play"){
  for (var i = 0; i < knife.history.length; i++){
    
    var pos = knife.history[i];
    
    fill(random(0, 255), random(0, 255), random(0, 255));
    ellipse(pos.x, pos.y, 10);
  }
  
  if (knife.history.length >= 25){
    knife.history.splice(0, 1);
  }
}
  
  if (gameState === "play"){
  //Display score
  textSize(25);
  fill ("white");
  text("Score : "+ score,width / 4,50);
  }
  
  if (gameState === "over"){
  //Display High Score
  textSize(25);
  fill("white");
  text("High Score : " + highScore, 12.5, 25);
    
    if (highScore <= score){
      fill("yellow")
      text("New High Score!", 12.5, 50);
    }
  }
}


function Monster(){
  if(World.frameCount%200===0){
    monster=createSprite(width,random(0, height),20,20);
    monster.addAnimation("moving", monsterImage);
    monster.y=Math.round(random(0, height));
    //update below give line of code for increase monsterGroup speed by 10
    monster.velocityX = random(-10, -2) + score / 50;
    monster.velocityY = random(-5, 5) + score / 50;
    monster.setLifetime=width / monster.velocityX;
    
    monsterGroup.add(monster);
  }
}

function fruits(){
  if(World.frameCount%80===0){
    position = Math.round(random(1,3));
    fruit=createSprite(400,200,20,20);
    
     //using random variable change the position of fruit, to make it more challenging
    
    if(position==1)
    {
    fruit.x=width;
    //update below give line of code for increase fruitGroup speed by 4
    fruit.velocityX= -7 - score / 10;
    fruit.velocityY = random(-4, 8);
    }
    else
    {
      if(position==2){
      fruit.x=0;
      
     //update below give line of code for increase fruitGroup speed by 4
      fruit.velocityX = 7 + score / 25;
      fruit.velocityY = random(-4, 7);
      }
      
      if (position==3){
        fruit.x = random(0, width);
        fruit.y = height + 50;
        fruit.velocityX = random(-5, 5);
        fruit.velocityY = -7 - score / 10;
      }
    }
    
    fruit.scale=0.2;
     //fruit.debug=true;
     r=Math.round(random(1,4));
    if (r == 1) {
      fruit.addImage(fruit1);
    } else if (r == 2) {
      fruit.addImage(fruit2);
    } else if (r == 3) {
      fruit.addImage(fruit3);
    } else {
      fruit.addImage(fruit4);
    }
    
    fruit.y=Math.round(random(50,550));
   
    
    fruit.setLifetime=(width / fruit.velocityX) - (height / fruit.velocityY);
    
    fruitGroup.add(fruit);
  }
}