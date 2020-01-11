data = {
    p1:{
        ships: [
            
        ],
        shots:[
            {x: "1", y:"A"}, 
            {x: "2", y:"A"}, 
            {x: "4", y:"A"},
        ]
    },
    p2:{
        ships:[
            {x: "1", y:"A", orient:"H", type:"Carrier"}, //size: 5 
            {x: "1", y:"B", orient:"H", type:"Battleship"}, //size: 4 
            {x: "1", y:"C", orient:"H", type:"Cruiser"}, //size: 3
            {x: "1", y:"D", orient:"H", type:"Submarine"}, //size: 3
            {x: "1", y:"E", orient:"H", type:"Destroyer"}, //size: 2
        ],
        shots:[

        ]
    },
    newCoordinates:'',
    newType:''
};

new Vue({
    el:".tables",
    data: data,

    methods:{

        //function to create the board
        addBoard(id, h1){
            var createGrid=function(x,y){

                $(id).innerHTML ="<h1>" + h1 +"</h1>";

                var arrY = new Array(),
                    arrX,
                    container = $(id + "Table");
                var letter = ['&nbsp;', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'H', 'J', 'K'];
                for(var iy= 0; iy<=y; iy++){
                arrX = new Array();
                    for(var ix= 0; ix<=x; ix++){
                      
                        if(ix == 0 && iy == 0){
                            arrX[ix]='<div class="cell outside number letter">'+ letter[iy] +'</div>';
                        }
                        else if(ix == 0){
                            arrX[ix]='<div class="cell outside letter">'+ letter[iy] +'</div>';
                        }
                        else if(iy == 0){
                            arrX[ix]='<div class="cell outside number">'+ (ix-1) +'</div>';
                        }
                        else{
                            if(id == "#opponent"){
                                arrX[ix]='<div class="cell inside" id=' +letter[(iy)] + (ix-1) + ' v-on:click="addShot('+ iy +',' +  (ix-1)  +')">&nbsp;</div>';
                            }
                            else{
                                arrX[ix]='<div class="cell inside" id=' +letter[(iy)] + (ix-1) + ')">&nbsp;</div>';
                            }
                        }   
                    }
                    arrY[iy]='<div class="row">'+arrX.join("\r\n")+'</div>';
                }
                container.append(arrY.join("\r\n"));
            };
            // call function
            createGrid(10,10);
        },

        //function to load ships if is to continue a game
        loadShips(){

        },

        //function to load shots if is to continue a game
        loadShots(){
            var hit = false;
            this.p1.shots.forEach(shot => {
                //console.log(shot.y + shot.x);
                hit = false;
                this.p2.ships.forEach(ship =>{
                    //console.log(ship.y + ship.x);
                    if(shot.x == ship.x && shot.y == ship.y){
                        console.log('thas a hit');
                        $("#"+ shot.y + shot.x).addClass("hit");
                        hit = true;
                    }
                });
                if(hit == false){
                    console.log("is a miss");
                    $("#"+ shot.y + shot.x).addClass("miss");
                }
            });
        },

        //function to add ships in the begging of a game
        addShip(){

        },

        //function to add shots
        addShot(iy, ix){
            var letter = ['&nbsp;', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'H', 'J', 'K'];
            this.p1.shots.push({'y': letter[iy], 'x': ix});
            this.showShots(letter[iy], ix);
        },

        //function to show shot to the board
        showShots(y, x){
            var hit = false;
            this.p2.ships.forEach(ship =>{
                //console.log(ship.y + ship.x);
                if(x == ship.x && y == ship.y){
                    console.log('thas a hit');
                    $("#"+ y + x).addClass("hit");
                    hit = true;
                }
            });
            if(hit == false){
                console.log("is a miss");
                $("#"+ y + x).addClass("miss");
            }
        },

    },
    created(){
        //creates the user board
        this.addBoard("#user", "Your Board");
        //creates the opponent board
        this.addBoard("#opponent", "Opponent Board");
        //loads the ships
        this.loadShips();
        //loads the shots
        this.loadShots();
     },

    computed:{

    }
        

})