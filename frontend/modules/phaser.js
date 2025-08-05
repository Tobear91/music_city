//Function permettant mise en place du jeu phaser


export function preload() {
    // on cupéère la map en fichier .tmj ou json et on récupère aussi les set de tuiles utilisés
    this.load.tilemapTiledJSON('map', '/assets_map/map/map.json');
    this.load.image('tiles1', '/assets_map/map/tilset1.png');
    this.load.image('tiles2', '/assets_map/map/tilset2.png');
    this.load.image('tiles3', '/assets_map/map/tileset3.png');
    this.load.image('tiles4', '/assets_map/map/tilset4.png');
    this.load.image('tiles5', '/assets_map/map/tilset5.png');
    this.load.image('tiles7', '/assets_map/map/tileset7.png');
    this.load.image('tiles8', '/assets_map/map/tileset8.png');
    this.load.image('tiles9', '/assets_map/map/tilseset9.png');
    this.load.image('tiles10', '/assets_map/map/tileset10.png');
    this.load.spritesheet('player', `/assets_map/players/sprites/player1.png`, { frameWidth: 51, frameHeight: 71 })

}

export function create() {

    const map = this.make.tilemap({ key: 'map' });
    // On crée les deux sets d'images
    const tileset1  = map.addTilesetImage('tilset1', 'tiles1');
    const tileset2  = map.addTilesetImage('tilset2', 'tiles2');
    const tileset3  = map.addTilesetImage('tileset3', 'tiles3');
    const tileset4  = map.addTilesetImage('tilset4', 'tiles4');
    const tileset5  = map.addTilesetImage('tilset5', 'tiles5');
    const tileset7  = map.addTilesetImage('tileset7', 'tiles7');
    const tileset8  = map.addTilesetImage('tileset8', 'tiles8');
    const tileset9  = map.addTilesetImage('tilseset9', 'tiles9');
    const tileset10  = map.addTilesetImage('tileset10', 'tiles10');

    // On récupère les 3 calques utilsiés dans Layer avec leur noms exacts
    const groundLayer = map.createStaticLayer('Ground', [tileset1, tileset2], 0, 0);
    const decorationLayer = map.createStaticLayer('Decoration', [tileset1, tileset2,tileset3,tileset4], 0, 0);
    const BuildingsLayer = map.createStaticLayer('Building', [tileset1, tileset2,tileset7,tileset5,tileset8,tileset9,tileset10], 0, 0);
    const letterLayer = map.createStaticLayer('Letters', [tileset1, tileset2,tileset7,tileset5,tileset8,tileset9], 0, 0);
    const constructionLayer = map.createStaticLayer('Construction', [tileset4,tileset8], 0, 0);

    this.coordsBuildings = [
        {name: 'serieBuilding', xPos : 4301, yPos : 2921},
        {name: 'movieBuilding', xPos : 3719, yPos : 2907},
        {name: 'homeBuilding', xPos : 3502, yPos : 2332},
        {name: 'musicCityBuilding', xPos : 2579, yPos : 2532},
        {name: 'quizzBuilding', xPos : 2875, yPos : 1793},
        {name: 'observatoryBuilding', xPos : 4406, yPos : 910},
        {name: 'musicLabBuilding', xPos : 2925, yPos : 604},
        {name: 'vinylStoreBuilding', xPos : 554, yPos : 2458},
        {name: 'rapBuilding', xPos : 1718, yPos : 1370},
        {name: 'jazzBuilding', xPos : 311, yPos : 1260},
        {name: 'classicalBuilding', xPos : 1220, yPos : 986},
        {name: 'rockBuilding', xPos : 1689, yPos : 490},
        {name: 'toDefineBuilding', xPos : 755, yPos : 538},
        {name: 'grooveBoxBuilding', xPos : 1500, yPos : 3150},
    ]


    //Permet 'louvrteure dune modale : 
    this.playerWasInZone = false;
    this.openModal = this.game.openModal

    // Touts le sbatiments d la couche layer vont être des obstacles pour le jouer
    BuildingsLayer.setCollisionByProperty({ collides: true });
    decorationLayer.setCollisionByProperty({ collides: true });
    constructionLayer.setCollisionByProperty({ collides: true });

    this.player = this.physics.add.sprite(2590, 3270, 'player');
    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.startFollow(this.player);



    this.physics.add.collider(this.player, BuildingsLayer)   
    this.physics.add.collider(this.player, decorationLayer)
    this.physics.add.collider(this.player, constructionLayer)
    
    // Permet de mettre des limites et de ne pas pouvoir les franchirs

    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
    this.player.setCollideWorldBounds(true);;

    //Permet de suivre le joueur avec la caméra
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);

    // Optionnel : limiter la caméra aux bords du monde
    this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start:3, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

    this.anims.create({
            key: 'bottom',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

    this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'top',
            frames: this.anims.generateFrameNumbers('player', { start: 9, end: 11 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
        key: 'turn',
        frames: [ { key: 'player', frame: 1 } ],
        frameRate: 20
    });


    this.cursors  = this.input.keyboard.createCursorKeys();
    this.runKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT); // add function to make the player run

    this.hasRedirected = false; // variable qui va permettre la redirection vers une autre page
    this.controlsEnabled = true;


    // Zoom avec la molette de la souris
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
        const camera = this.cameras.main;
        const zoomStep = 0.1;
        if (deltaY > 0) {
            // Molette vers le bas → zoom out
            camera.setZoom(Phaser.Math.Clamp(camera.zoom - zoomStep, 1, 4));
        } else {
            // Molette vers le haut → zoom in
            camera.setZoom(Phaser.Math.Clamp(camera.zoom + zoomStep, 1, 4));
        }
    });
}


export function update() {



    if (this.controlsEnabled) {
    let baseSpeed = 250;
    let runSpeed = 500;
    let speed = this.runKey.isDown ? runSpeed : baseSpeed;

    let velocityX = 0;
    let velocityY = 0;

    // Mouvement horizontal
    if (this.cursors.left.isDown) {
        velocityX = -speed;
    }
    else if (this.cursors.right.isDown) {
        velocityX = speed;
    }
    // Mouvement vertical
    if (this.cursors.up.isDown) {
        velocityY = -speed;
    }
    else if (this.cursors.down.isDown) {
        velocityY = speed;
    }

    // Appliquer la vitesse combinée
    this.player.setVelocityX(velocityX);
    this.player.setVelocityY(velocityY);

    // Choisir l'animation en fonction de la direction
    if (velocityX < 0) {
        this.player.anims.play('left', true);
    }
    else if (velocityX > 0) {
        this.player.anims.play('right', true);
    }
    else if (velocityY > 0) {
        this.player.anims.play('bottom', true);  // même animation pour haut/bas
    }
    else if (velocityY < 0) {
        this.player.anims.play('top', true);  // même animation pour haut/bas
    }
    else {
        this.player.anims.play('turn');
    }}else{
            this.player.setVelocity(0);
        this.player.anims.play('turn');
    }


    // permet la mise en place des overlay, exempale pour music city ici. 
    const threshold = 50; // rayon de déclenchement
    const buildingSerie = this.coordsBuildings.find(b => b.name === 'serieBuilding');

    if (buildingSerie) {
        const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, buildingSerie.xPos, buildingSerie.yPos);
        const isInZone = distance < threshold;

        if (isInZone && !this.playerWasInZone) {
            this.game.openModal(); // ouvre uniquement à l'entrée
        } else if (!isInZone && this.playerWasInZone) {
            this.game.closeModal(); // ferme uniquement à la sortie
        }

        this.playerWasInZone = isInZone;
    }
}
