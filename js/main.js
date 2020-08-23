
Array.prototype.shuffle = function () {
    for (var i = this.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = this[i];
        this[i] = this[j];
        this[j] = tmp;
    };
 
    return this;
};



function genField(n, bombs){

    let random = [];

    for(let i = 0; i < n * n; i++ ){
        random.push(i);
    }
    random.shuffle();
    random = random.slice(0, bombs);



    let arr = new Array();
    for (let i =0; i < n; i++){
        arr[i] = new Array();

        for (let j = 0; j < n; j++){
            
            arr[i][j] = 0;
        }
    }

    for(let i of random){
        arr[Math.floor(i /10)][i % 10] = 1;
    }

    return arr;

}

function Field(side, bombs, canvas){
    this.context = canvas.getContext('2d');
    this.canvas = canvas;
    this.isGameOver = false;

    this.sounds = {
        win: new Audio(),
        loose: new Audio()
    }
    this.sounds.win.src = 'res/win.mp3';
    this.sounds.loose.src = 'res/loose.mp3'

    this.images = {
        closed: new Image(),
        empty: new Image(),
        bomb: new Image(),
        numbers:[
            new Image(),
            new Image(),
            new Image(),
            new Image(),
            new Image(),
            new Image(),
            new Image(),
            new Image()
        ]

    };
    this.images.closed.src = 'res/closed.png';
    this.images.empty.src = 'res/empty.png';
    this.images.bomb.src = 'res/bomb.png';

    this.images.numbers[0].src = 'res/1.png';
    this.images.numbers[1].src = 'res/2.png';
    this.images.numbers[2].src = 'res/3.png';
    this.images.numbers[3].src = 'res/4.png';
    this.images.numbers[4].src = 'res/5.png';
    this.images.numbers[5].src = 'res/6.png';
    this.images.numbers[6].src = 'res/7.png';
    this.images.numbers[7].src = 'res/8.png';

    this.bombsArray = genField(side, bombs);
    this.getState = (i, j) =>{
        if (this.bombsArray[i][j] == 1) return 9;

        let result = 0;


        [
          [i + 1,j + 1],
          [i + 1, j ],
          [i, j + 1],
          [i - 1, j - 1],
          [i - 1, j],
          [i, j - 1],
          [i + 1, j - 1],
          [i - 1, j + 1] 
        ].forEach((item)=>{
            let i = item[0], j = item[1];
            if(i == side || j == side || i < 0 || j < 0) return 0;

            result += this.bombsArray[i][j];


        });

        return result;
    };
    this.fieldArray = new Array();

    for(let i = 0; i < side; i++){
        this.fieldArray[i] = new Array();

       

        for(let j = 0 ; j < side ; j++ ){
            this.fieldArray[i][j] = {
                isChecked: false,

                state: this.getState(i, j)

            };

        }
        

    }


    this.drawField = () =>{
        
            
        for(let i = 0; i < side ; i++){
            for(let j = 0; j < side; j++){
                let cell = this.fieldArray[i][j];

                if(!cell.isChecked){
                    this.context.drawImage(this.images.closed, j * 40, i * 40);
                    
                }
                else{
                    this.context.drawImage(this.images.empty, j * 40, i * 40);
                

                    if(cell.state == 9){
                        this.context.drawImage(this.images.bomb, j * 40, i * 40);
                    
                    }
                    else if(cell.state != 0){
                        this.context.drawImage(this.images.numbers[cell.state - 1], j * 40, i * 40);
                    }
                }


                    

            }
        }

        
    };

    this.win = () =>{
        this.sounds.win.play();
        this.gameOver = true;
    };
    this.isWin = () =>{
        
        for(let i = 0; i < side; i++){
            for(let j = 0; j < side ; j++){
                let cell = this.fieldArray[i][j];
                if(cell.state == 9) continue;

                if(!cell.isChecked) return false;

            }
        }
        return true;
    }

    this.gameOver = () =>{
        for(let i of this.fieldArray){
            for(let j of i){
                j.isChecked = true;
            }
        }
        this.sounds.loose.play();
        this.isGameOver = true;
    };

    this.checkCell = (i, j) => {

        if(i == side || j == side || i < 0 || j < 0) return;

        if( this.fieldArray[i][j].isChecked) return;

        if(this.fieldArray[i][j].state < 9 && 0 <  this.fieldArray[i][j].state ){
            this.fieldArray[i][j].isChecked = true;
            return;
        }
        
        if ( this.fieldArray[i][j].state == 0){
            this.fieldArray[i][j].isChecked = true;
            [
                [i + 1,j + 1],
                [i + 1, j ],
                [i, j + 1],
                [i - 1, j - 1],
                [i - 1, j],
                [i, j - 1],
                [i + 1, j - 1],
                [i - 1, j + 1] 
              ].forEach( a => this.checkCell(a[0], a[1]));
            return;
        }
        this.fieldArray[i][j].isChecked = true;
        this.gameOver();
        return;



    }

    this.canvas.onclick = (event) =>{
        if(this.isGameOver)return;
        let rect = this.canvas.getBoundingClientRect()

        let canvasTop = rect.top;
        let canvasLeft = rect.left;

        let jCord = Math.floor((event.clientX - canvasLeft) / 40);
        let iCord = Math.floor((event.clientY - canvasTop)/40);

        if(iCord == side || jCord == side || iCord < 0 || jCord < 0) return;

        //alert(`${iCord}, ${jCord}`);
        

        this.checkCell(iCord, jCord);
        if(this.isWin() && !this.isGameOver) this.win();

        
        this.drawField();
        
    }

    this.drawField();

    this.loadCounter =0;

    this.images.closed.onload =
        this.images.empty.onload = () =>{
                this.loadCounter++;
                if(this.loadCounter == 2){
                    this.drawField();
                  
            }

        }



}

let canv = document.getElementsByClassName('game_canvas')[0];

let field = new Field(10, 10, canv);