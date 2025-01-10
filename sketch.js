var spaceship;
var asteroids;
var atmosphereLoc;
var atmosphereSize;
var earthLoc;
var earthSize;
var starLocs = [];
var points = 0;

var gameoverSound;

//////////////////////////////////////////////////

function preload()
{
    soundFormats('mp3','wav','ogg');
    
    //load the sounds here
   
    gameoverSound = loadSound('./assets/gameover.wav');
    gameoverSound.setVolume(0.3);

    destroySound = loadSound('./assets/destroy.wav');
    destroySound.setVolume(0.1);

    crashSound = loadSound('./assets/crash.ogg');
    crashSound.setVolume(0.1);
    
    milestoneSound = loadSound('./assets/milestone.wav');
    milestoneSound.setVolume(0.1);

    winSound = loadSound('./assets/win.wav');
    winSound.setVolume(0.1);
    
}

function setup() {
  createCanvas(1200,800);
  spaceship = new Spaceship();
  asteroids = new AsteroidSystem();

  //location and size of earth and its atmosphere
  atmosphereLoc = new createVector(width/2, height*2.9);
  atmosphereSize = new createVector(width*3, width*3);
  earthLoc = new createVector(width/2, height*3.1);
  earthSize = new createVector(width*3, width*3);
}

//////////////////////////////////////////////////
function draw() {
  background(0);
  sky();

  spaceship.run();
  asteroids.run();

  drawEarth();
  scoreUpdate();
  milestoneTrimph();

  checkCollisions(spaceship, asteroids); // function that checks collision between various elements
}

//////////////////////////////////////////////////
//draws earth and atmosphere
function drawEarth(){
  noStroke();
  //draw atmosphere
  fill(0,0,255, 50);
  ellipse(atmosphereLoc.x, atmosphereLoc.y, atmosphereSize.x,  atmosphereSize.y);
  //draw earth
  fill(100,255);
  ellipse(earthLoc.x, earthLoc.y, earthSize.x, earthSize.y);
}

//////////////////////////////////////////////////
//checks collisions between all types of bodies
function checkCollisions(spaceship, asteroids){

    //spaceship-2-asteroid collisions
    for(var i = 0; i < asteroids.locations.length; i++)
    {
      if (isInside(spaceship.location, spaceship.size, asteroids.locations[i], asteroids.diams[i]))
      {  
          gameOver();
          gameoverSound.play(); // gameover sound
      }
    }

    //asteroid-2-earth collisions
      for(var i = 0; i < asteroids.locations.length; i++)
      {
        if(isInside(earthLoc, earthSize.x, asteroids.locations[i], asteroids.diams[i]))
        {
          gameOver();
          gameoverSound.play(); // gameover sound
        }
    }

    //spaceship-2-earth
    if(isInside(earthLoc, earthSize.x, spaceship.location, spaceship.size))
    {
      crashSound.play();
      gameOver();
      gameoverSound.play(); // gameover sound
    }


    //spaceship-2-atmosphere 
    if(isInside(atmosphereLoc, atmosphereSize.x, spaceship.location, spaceship.size))
    {
      spaceship.setNearEarth() // spaceship attrated towards atmosphere
    }

    //bullet collisions
    for(var i = 0; i < asteroids.locations.length; i++)
    {
      for(var j = 2; j < spaceship.bulletSys.bullets.length; j++)
      {
        if(isInside(spaceship.bulletSys.bullets[j], 
                    spaceship.bulletSys.diam, 
                    asteroids.locations[i], 
                    asteroids.diams[i]))
        {
            asteroids.destroy(i);
            destroySound.play(); // destroy sound
            spaceship.bulletSys.bullets.splice(j, 1) 
            points += 1; // update points when asteroids are destroyed by bullets
        }
      }
    }
    
}

//////////////////////////////////////////////////
//helper function checking if there's collision between object A and object B
function isInside(locA, sizeA, locB, sizeB){
   
    if(abs(locA.x - locB.x) < sizeA/2 + sizeB/2)
    {
      if(abs(locA.y - locB.y) < sizeA/2 + sizeB/2)
      {
        return true;
      }
    }
    return false;
}

//////////////////////////////////////////////////
function keyPressed(){
  if (keyIsPressed && keyCode === 32){ // if spacebar is pressed, fire!
    spaceship.fire();
  }
}

//////////////////////////////////////////////////

// function that ends the game by stopping the loops and displaying "Game Over"
function gameOver(){
  fill(255);
  textSize(80);
  textAlign(CENTER);
  text("GAME OVER", width/2, height/2)
  noLoop();
}

// function that updates the points when asteroids are destroyed by bullets and displays them
function scoreUpdate(){
  fill(255);
  textSize(30);
  textAlign(screenLeft);
  text("Points : " + points, 30, height-100);
}

// function that shows when milestones are fulfilled
function milestoneTrimph(){
   
    if(points > 4)
    {
      milestoneSound.play(); // milestonesound plays
      
    }

    if(points > 5)
    {
      milestoneSound.stop(); // milestonesound stops
    }

    if(points > 9)
    {
      fill(255);
      textSize(80);
      textAlign(CENTER);
      text("YOU WIN", width/2, height/2) //win sound played when level won!
      winSound.play();
      noLoop();
    }

}

//////////////////////////////////////////////////
// function that creates a star lit sky
function sky(){
  push();
  while (starLocs.length<300){
    starLocs.push(new createVector(random(width), random(height)));
  }
  fill(255);
  for (var i=0; i<starLocs.length; i++){
    rect(starLocs[i].x, starLocs[i].y,2,2);
  }

  if (random(1)<0.3) starLocs.splice(int(random(starLocs.length)),1);
  pop();
}
