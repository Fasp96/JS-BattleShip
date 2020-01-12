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
            /*
            {x:"1", y:"A"}, 
            {x:"1", y:"B"}, 
            {x:"1", y:"C"},*/
        ]
    },
    newCoordinates:'',
    newShips:[
        {Carrier: "", Battleship:"" , Cruiser:"" , Submarine:"", Destroyer:"" },
    ],
    usedSpaces:[],
    turn_to_shoot: true,
};

var sess = JSON.parse(document.currentScript.getAttribute('sess')); //Buscar a variavel sess???
var game_id = document.currentScript.getAttribute('game_id');
var user_id = document.currentScript.getAttribute('user_id');
console.log("sess: "+JSON.stringify(sess));
var socket = io.connect();

//Recieve P2 shot
socket.on('recieve shot', function(data){
    //Verify that the message is from this game
    if(game_id==data.game_id && user_id!=data.user_id){
        //addShotP2(data.shot_y, data.shot_x, data.user_name); <---user_name tambem vai para caso que o barco seja destruido
        
        
        //P1 can now shoot
        this.turn_to_shoot = true;
    }
});

//P1 shot hitted
socket.on('hit', function(data){
    //Verify that the message is from this game
    if(game_id==data.game_id && user_id!=data.user_id){
        //ShowShotsP1(data.shoot_y, data.shoot_x, true); <---Variavel para definir a imagem do tiro?
    }
});
//P1 shot missed
socket.on('miss', function(data){
    //Verify that the message is from this game
    if(game_id==data.game_id && user_id!=data.user_id){
        //ShowShotsP1(data.shoot_y, data.shoot_x, false); <---Variavel para definir a imagem do tiro?
    }
});

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
                        $("#p1" + shipY + shipX ).addClass(ship.type + (i+1) + "H");
                        shipX++;
                    }
                }

                if(ship.orientation == 'V'){
                    var iy = letter.indexOf(shipY);
                    for(var i = 0; i < ship.size; i++){
                        shipY = letter[iy];
                        $("#p1" + shipY + shipX).addClass(ship.type + (i+1) + "V");
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
                    if(ship.type == "Carrier" && this.newShips.Carrier != ship.y + ship.x + ship.orientation){
                        this.addShip(ship, this.newShips.Carrier[1], this.newShips.Carrier[0], this.newShips.Carrier[2]);
                    }
                });
            }
            if(typeof(this.newShips.Battleship) != "undefined" && this.newShips.Battleship !== null){
                this.p1.ships.forEach(ship =>{
                    if(ship.type == "Battleship" && this.newShips.Battleship != ship.y + ship.x + ship.orientation){
                        this.addShip(ship, this.newShips.Battleship[1], this.newShips.Battleship[0], this.newShips.Battleship[2]);
                    }
                });
            }
            if(typeof(this.newShips.Cruiser) != "undefined" && this.newShips.Cruiser !== null){
                this.p1.ships.forEach(ship =>{
                    if(ship.type == "Cruiser" && this.newShips.Cruiser != ship.y + ship.x + ship.orientation){
                        this.addShip(ship, this.newShips.Cruiser[1], this.newShips.Cruiser[0], this.newShips.Cruiser[2]);
                    }
                });
            }
            if(typeof(this.newShips.Submarine) != "undefined" && this.newShips.Submarine !== null){
                this.p1.ships.forEach(ship =>{
                    if(ship.type == "Submarine" && this.newShips.Submarine != ship.y + ship.x + ship.orientation){
                        this.addShip(ship, this.newShips.Submarine[1], this.newShips.Submarine[0], this.newShips.Submarine[2]);
                    }
                });
            }
            if(typeof(this.newShips.Destroyer) != "undefined" && this.newShips.Destroyer !== null){
                this.p1.ships.forEach(ship =>{
                    if(ship.type == "Destroyer" && this.newShips.Destroyer != ship.y + ship.x + ship.orientation){
                        this.addShip(ship, this.newShips.Destroyer[1], this.newShips.Destroyer[0], this.newShips.Destroyer[2]);
                    }
                });
            }
        },

        //function to add the ship to the board
        addShip(ship, shipX, shipY, orientation){
            $('#addError').text("");
            var letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'H', 'J', 'K'];
            var colision = false;
            
            //saves the original values of the ship
            var shipOriginalx = ship.x;
            var shipOriginaly = ship.y;
            var shipOriginalOrientation = ship.orientation;
            var originalCoordinates=[];

            if(shipOriginalOrientation == 'H'){
                for(var i = 0; i < ship.size; i++){
                    originalCoordinates.push({'y': shipOriginaly, 'x': shipOriginalx});
                    shipOriginalx++;
                }
            }
            if(shipOriginalOrientation == 'V'){
                var iy = letter.indexOf(shipOriginaly);
                for(var i = 0; i < ship.size; i++){
                    shipOriginaly = letter[iy];
                    originalCoordinates.push({'y': shipOriginaly, 'x': shipOriginalx});
                    iy++;
                }
            }
            
            //verify colision and spaces
            var colisionX = shipX;
            var colisionY = shipY;
            var spaces = this.usedSpaces;

            originalCoordinates.forEach(space =>{
                spaces.pop({'y': space.y, 'x': space.x});
            });

            if(orientation == 'H'){
                for(var i = 0; i < ship.size; i++){
                    
                    if(colisionX > 9){
                        $('#addError').text("***Can't insert "+ ship.type +" is out of the board");
                        colision = true;
                    }
                    
                    spaces.forEach(space =>{
                        console.log(space.x + " " + colisionX +" and " + space.y+ " " + colisionY);
                        if(space.x == colisionX && space.y == colisionY ){
                            $('#addError').text("***Can't insert "+ ship.type +" it hits another ship");
                            colision = true;
                        }
                    });
                    colisionX++;
                }
            }

            if(orientation == 'V'){
                var iy = letter.indexOf(colisionY);
                for(var i = 0; i < ship.size; i++){
                    colisionY = letter[iy];
                    
                    if(iy > 9){
                        $('#addError').text("***Can't insert "+ ship.type +" is out of the board");
                        colision = true;
                    }

                    spaces.forEach(space =>{
                        console.log(space.x == colisionX +" " + space.y == colisionY);
                        if(space.x == colisionX && space.y == colisionY){
                            $('#addError').text("***Can't insert "+ ship.type +" it hits another ship");
                            colision = true;
                        }
                        
                    });
                    iy++;
                }
            }

            if(colision == false){

                shipOriginalx = ship.x;
                shipOriginaly = ship.y;

                //saves the new values in ship in data
                ship.x = shipX;
                ship.y = shipY;
                ship.orientation = orientation;
                

                //deletes the original ship position

                if(shipOriginalOrientation == 'H'){
                    for(var i = 0; i < ship.size; i++){
                        $("#p1" + shipOriginaly + shipOriginalx).removeClass(ship.type + (i+1) + "H");
                        this.usedSpaces.pop({'y': shipOriginaly, 'x': shipOriginalx});
                        shipOriginalx++;
                    }
                }

                if(shipOriginalOrientation == 'V'){
                    var iy = letter.indexOf(shipOriginaly);
                    for(var i = 0; i < ship.size; i++){
                        shipOriginaly = letter[iy];
                        $("#p1" + shipOriginaly + shipOriginalx).removeClass(ship.type + (i+1) + "V");
                        this.usedSpaces.pop({'y': shipOriginaly, 'x': shipOriginalx});
                        iy++;
                    }
                }

                //adds ship to the new position
                if(orientation == 'H'){
                    for(var i = 0; i < ship.size; i++){
                        $("#p1" + shipY + shipX ).addClass(ship.type + (i+1) + "H");
                        this.usedSpaces.push({'y': shipY, 'x': shipX});
                        shipX++;    
                    }
                }

                if(orientation == 'V'){
                    var iy = letter.indexOf(shipY);
                    for(var i = 0; i < ship.size; i++){
                        shipY = letter[iy];
                        $("#p1" + shipY + shipX).addClass(ship.type + (i+1) + "V");
                        this.usedSpaces.push({'y': shipY, 'x': shipX});
                        iy++;
                    }
                }
            }
        },


        verifyShips(){
            $('#addError').text("");
            var isOk = true;
            
            this.p1.ships.forEach(ship =>{
                if(ship.x == '' | ship.y ==''){
                    isOk = false;
                }
            });
            if(isOk){
                this.startGame();
            }
            else{
                $('#addError').text("***Error in inputs***");
            }
        },

        startGame(){
            var opponentIsConnected = true;
            var element = document.getElementById("addShips");
            //waits for apponent do connect
            if(opponentIsConnected == false){
                //sets the visibilty add ship hidden
                element.innerHTML = "<h1>Waiting for apponent...</h1>";
            }
            else{
                //removes add ships
                element.parentNode.removeChild(element);
                //sets the visibility of opponent board unset 
                document.getElementById("opponent").style.visibility = "unset";
                //loads the ships for the user
                this.loadShips();
                //loads the shots of user
                this.loadShotsP1();
                //load the shots of opponent
                this.loadShotsP2();
            }
        },

        //function to add the new shots from user
        addShotP1(iy, ix){
            if(this.turn_to_shoot){
                var letter = ['&nbsp;', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'H', 'J', 'K'];
                this.p1.shots.push({'y': letter[iy], 'x': ix});
                this.showShotsP1(letter[iy], ix);
                //Send shot message with the information to the server
                socket.emit('shoot player',
                    {shot_y: iy, shot_x: ix, game_id:game_id, user_id:user_id , user_name:sess.user_name});
                //End turn to shoot
                this.turn_to_shoot = false;
            }
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

        /*
        //function to add the new shots from opponent
        addShotP2(iy, ix){
            var letter = ['&nbsp;', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'H', 'J', 'K'];
            this.p2.shots.push({'y': letter[iy], 'x': ix});
            this.showShotsP2(letter[iy], ix);

            if(shot_hit()){
                socket.emit('shot hitted',
                    {shot_y: iy, shot_x: ix, game_id:game_id, user_id:user_id});
            else{
                socket.emit('shot missed',
                    {shot_y: iy, shot_x: ix, game_id:game_id, user_id:user_id});
            }
            }
        },*/

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
        },
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