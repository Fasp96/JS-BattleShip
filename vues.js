data = {
    ships_p1:"",
    ships_p2:"",
    hits_p1:"",
    hits_p2:"",
};

new Vue({
    el:"tables",
    data: data,

    methods:{
        addBoard(){
            var createGrid=function(x,y){
                var arrY = new Array(),
                    arrX,
                    container = $(".table");
                for(var iy= 0; iy<=y; iy++){
                arrX = new Array();
                var letter = ['&nbsp;', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'H', 'J', 'K'];
                    for(var ix= 0; ix<=x; ix++){
                      
                        if(ix == 0 && iy == 0){
                            arrX[ix]='<div class="cell outside number letter">'+ letter[iy] +'</div>';
                        }
                        else if(ix == 0){
                            arrX[ix]='<div class="cell outside letter">'+ letter[iy] +'</div>';
                        }
                        else if(iy == 0){
                            arrX[ix]='<div class="cell outside number">'+ ix +'</div>';
                        }
                        else{
                            arrX[ix]='<div class="cell inside" id=' + letter[(iy)] + (ix) + '>&nbsp;</div>';
                        }   
                    }
                    arrY[iy]='<div class="row">'+arrX.join("\r\n")+'</div>';
                }
                container.append(arrY.join("\r\n"));
            };
        // call function
        createGrid(10,10);
        },

        addHit(){

        },
        addShip(){

        }
    },
    mounted(){
        this.addBoard()
     },

    computed:{
        showHits(){

        }
    }
        

})