"use strict";
let myHero;
let myEnemy=[];
let myBackGround;
let mySound;

let CollectibleItems=[];
let CollectibleItems1;
let CollectibleItems2;
let CollectibleItems3;
let CollectibleItems4;
let CollectibleItems5;
let CollectibleItems6;
let crashCount=0;

let rowImages = [
    'images/water-block.png',   // top row is water
    'images/stone-block.png',   //  3 row stone
    'images/grass-block.png',   // 2 row grass
];
let itemImages = [
    'images/Gem-Blue.png',
    'images/Gem-Green.png',
    'images/Gem-Orange.png',
    'images/Heart.png',
    'images/Key.png',
    'images/Star.png'    
];
// use to shuffle item image, so every time the game refresh, there are different items appear on the screen
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};




function startGame() { 
    let shuffledItems = shuffle(itemImages);  
    myHero  = new Player("images/char-boy.png",70,75,200,420);
    myBackGround= new Background(rowImages,101,83);
    myGameArea.start(); 
    myGameArea.chooseHero(); 
    myGameArea.bgSoundChange("music/op.mp3");
    // new 6 items
    CollectibleItems1 = new items(shuffledItems[0],101,83,101,40);
    CollectibleItems2 = new items(shuffledItems[1],101,83,101,205);
    CollectibleItems3 = new items(shuffledItems[2],101,83,202,120);
    CollectibleItems4 = new items(shuffledItems[3],101,83,303,205);
    CollectibleItems5 = new items(shuffledItems[4],101,83,303,40);
    CollectibleItems6 = new items(shuffledItems[5],101,83,405,125);
       
    CollectibleItems.push(CollectibleItems1,CollectibleItems2,CollectibleItems3,CollectibleItems4,CollectibleItems5,CollectibleItems6)   
}

// myGameArea object: contains methods like start(), clear(),stop(),congratulaitons(), and playAgain()
let myGameArea = {
    canvas : document.createElement("canvas"),
    start : function () {
            this.canvas.width = 505;
            this.canvas.height = 565;
            this.context = this.canvas.getContext("2d");  
            let container = document.getElementsByClassName("container");
            container[0].appendChild(this.canvas);
            this.interval=setInterval(updateGameArea,20); //refresh page for every 0.02 seconds
            this.frameNo= 0;
            window.addEventListener("keydown",function(e){ // addEventListener for keyboard
                myGameArea.key=e.keyCode;
            });

            window.addEventListener("keyup",function(e){ // addEventListener for keyboard
            myGameArea.key=false;
            });
            
    },
    shuffleItems:function(){
        shuffledItems = shuffle(itemImages)
    },
    chooseHero:function (){
        let heros=document.querySelectorAll("img")
        for (let hero of heros){
            hero.addEventListener("click",function(){
                myHero=new Player(hero.src,70,75,212.5,435);
            });
        }
    },  
    clear: function(){
            this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        },

    stop:function(){
        clearInterval(this.interval);
    },

    congratulations:function(){ //Something happens when player wins
        document.getElementsByClassName("content-1")[0].innerHTML="Congratulations! You won!"; 
        document.getElementsByClassName("content-1")[0].style.font=" bold 20px arial,serif"; 
        document.getElementsByClassName("overlay")[0].style.visibility="visible"; 
       
    },
    gameOver:function(){ //Something happens when player lose
        document.getElementsByClassName("content-1")[0].style.font=" bold 20px arial,serif"; 
        document.getElementsByClassName("overlay")[0].style.visibility="visible"; 
        document.getElementsByClassName("content-1")[0].innerHTML="Game Over";   
    },
    playAgain: function (){
        document.getElementsByClassName("overlay")[0].style.visibility="hidden"; 
        // myGameArea.shuffleItems(); 
        startGame();
    },
    bgSoundChange: function(s){
        document.getElementById("bgmusic").childNodes[1].src=s;
    
    },
    addSoundsForItem: function(h){
        document.getElementById("getItems").childNodes[1].src=h;
    },
    addSoundsForCrash:function(h){
        document.getElementById("crash").childNodes[1].src=h;
    }
  
}    
    
function Background(img,width,height){
    this.width=width;
    this.height=height;
    let numRows = 6;
    let numCols = 5;
    this.update=function(){
        for (let col = 0; col < numCols; col++) {
            let row=0
            this.image=new Image();
            this.image.src = img[0];
            myGameArea.context.drawImage(this.image, col * this.width, -51);
            for(row=1;row<4;row++){
                this.image=new Image();
                this.image.src = img[1];
                myGameArea.context.drawImage(this.image, col * this.width, row *this.height-20);
            } 
            for(row=4;row<6;row++){
                this.image=new Image();
                this.image.src = img[2];
                myGameArea.context.drawImage(this.image, col * this.width, row * this.height-20);
            }          
        }         
    }  
} 




function Player(url,width,height,x,y){
    this.sprite=new Image();
    this.sprite.src=url;
    this.x=x;
    this.y=y; 
    this.width=width;
    this.height=height;  
    this.speedX=0;
    this.speedY=0;   
}
Player.prototype.crashWith= function(otherobj){
    let myleft = this.x;
    let myright = this.x+ (this.width);
    let mytop = this.y;
    let mybottom = this.y +(this.height);
    let otherleft = otherobj.x;
    let otherright = otherobj.x+otherobj.width;
    let othertop = otherobj.y;
    let otherbottom = otherobj.y+otherobj.height;
    let crash=true;
    if((mytop>otherbottom)|| (myleft>otherright)||(mybottom<othertop)||(myright<otherleft)){
        crash=false;
    }
    return crash;
}   

Player.prototype.update=function(){
    if(this.x<-15){ //make the player cannot move off screen
        this.x=-15;
    }
    else if(this.y>420){
        this.y=420;
    }
    else if(this.x>420){
        this.x=420;
    }
    myGameArea.context.drawImage(this.sprite,this.x,this.y); 
} 

Player.prototype.newPos = function(){
    this.x+=this.speedX;
    this.y+=this.speedY;
} 

// player win when reach the water area
Player.prototype.playerWins = function(){
    let win =false;
    if (this.y<-15){
        win = true;
        myGameArea.stop();
    }
    return win;
}
Player.prototype.playerLose = function(){
    let lose =false;
    if (crashCount==3){
        lose = true;
        myGameArea.stop();
    }
    return lose;
}


function Enemies(url,width,height,x,y){
    this.sprite=new Image();
    this.sprite.src=url;
    this.width=width;
    this.height=height;
    this.x=x;
    this.y=y; 
    this.speedX=0;
    this.speedY=0;  
}

Enemies.prototype.update= function(){
    myGameArea.context.drawImage(this.sprite,this.x,this.y); 
} 
Enemies.prototype.newPos = function(){
    this.x+=this.speedX;
    this.y+=this.speedY;
} 

// items' constructor function
function items(img,width,height,x,y){
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;
    this.image=new Image();
    this.image.src = img;  
}       
items.prototype.update= function (){ 
    myGameArea.context.drawImage(this.image,this.x, this.y);  
}




function updateGameArea(){
    let x;
    let y;
    //when Player win, the game will stop and the hidden layer about congratulation will show up 
    if(myHero.playerWins()){
        myGameArea.congratulations();
        myGameArea.bgSoundChange("music/ed.mp3");
        CollectibleItems=[];    
    }

    if(myHero.playerLose()){
        myGameArea.gameOver();
        myGameArea.bgSoundChange("music/gameover.mp3");
        crashCount=0
        CollectibleItems=[];
    }
    
    // Vehicle-player collision resets the game
    // if crash with enemy, my hero will turn back to original place. My enemy will still pass the game area.
    for(let i=0; i<myEnemy.length; i++){
        if (myHero.crashWith(myEnemy[i])){
            myGameArea.addSoundsForCrash("music/crash.mp3")
            myGameArea.clear();
            myBackGround.update();
            myEnemy[i].x+=3;
            myEnemy[i].newPos();
            myEnemy[i].update();
            myHero.x=200;
            myHero.y=420;
            crashCount++
            
        }
        
    }
   

  //play can collect different items
    for (let each of CollectibleItems){
        if (myHero.crashWith(each)){
            myGameArea.addSoundsForItem("music/getitems.mp3")
            let indexOfCrash=CollectibleItems.indexOf(each)
            CollectibleItems.splice(indexOfCrash,1) 
            for (let each of CollectibleItems){
                each.update()
            }
        }   
    }
    

    
   // refresh myGameArea
    myBackGround.update();
    for (let each of CollectibleItems){
        each.update()
    }
    myGameArea.frameNo+=1;
   // control my hero to left/up/right/down
    myHero.speedX=0;
    myHero.speedY=0;
    if(myGameArea.key==37){
            myHero.speedX=-8;
    }
    if(myGameArea.key==39){
            myHero.speedX= 8;
    }
    if(myGameArea.key==38){
            myHero.speedY=-8;
    }
    if(myGameArea.key==40){
            myHero.speedY= 8;
    }
    myHero.newPos();
    myHero.update(); 
   
    // create new enemy every 100 interval (2 seconds)
    if(myGameArea.frameNo ==1||everyinterval(100)){
        x=-50;
        let maxHeight=240;
        let minHeight=100;
        let height=Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight)
        myEnemy.push(new Enemies("images/enemy-bug.png",80,70,x,height));
    }
    for(let i=0; i<myEnemy.length; i++){
        myEnemy[i].x+=3;
        myEnemy[i].update();
    }  
 
}

function everyinterval(n){
    if((myGameArea.frameNo/n)%1==0){
        return true;
    }
    return false;
}




