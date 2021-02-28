//Create variables here
var dog, happyDog, hungryDog, database, foodS, foodStock;
var addFood, feedPet, fedTime, lastFed, foodObj;

function preload()
{
  //load images here
  happyDog = loadImage("images/dogImg1.png");
  hungryDog = loadImage("images/dogImg.png");
  
}

function setup() {
  createCanvas(550, 550);
  database = firebase.database();
  dog = createSprite(275,400,40,40);
  dog.addImage(hungryDog);
  dog.scale = 0.2;
  
  foodStock = database.ref("Food");
  foodStock.on("value",readStock);

  foodObj = new Food();

  feedPet = createButton("Feed the Dog");
  feedPet.position(700,95);
  feedPet.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}


function draw() {  
  background(46,139,87);

  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value",(data)=>{
    lastFed = data.val();
  });

  textSize(18);
  fill(0);
  text("Food Remaining: "+foodS,200,250);

fill(255,255,254);
textSize(15);
if(lastFed>=12){
  text("Last Fed: "+lastFed%12 + "PM", 350, 30);
}else if(lastFed==0){
  text("Last Fed: 12 AM",350,30);
}else{
  text("Last Fed: "+lastFed+"AM",350,30);
}

  drawSprites();
  //add styles here

}

function readStock(data){
  foodS=data.val();
}

function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x = x-1;
  }

  database.ref('/').update({
    Food:x
  })
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);

  database.ref('/').update({
    food:foodObj.getFoodStock(),
    fedTime:hour()
  })
}

function addFoods(){
  foodS++;

  database.ref('/').update({
    food:foodS
  })
}
