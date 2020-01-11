data = {
    p1:{
        ships: [
            {x:"1", y:"A", orientation:"V", type:"Carrier", size:"5", hits:"0"}, 
            {x:"0", y:"J", orientation:"H", type:"Battleship", size:"4", hits:"0"}, 
            {x:"5", y:"G", orientation:"V", type:"Cruiser", size:"3", hits:"0"},
            {x:"5", y:"E", orientation:"H", type:"Submarine", size:"3", hits:"0"},
            {x:"8", y:"A", orientation:"V", type:"Destroyer", size:"2", hits:"0"},
        ],
        shots:[
            {x:"1", y:"A"}, 
            {x:"1", y:"B"}, 
            {x:"1", y:"C"},
        ]
    },
    p2:{
        ships:[
            {x:"1", y:"A", orientation:"V", type:"Carrier", size:"5", hits:"0"}, 
            {x:"0", y:"J", orientation:"H", type:"Battleship", size:"4", hits:"0"}, 
            {x:"5", y:"G", orientation:"V", type:"Cruiser", size:"3", hits:"0"},
            {x:"5", y:"E", orientation:"H", type:"Submarine", size:"3", hits:"0"},
            {x:"8", y:"A", orientation:"V", type:"Destroyer", size:"2", hits:"0"},
        ],
        shots:[

        ]
    },
    newCoordinates:'',
    newShips:[
        {Carrier: "", Battleship:"" , Cruiser:"" , Submarine:"", Destroyer:"" },
    ],
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
                    container.addClass('table');
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
                                arrX[ix]='<div class="cell inside" id= p2' + letter[(iy)] + (ix-1) + ' v-on:click="addShot('+ iy +',' +  (ix-1)  +')">&nbsp;</div>';
                            }
                            else{
                                arrX[ix]='<div class="cell inside" id=p1'+ letter[(iy)] + (ix-1) + '>&nbsp;</div>';
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
            var letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'H', 'J', 'K'];
            this.p1.ships.forEach(ship => {
                //console.log(ship.y + ship.x + ship.type + ship.orientation);
                var shipX = ship.x;
                var shipY = ship.y;

                if(ship.orientation == 'H'){
                    for(var i = 0; i < ship.size; i++){
                        $("#p1" + shipY + shipX ).addClass("boat");
                        shipX++;
                    }
                }

                if(ship.orientation == 'V'){
                    var iy = letter.indexOf(shipY);
                    for(var i = 0; i < ship.size; i++){
                        shipY = letter[iy];
                        $("#p1" + shipY + shipX).addClass("boat");
                        iy++;
                    }
                }
            });

        },

        //function to load shots if is to continue a game
        loadShots(){
            var letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'H', 'J', 'K'];
            var hit = false;
            this.p1.shots.forEach(shot => {
                //console.log(shot.y + shot.x);
                hit = false;
                this.p2.ships.forEach(ship =>{
                    //console.log(ship.y + ship.x);
                    var shipX = ship.x;
                    var shipY = ship.y;

                    if(ship.orientation == 'H'){
                        for(var i = 0; i < ship.size; i++){
                            if(shot.x == shipX && shot.y == shipY){
                                $("#p2" + shot.y + shot.x).addClass("hit");
                                ship.hits++;
                                hit = true;
                            }
                            shipX++;        
                        }
                    }
                    if(ship.orientation == 'V'){
                        var iy = letter.indexOf(shipY);
                        for(var i = 0; i < ship.size; i++){
                            shipY = letter[iy];
                            if(shot.x == shipX && shot.y == shipY){
                                $("#p2" +shot.y + shot.x).addClass("hit");
                                ship.hits++;
                                hit = true;
                            }
                            iy++;
                        }
                    }
                });
                if(hit == false){
                    $("#p2"+ shot.y + shot.x).addClass("miss");
                } 
            });
            this.checkShips();
        },

        
        //function to add ships in the begging of a game
        addShips(){
            if(this.newShips.Carrier != ""){
                this.p1.ships.forEach(ship =>{
                    if(ship.type == "Carrier"){
                        this.addShip(ship, this.newShips.Carrier[1], this.newShips.Carrier[0], this.newShips.Carrier[2]);
                    }
                });
            }
            if(this.newShips.Battleship != ""){
                this.p1.ships.forEach(ship =>{
                    if(ship.type == "Battleship"){
                        this.addShip(ship, this.newShips.Battleship[1], this.newShips.Battleship[0], this.newShips.Battleship[2]);
                    }
                });
            }
            if(this.newShips.Cruiser != ""){
                this.p1.ships.forEach(ship =>{
                    if(ship.type == "Cruiser"){
                        this.addShip(ship, this.newShips.Cruiser[1], this.newShips.Cruiser[0], this.newShips.Cruiser[2]);
                    }
                });
            }
            if(this.newShips.Submarine != ""){
                this.p1.ships.forEach(ship =>{
                    if(ship.type == "Submarine"){
                        this.addShip(ship, this.newShips.Submarine[1], this.newShips.Submarine[0], this.newShips.Submarine[2]);
                    }
                });
            }
            if(this.newShips.Destroyer != ""){
                this.p1.ships.forEach(ship =>{
                    if(ship.type == "Destroyer"){
                        this.addShip(ship, this.newShips.Destroyer[1], this.newShips.Destroyer[0], this.newShips.Destroyer[2]);
                    }
                });
            }
        },

        //function to add the ship
        addShip(ship, x, y, orientation){
            var letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'H', 'J', 'K'];
            //console.log(ship.y + ship.x + ship.type + ship.orientation);
            var shipOriginalx = ship.x;
            var shipOriginaly = ship.y;
            var shipOriginalOrientation = ship.orientation;
            var shipX = x;
            var shipY = y;

            ship.x = shipX;
            ship.y = shipY;
            ship.orientation = orientation;

            console.log(ship, x, y, orientation);

            if(shipOriginalOrientation == 'H'){
                for(var i = 0; i < ship.size; i++){
                    $("#p1" + shipOriginaly + shipOriginalx).removeClass("boat");
                    shipOriginalx++;
                }
            }

            if(shipOriginalOrientation == 'V'){
                var iy = letter.indexOf(shipOriginaly);
                for(var i = 0; i < ship.size; i++){
                    shipOriginaly = letter[iy];
                    $("#p1" + shipOriginaly + shipOriginalx).removeClass("boat");
                    iy++;
                }
            }

            if(orientation == 'H'){
                for(var i = 0; i < ship.size; i++){
                    $("#p1" + shipY + shipX ).addClass("boat");
                    shipX++;    
                }
            }

            if(orientation == 'V'){
                var iy = letter.indexOf(shipY);
                for(var i = 0; i < ship.size; i++){
                    shipY = letter[iy];
                    $("#p1" + shipY + shipX).addClass("boat");
                    iy++;
                }
            }
        },

        //function to add shots
        addShot(iy, ix){
            var letter = ['&nbsp;', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'H', 'J', 'K'];
            this.p1.shots.push({'y': letter[iy], 'x': ix});
            this.showShots(letter[iy], ix);
        },

        //function to show shot to the board
        showShots(y, x){
            var letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'H', 'J', 'K'];
            var hit = false;
            this.p2.ships.forEach(ship =>{
                var shipX = ship.x;
                var shipY = ship.y;

                if(ship.orientation == 'H'){
                    for(var i = 0; i < ship.size; i++){
                        if(x == shipX && y == shipY){
                            $("#p2" + y + x).addClass("hit");
                            ship.hits++;
                            hit = true;
                        }
                        shipX++;        
                    }
                }
                if(ship.orientation == 'V'){
                    var iy = letter.indexOf(shipY);
                    for(var i = 0; i < ship.size; i++){
                        shipY = letter[iy];
                        if(x == shipX && y == shipY){
                            $("#p2"+ y + x).addClass("hit");
                            ship.hits++;
                            hit = true;
                        }
                        iy++;
                    }
                }

            });
            if(hit == false){
                $("#p2"+ y + x).addClass("miss");
            }
            this.checkShips();
        },

        //function to check the status of the ships
        checkShips(){
            this.p2.ships.forEach(ship =>{

                if(ship.hits == ship.size){
                    console.log(ship.type + " destroyed");
                }
                else{
                    console.log(ship.type + ": " + ship.hits + "/" + ship.size + " hits");
                }
            });
            console.log("--------------------");
        }

    },
    created(){
        //creates the user board
        this.addBoard("#user", "Your Board");
        //creates the opponent board
        //this.addBoard("#opponent", "Opponent Board");
        //loads the ships
        //this.addShip("#opponet");
        //this.loadShips();
        //loads the shots
        this.loadShots();
     },

    computed:{

    }
        

})