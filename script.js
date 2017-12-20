window.onload = function(){
    var anime = new KagaCanvas(520, 520, "anime", "animecanvas");
    
    class Card{
        constructor(x, y, id){
            this.defX = x;
            this.defY = y;
            this.nowX = x;
            this.nowY = y;
            this.goalX = x;
            this.goalY = y;
            this.moveCnt = 0;
            this.moveTime = 0;
            this.moveFlg = 0;
            this.id = id;
        }
        update(){
            this.moveFlg = 0;
            this.moveCnt++;
            if(this.moveCnt >= this.moveTime){
                this.nowX = this.goalX;
                this.nowY = this.goalY;
                return;
            }
            if(this.moveCnt < this.moveTime){
                this.moveFlg = 1;
            }
            this.nowX = parseInt(this.defX + (this.goalX - this.defX)*this.moveCnt/this.moveTime);
            this.nowY = parseInt(this.defY + (this.goalY - this.defY)*this.moveCnt/this.moveTime);
        }
        moveTo(x, y, time){
            this.moveFlg = 1;
            this.moveCnt = 0;
            this.moveTime = time;
            this.defX = this.nowX;
            this.defY = this.nowY;
            this.goalX = x;
            this.goalY = y;
        }
        warpTo(x, y){
            this.moveFlg = 0;
            this.moveCnt = 0;
            this.moveTime = 0;
            this.defX = this.nowX;
            this.defY = this.nowY;
            this.goalX = x;
            this.goalY = y;
        }
        changeTo(x, y, time){
            if(this.goalX==x && this.goalY==y){
                return;
            }
            this.moveFlg = 1;
            this.moveCnt = 0;
            this.moveTime = time;
            this.defX = this.nowX;
            this.defY = this.nowY;
            this.goalX = x;
            this.goalY = y;
        }
    }

    var deck = [];
    var field = [];
    var grave = [];
    function init(){
        deck = [];
        field = [];
        grave = [];
        for(var i=0;i<52;i++){
            deck.push(new Card(150, 520, i));
        }
        for(var i=0;i<52;i++){
            var j = Math.floor(Math.random()*52);
            var tmp = deck[i];
            deck[i] = deck[j];
            deck[j] = tmp;
        }
    }
    init();

    //0:not move/1:move/
    function fieldUpdate(){
        var flg = 0;
        for(var i = 0; i < field.length; i++){
            field[i].update();
            if(field[i].moveFlg)flg = 1;
        }
        if(flg)return 1;
        for(var i = 0; i < field.length; i++){
            var row = parseInt(i/4);
            var col = i%4;
            if(col < 3 && i + 1 < field.length){
                if(field[i].id%13==field[i+1].id%13){
                    field[i].moveTo(520, 0, 30);
                    field[i + 1].moveTo(520, 0, 30);
                    grave.push(field[i]);
                    grave.push(field[i + 1]);
                    field.splice(i+1, 1);
                    field.splice(i, 1);
                    return 1;
                }
            }
            if(col > 0 && i + 3 < field.length){
                if(field[i].id%13==field[i+3].id%13){
                    field[i].moveTo(520, 0, 30);
                    field[i + 3].moveTo(520, 0, 30);
                    grave.push(field[i]);
                    grave.push(field[i + 3]);
                    field.splice(i+3, 1);
                    field.splice(i, 1);
                    return 1;
                }
            }
            if(i + 4 < field.length){
                if(field[i].id%13==field[i+4].id%13){
                    field[i].moveTo(520, 0, 30);
                    field[i + 4].moveTo(520, 0, 30);
                    grave.push(field[i]);
                    grave.push(field[i + 4]);
                    field.splice(i+4, 1);
                    field.splice(i, 1);
                    return 1;
                }
            }
            if(col < 5 && i + 5 < field.length){
                if(field[i].id%13==field[i+5].id%13){
                    field[i].moveTo(520, 0, 30);
                    field[i + 5].moveTo(520, 0, 30);
                    grave.push(field[i]);
                    grave.push(field[i + 5]);
                    field.splice(i+5, 1);
                    field.splice(i, 1);
                    return 1;
                }
            }
            
        }
        return 0;
    }
    function graveUpdate(){
        var flg = 0;
        for(var i = 0; i<grave.length;){
            grave[i].update();
            if(grave[i].moveFlg){
                i++;
                flg = 1;
            }
            else{
                grave.splice(i, 1);
            }
        }
        return flg;
    }

    function drawCard(x, y, id){
        anime.rectangle(x+2, y+2, x+28, y+38, anime.rgb(255, 255, 255), -1);
        anime.rectangle(x+2, y+2, x+28, y+38, anime.rgb(0, 0, 0), 2);
        var mark = parseInt(id/13);
        var num = id % 13 + 1;
        var txt = "";
        if(mark==0)txt = "♥";
        else if(mark==1)txt = "♠";
        else if(mark==2)txt = "♦";
        else if(mark==3)txt = "♣";
        txt += "\n";
        if(num==11)txt += "J";
        else if(num==12)txt += "Q";
        else if(num==13)txt += "K";
        else if(num==1)txt+="A";
        else txt += num;
        var color = anime.rgb(255, 0, 0);
        if(mark%2)color = anime.rgb(0, 0, 0);
        anime.autoLine(x+7, y+2, txt, color);
    }

    function fieldAdjust(){
        for(var i=0;i<field.length;i++){
            var x = (i%4) * 30;
            var y = parseInt(i/4) * 40;
            field[i].changeTo(x, y, 30);
        }
    }
    
    function drawCards(){
        for(var i=0;i<field.length;i++){
            drawCard(field[i].nowX, field[i].nowY, field[i].id);
        }
        for(var i=0; i<grave.length; i++){
            drawCard(grave[i].nowX, grave[i].nowY, grave[i].id);
        }
    }

    function animeLoop(){
        anime.rectangle(0, 0, 520, 520, anime.rgb(255, 255, 255), -1);
        var str = "カードの8近傍に同じ数字があったら取り除きます．";
        str += "\n候補が複数ある場合，古いカードが優先されます．";
        str += "\n山札："+deck.length;
        str += "\n　場："+field.length;
        str += "\n除去："+(52 - deck.length - field.length);
        anime.autoLine(150, 40, str);
        
        drawCards();
        var f = fieldUpdate();
        var g = graveUpdate();
        if(f){
            fieldAdjust();
        }
        if(f || g){
            return;
        }
        if(deck.length==0){
            init();
            return;
        }
        field.push(deck[0]);
        deck.shift();
        fieldAdjust();
        
    }
    setInterval(animeLoop, 20);
}