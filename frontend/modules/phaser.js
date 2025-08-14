//Function permettant mise en place du jeu phaser
import { store } from "./store";

import { setPosition } from "../reducers/character";

export function preload() {
  // on récupère la map en fichier .tmj ou json et on récupère aussi les jeux de tuiles utilisés
  this.load.tilemapTiledJSON("map", "/assets_map/map/map.json");
  this.load.image("tiles1", "/assets_map/map/tilset1.png");
  this.load.image("tiles2", "/assets_map/map/tilset2.png");
  this.load.image("tiles3", "/assets_map/map/tileset3.png");
  this.load.image("tiles4", "/assets_map/map/tilset4.png");
  this.load.image("tiles5", "/assets_map/map/tilset5.png");
  this.load.image("tiles7", "/assets_map/map/tileset7.png");
  this.load.image("tiles8", "/assets_map/map/tileset8.png");
  this.load.image("tiles9", "/assets_map/map/tilseset9.png");
  this.load.image("tiles10", "/assets_map/map/tileset10.png");
  //chargement de l'image du personnage (sous forme de sprite sheet) et determination de la taille d'une cellule (51px & 71px)
  this.load.spritesheet("player", `/assets_map/players/sprites/player1.png`, {
    frameWidth: 51,
    frameHeight: 71,
  });
}

export function create() {
  //création des images chargées mais pas d'affichage encore

  const map = this.make.tilemap({ key: "map" });
  // pour les tileset de tiled le premier element est le nom donné au jeu de tuiles dans Tiled
  const tileset1 = map.addTilesetImage("tilset1", "tiles1");
  const tileset2 = map.addTilesetImage("tilset2", "tiles2");
  const tileset3 = map.addTilesetImage("tileset3", "tiles3");
  const tileset4 = map.addTilesetImage("tilset4", "tiles4");
  const tileset5 = map.addTilesetImage("tilset5", "tiles5");
  const tileset7 = map.addTilesetImage("tileset7", "tiles7");
  const tileset8 = map.addTilesetImage("tileset8", "tiles8");
  const tileset9 = map.addTilesetImage("tilseset9", "tiles9");
  const tileset10 = map.addTilesetImage("tileset10", "tiles10");

  /* On récupère les différents calques utilsiés dans Layer avec leur noms exacts : exempel Ground est le nom du calque Ground dans Tiled (nommé par moi même) 
  Par exemple dans tiled le calque nommé groudn a été construite avec les jeux de tuilers tileset1 et tileset2
  */
  map.createStaticLayer("Ground", [tileset1, tileset2]);
  const decorationLayer = map.createStaticLayer("Decoration", [
    tileset1,
    tileset2,
    tileset3,
    tileset4,
  ]);
  const BuildingsLayer = map.createStaticLayer("Building", [
    tileset1,
    tileset2,
    tileset7,
    tileset5,
    tileset8,
    tileset9,
    tileset10,
  ]);
  map.createStaticLayer("Letters", [
    tileset1,
    tileset2,
    tileset7,
    tileset5,
    tileset8,
    tileset9,
  ]);
  const constructionLayer = map.createStaticLayer("Construction", [
    tileset4,
    tileset8,
  ]);

  // Bien mettre dans name le nom du dossier contenant les pages de votre app : coorodnnées des batiments sur la carte
  this.coordsBuildings = [
    { name: "blindtest-serie", xPos: 4301, yPos: 2921 },
    { name: "quiz", xPos: 2875, yPos: 1793 },
    { name: "music-lab", xPos: 2925, yPos: 604 },
    { name: "vinyles-store", xPos: 554, yPos: 2458 },
    { name: "music-city", xPos: 2579, yPos: 2532 },
  ];

  const buildingToCreate = [
    { name: "rapBuilding", xPos: 1718, yPos: 1370 },
    { name: "jazzBuilding", xPos: 311, yPos: 1260 },
    { name: "classicalBuilding", xPos: 1220, yPos: 986 },
    { name: "rockBuilding", xPos: 1689, yPos: 490 },
    { name: "toDefineBuilding", xPos: 755, yPos: 538 },
    { name: "grooveBoxBuilding", xPos: 1500, yPos: 3150 },
    { name: "observatoryBuilding", xPos: 4406, yPos: 910 },
    { name: "homeBuilding", xPos: 3502, yPos: 2332 },
    { name: "movieBuilding", xPos: 3719, yPos: 2907 },
  ];

  //Permet la redirection vers des batiments
  this.playerWasInZoneByBuilding = {};
  for (const building of this.coordsBuildings) {
    this.playerWasInZoneByBuilding[building.name] = false;
  }

  // Touts le sbatiments d la couche layer vont être des obstacles pour le jouer
  BuildingsLayer.setCollisionByProperty({ collides: true });
  decorationLayer.setCollisionByProperty({ collides: true });
  constructionLayer.setCollisionByProperty({ collides: true });

  // permet de stocker la position dans le reducer
  const position = store.getState().character.position;
  this.player = this.physics.add.sprite(position.xPos, position.yPos, "player");

  const mapWidth = map.widthInPixels;
  const mapHeight = map.heightInPixels;

  // permet de mettre des limites a la cameras mais aussi de suivre le joueur quand il se déplacer
  this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
  this.cameras.main.startFollow(this.player);

  // on déteromienr que le player pour rentrer en collisision avec ces couches
  this.physics.add.collider(this.player, BuildingsLayer);
  this.physics.add.collider(this.player, decorationLayer);
  this.physics.add.collider(this.player, constructionLayer);

  // Permet de mettre des limites et de ne pas pouvoir les franchirs

  this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
  this.player.setCollideWorldBounds(true);

  /* on créer les animations de dépalcements, pour le player. en fonction de sa direction l'animation prendra des elements différetns du sprite
   */
  this.anims.create({
    key: "left", //nom que l'on donne à l'animation
    frames: this.anims.generateFrameNumbers("player", { start: 3, end: 5 }), //prendra dans l'ores les images 3,4 et 5
    frameRate: 10, // vitesse de défilement
    repeat: -1, // on répéète indéfiniment tant que l'animation est en cours
  });

  this.anims.create({
    key: "bottom",
    frames: this.anims.generateFrameNumbers("player", { start: 0, end: 2 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("player", { start: 6, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "top",
    frames: this.anims.generateFrameNumbers("player", { start: 9, end: 11 }),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: "turn",
    frames: [{ key: "player", frame: 1 }],
    frameRate: 20,
  });

  // Autorise phaser à seulement écouter les fl^ches directionnelles => optionel car plus de modale
  this.cursors = this.input.keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.UP,
    down: Phaser.Input.Keyboard.KeyCodes.DOWN,
    left: Phaser.Input.Keyboard.KeyCodes.LEFT,
    right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
  });

  // on acjoute shift la touche pour courir
  this.runKey = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.SHIFT
  );

  this.controlsEnabled = true;
}

export function update() {
  if (this.controlsEnabled) {
    // on defini la vitesse de base et celle de course
    let baseSpeed = 500;
    let runSpeed = 800;
    let speed = this.runKey.isDown ? runSpeed : baseSpeed;

    let velocityX = 0;
    let velocityY = 0;

    // Mouvement horizontal avec la vitesse défini précédemment
    if (this.cursors.left.isDown) {
      velocityX = -speed;
    } else if (this.cursors.right.isDown) {
      velocityX = speed;
    }
    // Mouvement vertical
    if (this.cursors.up.isDown) {
      velocityY = -speed;
    } else if (this.cursors.down.isDown) {
      velocityY = speed;
    }

    // Appliquer la vitesse combinée
    this.player.setVelocityX(velocityX);
    this.player.setVelocityY(velocityY);

    // Choisir l'animation en fonction de la direction - on lance l'animation en fonction du mouvement du personnage
    if (velocityX < 0) {
      this.player.anims.play("left", true); // si vélocité X <0, singinfire que le personnage se déplace vers la gauche de l'écran et on lance l'animation appelé "left
    } else if (velocityX > 0) {
      this.player.anims.play("right", true);
    } else if (velocityY > 0) {
      this.player.anims.play("bottom", true);
    } else if (velocityY < 0) {
      this.player.anims.play("top", true);
    } else {
      this.player.anims.play("turn");
    }
  } else {
    this.player.setVelocity(0);
    this.player.anims.play("turn");
  }

  const threshold = 50;

  // on check la distance a chacun des building avec la fonction Phaser.Math.Distance
  for (const building of this.coordsBuildings) {
    const distance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      building.xPos,
      building.yPos
    );
    // il est dans la zone si il est a moins de 50px de l'entrée du batiment
    const isInZone = distance < threshold;

    const wasInZone = this.playerWasInZoneByBuilding[building.name];

    //si le personnage est entrée dans le batiment et qu'il n'y étais pas avant, on ajoute sa position ainsqi que le nom du baitment (=nom du dossier) au reducer
    if (isInZone && !wasInZone) {
      console.log("Entrée zone:", building.name);
      store.dispatch(
        setPosition({
          xPos: this.player.x,
          yPos: this.player.y,
          name: building.name,
          xPosBuilding: building.xPos,
          yPosBuilding: building.yPos,
        })
      );
    }

    this.playerWasInZoneByBuilding[building.name] = isInZone;
  }
}
