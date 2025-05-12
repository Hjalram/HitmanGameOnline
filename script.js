import * as PIXI from 'pixi.js'
console.log(PIXI.VERSION);


let pixelWidth = 2;
let pixelHeight = 2;
let trueWidth = 1000;
let trueHeight = 700;
let pixeledWidth = trueWidth/pixelWidth;
let pixeledHeight = trueHeight/pixelHeight;

let inventory = [];
let hiddenDeck = [];
let visibleDeck = [];
let thrownAwayCards = [];

(async () => {
    const app = new PIXI.Application();

    await app.init({
        antialias: false, // important for pixel-perfect look
        width: trueWidth,
        height: trueHeight,
        autoDensity: true,
        backgroundColor: 0x6a758b
    });
    document.body.appendChild(app.canvas);

    const cardAtlas = { // Needs the be in this specific format
        frames: {
            backside: {
                frame: {x: 48*0, y: 0, w: 48, h: 64},
                sourceSize: {w: 48, h: 64},
                spriteSourceSize: {x: 0, y: 0, w: 48, h: 64}
            },
            hitman: {
                frame: {x: 48*1, y: 0, w: 48, h: 64},
                sourceSize: {w: 48, h: 64},
                spriteSourceSize: {x: 0, y: 0, w: 48, h: 64}
            },
            angel: {
                frame: {x: 48*2, y: 0, w: 48, h: 64},
                sourceSize: {w: 48, h: 64},
                spriteSourceSize: {x: 0, y: 0, w: 48, h: 64}
            },
            reverse: {
                frame: {x: 48*3, y: 0, w: 48, h: 64},
                sourceSize: {w: 48, h: 64},
                spriteSourceSize: {x: 0, y: 0, w: 48, h: 64}
            },
            stop: {
                frame: {x: 48*4, y: 0, w: 48, h: 64},
                sourceSize: {w: 48, h: 64},
                spriteSourceSize: {x: 0, y: 0, w: 48, h: 64}
            },
            theif: {
                frame: {x: 48*5, y: 0, w: 48, h: 64},
                sourceSize: {w: 48, h: 64},
                spriteSourceSize: {x: 0, y: 0, w: 48, h: 64}
            },
            attack: {
                frame: {x: 48*6, y: 0, w: 48, h: 64},
                sourceSize: {w: 48, h: 64},
                spriteSourceSize: {x: 0, y: 0, w: 48, h: 64}
            },
            mirror: {
                frame: {x: 48*7, y: 0, w: 48, h: 64},
                sourceSize: {w: 48, h: 64},
                spriteSourceSize: {x: 0, y: 0, w: 48, h: 64}
            },
            shuffle: {
                frame: {x: 48*8, y: 0, w: 48, h: 64},
                sourceSize: {w: 48, h: 64},
                spriteSourceSize: {x: 0, y: 0, w: 48, h: 64}
            },
            sneak: {
                frame: {x: 48*9, y: 0, w: 48, h: 64},
                sourceSize: {w: 48, h: 64},
                spriteSourceSize: {x: 0, y: 0, w: 48, h: 64}
            },
            skip: {
                frame: {x: 48*10, y: 0, w: 48, h: 64},
                sourceSize: {w: 48, h: 64},
                spriteSourceSize: {x: 0, y: 0, w: 48, h: 64}
            },
        },
        meta: {
            image: "/assets/cards-sheet.png",
            size: {w: 48*11, h: 64}
        },
        animations: {
            backside: ['backside'],
            hitman: ['hitman'],
            angel: ['angel'],
            reverse: ['reverse'],
            stop: ['stop'],
            theif: ['theif'],
            attack: ['attack'],
            mirror: ['mirror'],
            shuffle: ['shuffle'],
            sneak: ['sneak'],
            skip: ['skip']
        }
    };

    const cardsTexture = await PIXI.Assets.load(cardAtlas.meta.image);
    cardsTexture.source.scaleMode = "nearest";
    const spritesheet = new PIXI.Spritesheet(cardsTexture, cardAtlas);
    await spritesheet.parse();
   
    class Card {
        constructor(cardType) {
            this.cardType = cardType;
            this.flippedOver = false;
            
            this.x = 0;
            this.y = 0;


            this.sprite = new PIXI.AnimatedSprite(spritesheet.animations.backside);
            app.stage.addChild(this.sprite);

            this.sprite.x = 100;
            this.sprite.y = 100;
            this.sprite.filters = [];
            this.sprite.scale.set(pixelWidth, pixelHeight);
            this.sprite.animationSpeed = 0.1;


            

            this.update();
        }

        update() {
            let animationType;

            if (this.cardType === "backside") {animationType = spritesheet.animations.backside};
            if (this.cardType === "hitman") {animationType = spritesheet.animations.hitman};
            if (this.cardType === "angel") {animationType = spritesheet.animations.angel};
            if (this.cardType === "reverse") {animationType = spritesheet.animations.reverse};
            if (this.cardType === "stop") {animationType = spritesheet.animations.stop};
            if (this.cardType === "theif") {animationType = spritesheet.animations.theif};
            if (this.cardType === "attack") {animationType = spritesheet.animations.attack};
            if (this.cardType === "mirror") {animationType = spritesheet.animations.mirror};
            if (this.cardType === "shuffle") {animationType = spritesheet.animations.shuffle};
            if (this.cardType === "sneak") {animationType = spritesheet.animations.sneak};
            if (this.cardType === "skip") {animationType = spritesheet.animations.skip};
            if (this.flippedOver == true) {animationType = spritesheet.animations.backside;}

            this.sprite.interactive = true;
            this.sprite.cursor = "pointer";

            this.sprite.textures = animationType;
            this.sprite.gotoAndPlay(0); // Play the first frame

            // Movement
            this.sprite.x = this.x + trueWidth / 2 - this.sprite.width / 2;
            this.sprite.y = this.y + trueHeight / 2 - this.sprite.height / 2;
        }
    }

    hiddenDeck = [
        new Card("attack"),
        new Card("hitman"),
        new Card("reverse"),
        new Card("sneak"),
        new Card("shuffle")
    ];

    visibleDeck = [
        new Card("attack"),
        new Card("hitman"),
        new Card("reverse"),
        new Card("sneak"),
        new Card("shuffle")
    ];

    inventory = [
        new Card("attack"),
        new Card("mirror"),
        new Card("theif"),
        new Card("reverse"),
        new Card("sneak"),
        new Card("attack")
    ]

    updateVisibleDeck();
    updateHiddenDeck();
    updateInventory();

    inventory.forEach((card, index) => {
        card.sprite.on('click', () => {
            playCard(card);
        });
    });
    

    function updateHiddenDeck() {
        for (let i = 0; i < hiddenDeck.length; i++) {
            let current = hiddenDeck[i];

            current.x = 60;
            current.y = -(i*5);
            current.flippedOver = true;
            current.update();

            app.stage.removeChild(current.sprite);
            app.stage.addChild(current.sprite); // Adds it back on top
        }
    }

    function updateVisibleDeck() {
        for (let i = 0; i < visibleDeck.length; i++) {
            let current = visibleDeck[i];

            current.y = -(i*5);
            current.x = -60;
            current.flippedOver = false;
            current.update();

            app.stage.removeChild(current.sprite);
            app.stage.addChild(current.sprite); // Adds it back on top
        }
    }

    function updateInventory() {
        for (let i = 0; i < inventory.length; i++) {
            let current = inventory[i];

            current.y = 270;
            current.x = i*110 - (inventory.length*110)/2 + 110/2;
            console.log(current.sprite.width);
            current.flippedOver = false;
            current.update();
        }
    }

    function playCard(card) {
        const index = inventory.indexOf(card);

        visibleDeck.push(inventory[index]); // Add to visibleDeck
        inventory.splice(index, 1); // Remove from inventory

        updateVisibleDeck();
        updateInventory();
    }
})();

