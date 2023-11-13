
var config = {
    type: Phaser.AUTO,
    width: 1276,
    height:719,
    physics:{
        default: 'arcade',
        arcade:{
            gravity:{ y: 300 },
            debug: false
        }
    },
    scene:{
        preload: preload,
        create: create,
        update: update
    }
};
var score=0; //puntaje
var scoreText;
var game = new Phaser.Game(config)
var gameOver = false;

var Texto;
var jugador2 = false;

function preload(){
    this.load.image('sky','assets/hoja.JPG');
    this.load.image('bomb','assets/bomb.png');
    this.load.image('star','assets/flor.png');
    this.load.image('plataforma', 'assets/platform2.png');
    this.load.spritesheet('bluey','assets/bluey.png',{frameWidth: 50, frameHeight:71});
    this.load.spritesheet('bingo','assets/bingo.png',{frameWidth: 50, frameHeight:71});
}
function create(){
    this.add.image(638,359,'sky');
    platforms = this.physics.add.staticGroup();

    platforms.create(400,698, 'plataforma').setScale(5).refreshBody();
    platforms.create(500,500, 'plataforma'); //medio
    platforms.create(800,350, 'plataforma') //medio larga
    platforms.create(1050,350, 'plataforma') //medio larga
    platforms.create(50,350, 'plataforma'); //arriba izquierda
    platforms.create(750,175, 'plataforma'); //arriba medio
    player = this.physics.add.sprite(100,450, 'bluey');

    player.setCollideWorldBounds(true);
    player.setBounce(0.2);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('bluey',{ start:0, end:0 }),
        frameRete: 1,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [{key:'bluey', frame:1}],
        frameRete: 20
    });
    this.anims.create({
        key: 'right',
        frames: [{key:'bluey', frame:1}],
        //frames: this.anims.generateFrameNumbers('bluey',{ start:, end:8}),
        frameRete: 10,
        repeat: -1
    });

    
    player.body.setGravityY(300);
    
    this.physics.add.collider(player, platforms);

    cursor = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY:{x: 12, y:0, stepX:70}
    });

    stars.children.iterate(function(child){
        child.setBounceY(Phaser.Math.FloatBetween(0.4,0.8));
    });

    this.physics.add.collider(stars,platforms);

    this.physics.add.overlap(player,stars,collecstStart, null, true);

    scoreText = this.add.text(400,66, 'Puntos : 0', {fontSize:'32px', fill:'#000'});
    Texto = this.add.text(300,16, 'Para Sofi y Thiago', {fontSize:'44px', fill:'#000'});

    bombas = this.physics.add.group();
    this.physics.add.collider(bombas, platforms);
    this.physics.add.collider(player,bombas, hitBomb, null, this);

}
function update(){
    if (gameOver)
    {
        return
    }
    if (cursor.left.isDown){
        player.setVelocityX(-160);
        player.anims.play('left',true);
    }
    else if (cursor.right.isDown){
        player.setVelocityX(160);
        player.anims.play('right',true);
    }
    else{
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if(cursor.up.isDown && player.body.touching.down){
        player.setVelocityY(-530);
    }
}

function collecstStart(player, star){
    star.disableBody(true,true);

    score +=10;
    scoreText.setText('Puntos: '+ score);
    if(stars.countActive(true)===0){
        stars.children.iterate(function(child){
            child.enableBody(true, child.x,0,true,true);
        });
        
    var x= (player.x<400)? Phaser.Math.Between(400,800) :Phaser.Math.Between(0,400);
    var bomb = bombas.create(x,16,'bomb');
    
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200,200), 20);
    }

}

function hitBomb (player, bombas){
    this.physics.pause();

    player.setTint(0xff0000);
    player.anims.play('turn');

    gameOver = true;
}
