data = {
    p1:{
        ships: [
            {x:"", y:"", orientation:"", type:"Carrier", size:"5", hits:"0"}, 
            {x:"", y:"", orientation:"", type:"Battleship", size:"4", hits:"0"}, 
            {x:"", y:"", orientation:"", type:"Cruiser", size:"3", hits:"0"},
            {x:"", y:"", orientation:"", type:"Submarine", size:"3", hits:"0"},
            {x:"", y:"", orientation:"", type:"Destroyer", size:"2", hits:"0"},
            /*{x:"1", y:"A", orientation:"V", type:"Carrier", size:"5", hits:"0"}, 
            {x:"0", y:"J", orientation:"H", type:"Battleship", size:"4", hits:"0"}, 
            {x:"5", y:"G", orientation:"V", type:"Cruiser", size:"3", hits:"0"},
            {x:"5", y:"E", orientation:"H", type:"Submarine", size:"3", hits:"0"},
            {x:"8", y:"A", orientation:"V", type:"Destroyer", size:"2", hits:"0"},*/
        ],
        shots:[
            /*{x:"1", y:"A"}, 
            {x:"1", y:"B"}, 
            {x:"1", y:"C"},*/
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
            {x:"1", y:"A"}, 
            {x:"1", y:"B"}, 
            {x:"1", y:"C"},
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
                                arrX[ix]='<div class="cell inside" id= p2' + letter[(iy)] + (ix-1) + ' v-on:click="addShotP1('+ iy +',' +  (ix-1)  +')">&nbsp;</div>';
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

        //function to load ships if it is to continue a game (only load user ships)
        loadShips(){
            var letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'H', 'J', 'K'];
            this.p1.ships.forEach(ship => {
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

        //function to load user shots if is to continue a game
        loadShotsP1(){
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
            this.checkShips("opponent");
        },

         //function to load opponent shots if is to continue a game
         loadShotsP2(){
            var letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'H', 'J', 'K'];
            var hit = false;
            this.p2.shots.forEach(shot => {
                //console.log(shot.y + shot.x);
                hit = false;
                this.p1.ships.forEach(ship =>{
                    //console.log(ship.y + ship.x);
                    var shipX = ship.x;
                    var shipY = ship.y;

                    if(ship.orientation == 'H'){
                        for(var i = 0; i < ship.size; i++){
                            if(shot.x == shipX && shot.y == shipY){
                                $("#p1" + shot.y + shot.x).addClass("hit");
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
                                $("#p1" +shot.y + shot.x).addClass("hit");
                                ship.hits++;
                                hit = true;
                            }
                            iy++;
                        }
                    }
                });
                if(hit == false){
                    $("#p1"+ shot.y + shot.x).addClass("miss");
                } 
            });
            this.checkShips("user");
        },

        //function to add ships in the begging of a game (if is a new game)
        addShips(){
            if(typeof(this.newShips.Carrier) != "undefined" && this.newShips.Carrier !== null){
                this.p1.ships.forEach(ship =>{
                    if(ship.type == "Carrier"){
                        this.addShip(ship, this.newShips.Carrier[1], this.newShips.Carrier[0], this.newShips.Carrier[2]);
                    }
                });
            }
            if(typeof(this.newShips.Battleship) != "undefined" && this.newShips.Battleship !== null){
                this.p1.ships.forEach(ship =>{
                    if(ship.type == "Battleship"){
                        this.addShip(ship, this.newShips.Battleship[1], this.newShips.Battleship[0], this.newShips.Battleship[2]);
                    }
                });
            }
            if(typeof(this.newShips.Cruiser) != "undefined" && this.newShips.Cruiser !== null){
                this.p1.ships.forEach(ship =>{
                    if(ship.type == "Cruiser"){
                        this.addShip(ship, this.newShips.Cruiser[1], this.newShips.Cruiser[0], this.newShips.Cruiser[2]);
                    }
                });
            }
            if(typeof(this.newShips.Submarine) != "undefined" && this.newShips.Submarine !== null){
                this.p1.ships.forEach(ship =>{
                    if(ship.type == "Submarine"){
                        this.addShip(ship, this.newShips.Submarine[1], this.newShips.Submarine[0], this.newShips.Submarine[2]);
                    }
                });
            }
            if(typeof(this.newShips.Destroyer) != "undefined" && this.newShips.Destroyer !== null){
                this.p1.ships.forEach(ship =>{
                    if(ship.type == "Destroyer"){
                        this.addShip(ship, this.newShips.Destroyer[1], this.newShips.Destroyer[0], this.newShips.Destroyer[2]);
                    }
                });
            }
        },

        //function to add the ship to the board
        addShip(ship, shipX, shipY, orientation){
            var letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'H', 'J', 'K'];
            //saves the original values of the ship
            var shipOriginalx = ship.x;
            var shipOriginaly = ship.y;
            var shipOriginalOrientation = ship.orientation;
            
            //saves the new values in ship in data
            ship.x = shipX;
            ship.y = shipY;
            ship.orientation = orientation;

            //deletes the original boat position

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

            //adds the boat in the new position

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

        startGame(){
            //sets the visibilty add ship hidden
            document.getElementById("addShips").style.visibility = "hidden";
            var element = document.getElementById("addShips");
            element.parentNode.removeChild(element);
            //sets the visibility of opponent board unset 
            document.getElementById("opponent").style.visibility = "unset";
            //loads the ships for the user
            this.loadShips();
            //loads the shots of user
            this.loadShotsP1();
            //load the shots of opponent
            this.loadShotsP2();
        },

        //function to add the new shots from user
        addShotP1(iy, ix){
            var letter = ['&nbsp;', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'H', 'J', 'K'];
            this.p1.shots.push({'y': letter[iy], 'x': ix});
            this.showShotsP1(letter[iy], ix);
        },

        //function to show the new shots from user in the board
        showShotsP1(y, x){
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
            this.checkShips("opponent");
            this.checkShips("user");
        },


        //function to add the new shots from opponent
        addShotP2(iy, ix){
            var letter = ['&nbsp;', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'H', 'J', 'K'];
            this.p2.shots.push({'y': letter[iy], 'x': ix});
            this.showShotsP2(letter[iy], ix);
        },

        //function to show the new shots from opponent in the board
        showShotsP2(y, x){
            var letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'H', 'J', 'K'];
            var hit = false;
            this.p1.ships.forEach(ship =>{
                var shipX = ship.x;
                var shipY = ship.y;

                if(ship.orientation == 'H'){
                    for(var i = 0; i < ship.size; i++){
                        if(x == shipX && y == shipY){
                            $("#p1" + y + x).addClass("hit");
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
                            $("#p1"+ y + x).addClass("hit");
                            ship.hits++;
                            hit = true;
                        }
                        iy++;
                    }
                }

            });
            if(hit == false){
                $("#p1"+ y + x).addClass("miss");
            }
            this.checkShips("opponent");
            this.checkShips("user");
        },


        //function to check the status of the ships
        checkShips(player){
            if(player =="opponent"){
                console.log("Opponent Ships");
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
            if(player =="user"){
                console.log("User Ships");
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
        }

    },
    created(){
        //creates the user board
        this.addBoard("#user", "Your Board");   
        //creates the opponent board
        this.addBoard("#opponent", "Opponent Board");
        
        //if aleady has ships postions
        if(this.p1.ships[0].x == ""){
            //shows the menu to add ships
            document.getElementById("addShips").style.visibility = "unset";
            //hiddes the opponent board
            document.getElementById("opponent").style.visibility = "hidden";
        }
        //else start the game to continue
        else{
            this.startGame();
        }
     },

    computed:{

    }
        

})