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

var opponent_table = document.createElement('div');
opponent_table.id = "opponent";
opponent_table.innerHTML = `<h1>Opponent Board</h1><div id = "opponentTable"></div>`

//Html of user table to add later
user_table_html = `<div id ="user">
                        <h1>User Board</h1>
                        <div id = "userTable"></div>
                    </div>`

//return to the main page
function returnToMain(){
    //send leave message to server
    socket.emit('left onePlayer game', {game_id: game_id});
    location.href = "/";
}

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
        addBoard(id){
            var createGrid=function(x,y){
                var arrY = new Array(),
                    arrX,
                    container = $(id + "Table");
                    container.addClass('table');
                var letter = ['&nbsp;', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'H', 'J', 'K'];
                for(var iy= 0; iy<=y; iy++){
                    arrX = new Array();
                    for(var ix= 0; ix<=x; ix++){
                    
                        if(ix == 0 && iy == 0){ //if to add the empty space on (0,0)
                            arrX[ix]='<div class="cell outside number letter">'+ letter[iy] +'</div>';
                        }
                        else if(ix == 0){ //if to add the letters on top (0,y)
                            arrX[ix]='<div class="cell outside letter">'+ letter[iy] +'</div>';
                        }
                        else if(iy == 0){ //if to add the numbers on the left (x,0)
                            arrX[ix]='<div class="cell outside number">'+ (ix-1) +'</div>';
                        }
                        else{//adds the rest of the fields
                            if(id == "#opponent"){ // if is the opponent table will have different id and will have the v-on:click function
                                arrX[ix]='<div class="cell inside" id= p2' + letter[(iy)] + (ix-1) + ' v-on:click="addShotP1('+ iy +',' +  (ix-1)  +')">&nbsp;</div>';
                            }
                            else{ // if is the user table will not have the v-on:click
                                arrX[ix]='<div class="cell inside" id=p1'+ letter[(iy)] + (ix-1) + '>&nbsp;</div>';
                            }
                        }   
                    }
                    arrY[iy]='<div class="row">'+arrX.join("\r\n")+'</div>';
                }
                container.append(arrY.join("\r\n"));
            };
            createGrid(10,10);
        },

        //function to load ships if it's to continue a game (only load user ships)
        loadShips(){
            var letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'H', 'J', 'K'];
            
            this.p1.ships.forEach(ship => { //for each ship of user
                var shipX = ship.x;
                var shipY = ship.y;

                if(ship.orientation == 'H'){ // if his orientation is H
                    for(var i = 0; i < ship.size; i++){ //for the length of the ship

                        //add the class with the corresponding photo for the ship
                        $("#p1" + shipY + shipX ).addClass(ship.type + (i+1) + "H");
                        shipX++;
                    }
                }

                if(ship.orientation == 'V'){// if his orientation is V
                    var iy = letter.indexOf(shipY);
                    for(var i = 0; i < ship.size; i++){ //for the length of the ship
                        shipY = letter[iy];
                        //add the class with the corresponding photo for the ahip
                        $("#p1" + shipY + shipX).addClass(ship.type + (i+1) + "V");
                        iy++;
                    }
                }
            });

        },

        //function to load user shots on opponent board if is to continue a game
        loadShotsP1(){
            var letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'H', 'J', 'K'];
            var hit = false;
            this.p1.shots.forEach(shot => { // for each shot of user
                hit = false;

                this.p2.ships.forEach(ship =>{ //for each ship of opponent 
                    var shipX = ship.x;
                    var shipY = ship.y;

                    if(ship.orientation == 'H'){ // if the ship is horizontal
                        for(var i = 0; i < ship.size; i++){ //for the length of the ship
                            if(shot.x == shipX && shot.y == shipY){ //if is in the same position
                                //adds the class hit
                                $("#p2" + shot.y + shot.x).addClass("hit");
                                ship.hits++;
                                //change variable to true
                                hit = true;
                            }
                            shipX++;        
                        }
                    }
                    if(ship.orientation == 'V'){  // if the ship is vertical
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

                if(hit == false){ // if the shot didn't hit any of the apponent ships 
                    //adds class miss to the position
                    $("#p2"+ shot.y + shot.x).addClass("miss");
                } 
            });
            //show in console the status of apponents ships
            this.checkShips("opponent");
        },

         //function to load opponents shots on user board if is to continue a game
         loadShotsP2(){
            var letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'H', 'J', 'K'];
            var hit = false;
            this.p2.shots.forEach(shot => { // for each shot of opponent
                hit = false;
                this.p1.ships.forEach(ship =>{ // for each user ship
                    var shipX = ship.x;
                    var shipY = ship.y;

                    if(ship.orientation == 'H'){ // if the ship is horizontal
                        for(var i = 0; i < ship.size; i++){ //for the length of the ship
                            if(shot.x == shipX && shot.y == shipY){ //if is in the same position
                                //adds the class hit
                                $("#p1" + shot.y + shot.x).addClass("hit");
                                ship.hits++;
                                //change variable to true
                                hit = true;
                            }
                            shipX++;        
                        }
                    }
                    if(ship.orientation == 'V'){ // if the ship is vertical
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
                if(hit == false){ // if the shot didn't hit any of the user ships 
                    //adds class miss to the position
                    $("#p1"+ shot.y + shot.x).addClass("miss");
                } 
            });
            //show in console the status of users ships
            this.checkShips("user");
        },

        //function to add ships in the begging of a game (if is a new game)
        addShips(){
            if(typeof(this.newShips.Carrier) != "undefined" && this.newShips.Carrier !== null){ //is has been added an input for Carrier
                this.p1.ships.forEach(ship =>{
                    //gets the ship object and veifies if isn't in the same coordinates
                    if(ship.type == "Carrier" && this.newShips.Carrier != ship.y + ship.x + ship.orientation){
                        //calls the function addShip with the new coordinates
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

        //function to add the ship to the board (if is a new game)
        addShip(ship, shipX, shipY, orientation){
            //clears the p for error messages
            $('#addError').text("");
            var letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'H', 'J', 'K'];
            
            //saves the original values of the ship
            var shipOriginalx = ship.x;
            var shipOriginaly = ship.y;
            var shipOriginalOrientation = ship.orientation;
            var originalCoordinates=[];

            //gets all the coordinates that the boat is occupying and adds to originalCoordinates variable
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
            //variable to know if the boat hits any other boat or doesn't fit on the board
            var colision = false;
            //saves the new coordinates
            var colisionX = shipX;
            var colisionY = shipY;

            //copys usedSpaces to a new variable
            var spacesOccupyed = this.usedSpaces;
            //removes the spaces that are occupyed by the ship since if is to change the spaces will be free
            originalCoordinates.forEach(space =>{
                spacesOccupyed.pop({'y': space.y, 'x': space.x});
            });

            if(orientation == 'H'){ //if the new orientation is horizontal
                for(var i = 0; i < ship.size; i++){ //for ship length
                    
                    if(colisionX > 10){ //if requires a position higher than 10 
                        $('#addError').text("***Can't insert "+ ship.type +" is out of the board");
                        colision = true;
                    }
                    
                    spacesOccupyed.forEach(space =>{ // for each space occupyed
                        if(space.x == colisionX && space.y == colisionY ){ // if is aready occupyed
                            $('#addError').text("***Can't insert "+ ship.type +" it hits another ship");
                            colision = true;
                        }
                    });
                    colisionX++;
                }
            }

            if(orientation == 'V'){ //if the new orientation is vertical
                var iy = letter.indexOf(colisionY);
                for(var i = 0; i < ship.size; i++){ //for ship length
                    colisionY = letter[iy];
                    
                    if(iy > 10){ // if requires a position higher than J
                        $('#addError').text("***Can't insert "+ ship.type +" is out of the board");
                        colision = true;
                    }

                    spacesOccupyed.forEach(space =>{ // for each space occupyed
                        if(space.x == colisionX && space.y == colisionY){ // if is aready occupyed
                            $('#addError').text("***Can't insert "+ ship.type +" it hits another ship");
                            colision = true;
                        }
                        
                    });
                    iy++;
                }
            }

            if(colision == false){ //if doesn't colide any of the ships and fits in the board

                //saves again the original ship positions
                shipOriginalx = ship.x;
                shipOriginaly = ship.y;

                //saves the new values in ship in data
                ship.x = shipX;
                ship.y = shipY;
                ship.orientation = orientation;

                //deletes the original ship position
                if(shipOriginalOrientation == 'H'){ //if original orientation was horizontal
                    for(var i = 0; i < ship.size; i++){ //for the ship length
                        //remove class from the coordinates in user board
                        $("#p1" + shipOriginaly + shipOriginalx).removeClass(ship.type + (i+1) + "H");
                        //removes from usedSpaces
                        this.usedSpaces.pop({'y': shipOriginaly, 'x': shipOriginalx});
                        shipOriginalx++;
                    }
                }

                if(shipOriginalOrientation == 'V'){ //if original orientation was vertical
                    var iy = letter.indexOf(shipOriginaly);
                    for(var i = 0; i < ship.size; i++){ //for the ship length
                        shipOriginaly = letter[iy];
                        //remove class from the coordinates in user board
                        $("#p1" + shipOriginaly + shipOriginalx).removeClass(ship.type + (i+1) + "V");
                        //removes from usedSpaces
                        this.usedSpaces.pop({'y': shipOriginaly, 'x': shipOriginalx});
                        iy++;
                    }
                }

                //adds ship to the new position
                if(orientation == 'H'){ //if new orientation is horizontal
                    for(var i = 0; i < ship.size; i++){ //for the ship length
                        //adds class from the coordinates in user board
                        $("#p1" + shipY + shipX ).addClass(ship.type + (i+1) + "H");
                        //adds coordinates in usedSpaces
                        this.usedSpaces.push({'y': shipY, 'x': shipX});
                        shipX++;    
                    }
                }

                if(orientation == 'V'){//if new orientation is horizontal
                    var iy = letter.indexOf(shipY);
                    for(var i = 0; i < ship.size; i++){ //for the ship length
                        shipY = letter[iy];
                        //adds class from the coordinates in user board
                        $("#p1" + shipY + shipX).addClass(ship.type + (i+1) + "V");
                        //adds coordinates in usedSpaces
                        this.usedSpaces.push({'y': shipY, 'x': shipX});
                        iy++;
                    }
                }
            }
        },

        //function to verify if all ships were inserted
        verifyShips(){
            //clears the p fpr error messages
            $('#addError').text("");
            var isOk = true;
            
            this.p1.ships.forEach(ship =>{ // for each boat
                if(ship.x == '' | ship.y ==''){ //if any of the coordinates is empty
                    //change to false
                    isOk = false;
                }
            });
            if(isOk){ //if everything is ok starts the game
                this.startGame();
            }
            else{ //else shows error message
                $('#addError').text("***Error in inputs***");
            }
        },

        //function to start the game
        startGame(){
            //variable to check if opponent is ready
            var opponentIsConnected = true;
            //gets id for the add ship form
            var element = document.getElementById("addShips");

            //user_table_html.insertAfter(element);
            element.parentNode.insertBefore(opponent_table, element.nextSibling);
            this.addBoard("#opponent", "Opponent Board");

            //waits for apponent do connect
            if(opponentIsConnected == false){ //if opponent isn't ready
                //sets the visibilty add ship hidden
                element.innerHTML = "<h1>Waiting for apponent...</h1>";
            }
            else{
                //removes add ships form
                element.parentNode.removeChild(element);
                //sets the visibility of opponent board unset 
                //document.getElementById("opponent").style.visibility = "unset";
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
            if(this.turn_to_shoot){ //if is turn to shoot
                var letter = ['&nbsp;', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'H', 'J', 'K'];
                //adds shot to user shots
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
            this.p2.ships.forEach(ship =>{ //for each ship of opponent
                var shipX = ship.x;
                var shipY = ship.y;

                if(ship.orientation == 'H'){ //if ship is horizontal
                    for(var i = 0; i < ship.size; i++){
                        if(x == shipX && y == shipY){ //if shot matches a ship coordinate
                            //show hit
                            $("#p2" + y + x).addClass("hit");
                            ship.hits++;
                            //adds to ships hits
                            hit = true;
                        }
                        shipX++;        
                    }
                }
                if(ship.orientation == 'V'){ //if ship is vertical
                    var iy = letter.indexOf(shipY);
                    for(var i = 0; i < ship.size; i++){
                        shipY = letter[iy];
                        if(x == shipX && y == shipY){ //if shot matches a ship coordinate
                            //show hit
                            $("#p2"+ y + x).addClass("hit");
                            //adds to ships hits
                            ship.hits++;
                            hit = true;
                        }
                        iy++;
                    }
                }

            });
            if(hit == false){ //if doesn't hit any ship
                //show miss 
                $("#p2"+ y + x).addClass("miss");
            }
            //show opponent and user status
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
            this.p1.ships.forEach(ship =>{ //for each ship of user
                var shipX = ship.x;
                var shipY = ship.y;

                if(ship.orientation == 'H'){ //if ship is horizontal
                    for(var i = 0; i < ship.size; i++){ 
                        if(x == shipX && y == shipY){ //if shot matches a ship coordinate
                            //show hit
                            $("#p1" + y + x).addClass("hit");
                            //adds to ships hits
                            ship.hits++;
                            hit = true;
                        }
                        shipX++;        
                    }
                }
                if(ship.orientation == 'V'){ //if ship is vertical
                    var iy = letter.indexOf(shipY);
                    for(var i = 0; i < ship.size; i++){
                        shipY = letter[iy];
                        if(x == shipX && y == shipY){ //if shot matches a ship coordinate
                            //show hit
                            $("#p1"+ y + x).addClass("hit");
                            //adds to ships hits
                            ship.hits++;
                            hit = true;
                        }
                        iy++;
                    }
                }

            });
            if(hit == false){ //if doesn't hit any ship
                //show miss 
                $("#p1"+ y + x).addClass("miss");
            }
            //show opponent and user status
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
        //send join message to server
        socket.emit('entered onePlayer game', {game_id: game_id});
        
        
        //if already has ships positions
        if(this.p1.ships[0].x == ""){
            //shows the menu to add ships
            document.getElementById("addShips").style.visibility = "unset";
            //hides the opponent board
            //document.getElementById("opponent").style.visibility = "hidden";
        }
        //else start the game to continue
        else{
            this.startGame();
        }
    },

    computed:{

    }
})