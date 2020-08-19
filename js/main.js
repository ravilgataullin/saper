
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