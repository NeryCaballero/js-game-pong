// Variables :

let canvas = document.getElementById('gameCanvas'); 
let canvasContext = canvas.getContext('2d');

let background = new Image();
background.src = "bg.jpg";

let xBall = canvas.width/2;                                                                  // initial position of the ball at the begining of the game: center of the gameboard
let yBall = canvas.height/2;
let rBall = 20;                                                                              // ball size

let xBallSpeed = 4; 
let yBallSpeed = xBallSpeed / 2;

let rightEdge = canvas.width;
let bottomEdge = canvas.height;

const PADDLE_SIZE = 150;
const PADDLE_THICKNESS = 10;
const PADDLE_PADDING = 15;

let paddle1y = canvas.height/2 - PADDLE_SIZE/2;                                             //  initial position of the paddle at the begining of the game: middle of the screen
let paddle1x = PADDLE_PADDING;

let paddle2y = canvas.height/2 - PADDLE_SIZE/2;
let paddle2x = rightEdge - PADDLE_THICKNESS - PADDLE_PADDING;

let p1Color = '#FDCBFC';
let p2Color = '#BBB7F6';
let ballColor = '#FEF900';
let netColor = 'white';
let messageColor = '#FFFF78';
let continueColor = '#8AE035';

let p1Score = 0;
let p2Score = 0;
const WINNING_SCORE = 5;

let messageOnScreen = false;                                           


// Functions which draw the game elements : 

function drawRectangle(fillColor, leftX, topY, rightX, bottomY){                                                        // shorthand functions to draw a rectangle
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(leftX, topY, rightX, bottomY);
}

function drawCircle(fillColor, x, y, r){                                                                                // shorthand functions to draw a circle
    canvasContext.fillStyle = fillColor;                                    
    canvasContext.beginPath();
    canvasContext.arc(x, y, r, 0, Math.PI*2, true);                
    canvasContext.fill();
}

function drawShadow(color, blur){                                                                                       // shorthand functions to draw shadows
    canvasContext.shadowColor = color;
    canvasContext.shadowOffsetX = 0; 
    canvasContext.shadowOffsetY = 0;
    canvasContext.shadowBlur = blur;                                                                                    //Blurring effect to the shadow, the larger the value, the greater the blur.
}

function drawNet() {
    for (let i=5; i<canvas.height; i+=40){
        drawShadow(netColor, 10);
        drawRectangle(netColor, canvas.width/2 - 1, i, 3, 30);
    }
}

function drawGameElements(){                                                                                            //drawRectangle('#001437', 0, 0, canvas.width, canvas.height);   //What if loadingnthe img fails?                         // draw game board
                                                             
    canvasContext.font = "120px Monospace";     

    canvasContext.fillStyle = p1Color;
        drawShadow(p1Color, 40);
        canvasContext.fillText(p1Score, canvas.width/2 - 100, 120);                                                     // draw p1 score

    drawRectangle(p1Color, paddle1x, paddle1y, PADDLE_THICKNESS, PADDLE_SIZE);                                          // draw left paddle1


    canvasContext.fillStyle = p2Color;
    drawShadow(p2Color, 40);
    canvasContext.fillText(p2Score, canvas.width/2 + 30, 120);                                                          // draw p2(computer) score
    
    drawRectangle(p2Color, paddle2x, paddle2y, PADDLE_THICKNESS, PADDLE_SIZE);                                          // draw right paddle2


    if (messageOnScreen) {                                                                                             // if messageOnScreen is true, display You Won message.
        
        canvasContext.font = "80px Monospace";

        if (p1Score >= WINNING_SCORE) {
            canvasContext.fillStyle = messageColor;
            drawShadow(messageColor, 70);
            canvasContext.fillText("YOU WON!", canvas.width*0.295, canvas.height*0.53); 

        } else if (p2Score >= WINNING_SCORE) {
            canvasContext.fillStyle = messageColor;
            drawShadow(messageColor, 60);
            canvasContext.fillText("GAME OVER", canvas.width*0.225, canvas.height*0.53);
        }
        
        canvasContext.font = "20px Monospace";
        canvasContext.fillStyle = continueColor;
        drawShadow(continueColor, 40);
        canvasContext.fillText("Click to Continue", canvas.width*0.37, canvas.height*0.8);
        return;
    }

    
  drawNet();                                                                                                            // draw net

  drawShadow(ballColor, 40);
  drawCircle(ballColor, xBall, yBall, rBall);                                                                           // draw ball


}

// Function which moves the right paddle automatically

function rightPaddleMovement() {                    
    let paddle2yCenter = paddle2y + (PADDLE_SIZE/2);                                                                    // paddle center is the top y coordinate plus half of its height
    let margin = PADDLE_SIZE * 0.4

    if (paddle2yCenter < yBall-margin){                                                                                 // if the center of the paddle is below the y position of the ball 
        paddle2y+=2;                                                                                                    // move the paddle down
    } else if (paddle2yCenter > yBall+margin){                                                                          // else if the center of the paddle is above the y position of the ball
        paddle2y -=2;                                                                                                   // move the paddle up
    }
}

// Function which moves the ball

function ballReset() {
    if (p1Score >= WINNING_SCORE ||
        p2Score >= WINNING_SCORE) {
            
        messageOnScreen = true;                                                                                        // if p1 or p2 reaches the WINNING_SCORE, messageOnScreen becomes true.
    }

    xBallSpeed = -xBallSpeed;                                                                                           // inverse the sense of the ball, 
    xBall = canvas.width/2                                                                                              // and put it in the middle of the screen 
    yBall = canvas.height/2
}

function moveGameElements(){

    if (messageOnScreen) {                                                                                             // if messageOnScreen,
        return;                                                                                                         // skip the rest of this code.
    }

    rightPaddleMovement();                                                                                              // start right paddle automatic movement.

    xBall += xBallSpeed;
    yBall += yBallSpeed;


    
    if (xBall <= paddle1x + PADDLE_THICKNESS + rBall && 
        yBall >= paddle1y &&                                                                                            // if the ball hits paddle1 
        yBall <= paddle1y+PADDLE_SIZE) {
                xBallSpeed = -xBallSpeed;                                                                               // inverse the horizontal direction 
                let deltaY = yBall - (paddle1y+(PADDLE_SIZE/2));                                                                    // deltaY is a factor that will proportionally increase the yBallSpeed if hit with the edges of the paddle.
                yBallSpeed = deltaY * 0.1;                                                                              // and adjust the vertical speed accordingly. 

    } else if (xBall <= 0){                                                                                             // otherwise 
        p2Score++;                                                                                                      // increase p2Score and reset the ball;
        ballReset();
    }


    if (xBall >= paddle2x - rBall && 
        yBall >= paddle2y && 
        yBall <= paddle2y+PADDLE_SIZE) {
                xBallSpeed = -xBallSpeed;
                let deltaY = yBall - (paddle2y+(PADDLE_SIZE/2));
                yBallSpeed = deltaY * 0.1;

    } else if (xBall >= rightEdge) {
                p1Score++;
                ballReset();
    }
 
    if(yBall <= rBall){                                                                                                 // if the ball reaches the top (rBall accounts fot the size of the ball)                 
        yBallSpeed = -yBallSpeed;                                                                                       // inverse the vertical direction.
    }

    if(yBall > bottomEdge-rBall){
        yBallSpeed = -yBallSpeed;
    }
}

function calculateMousePos(evt){
    let gameArea = canvas.getBoundingClientRect();                          // The Element.getBoundingClientRect() method returns a DOMRect object providing information about the size of an element and its position relative to the viewport.
    let root = document.documentElement;
    let mouseX = evt.clientX - gameArea.left - root.scrollLeft;             // The clientX read-only property of the MouseEvent interface provides the horizontal coordinate within the application's viewport at which the event occurred. Same for clientY
    let mouseY = evt.clientY - gameArea.top - root.scrollTop;               // The Element.scrollTop property gets or sets the number of pixels that an element's content is scrolled vertically.
    
    return {                                                                // returns AN OBJECT.
        x:mouseX,
        y:mouseY
    };
}

// Function to restart the game

function clickToContinue(){
    if (messageOnScreen) {                                                             // if there is a message on the screen
        p1Score = 0;                                                                   // reset both Scores
        p2Score = 0; 
        messageOnScreen = false;                                                       // and set messageOnScreen to false
    }
}

// Function to run the game

function callFunctions(){ 
    canvasContext.drawImage(background,0,0);                        // load the bg-img            
    drawGameElements();                                             // draw
    moveGameElements();                                             // move
}

window.onload = function () {                                       // The load event is fired when the whole page has loaded, including all dependent 
                                                                    // resources such as stylesheets and images. This is in contrast to DOMContentLoaded, 
                                                                    // which is fired as soon as the page DOM has been loaded, without waiting for resources to finish loading.
    let fps = 60;                                                   
    setInterval(callFunctions, 1000/fps);                           // 60 times per second, fire drawGameElements() and moveGameElements()

    canvas.addEventListener('click', clickToContinue);

    canvas.addEventListener('mousemove', function(evt){             // listen for 'mousemove' 
            let mousePos = calculateMousePos(evt);                  // get the x and y position of the mouse
            paddle1y = mousePos.y - (PADDLE_SIZE/2);                // assign it to paddle1y , P_S/2 works to control the paddle from the center, if removed the mouse position will be the top of the paddle.
        });
}