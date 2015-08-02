angular.module('starter', ['ionic'])

  .run(function($ionicPlatform, $ionicLoading, $rootScope, $interval) {
    //})
    //.controller('foo', function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner><br>{{$root.loadingTotal}}'
    });
    $rootScope.loadingTotal = 0;

    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

      var Q = window.Q = Quintus({
        imagePath: 'img/'
      })
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX")
        .setup({maximize: true})
        .controls(true).touch();

      Q.gravityY = 0;
      Q.gravityX = 0;
      Q.SPRITE_PLAYER = 1;

      Q.Sprite.extend("Player", {
        init: function(p) {
          this._super(p, {
            sheet: "player",  // Setting a sprite sheet sets sprite width and height
            sprite: "player",
            direction: "right",
            type: Q.SPRITE_PLAYER,
            collisionMask: Q.SPRITE_DEFAULT
          });
          this.add('2d, platformerControls, animation, tween');

          this.on('hit.sprite', function(collision) {
            /* TODO : add a goal and when you hit it then complete the level
             if (collision.obj.isA('Tower')) {
             Q.stageScene('endGame', 1, {label: 'You Won!'});
             this.destroy();
             }*/
          });
        },
        step: function(dt) {
          var p = this.p;
          switch (true) {
            case Q.inputs['right']:
              p.x += 5;
              this.p.direction = "right";
              this.play("walk_" + this.p.direction);
              break;
            case Q.inputs['left']:
              p.x -= 5;
              this.p.direction = "left";
              this.play("walk_" + this.p.direction);
              break;
            case Q.inputs['up']:
              p.y -= 5;
              this.p.direction = "up";
              this.play("walk_" + this.p.direction);
              break;
            case Q.inputs['down']:
              this.p.direction = "down";
              this.play("walk_" + this.p.direction);
              p.y += 5;
              break;
            default :
              this.play("stand_" + this.p.direction);
              break;
          }
        }
      });

      var audio = null;

      Q.scene("level1", function(stage) {
        Q.stageTMX("all-levels.tmx", stage);

        stage.add("viewport").follow(Q("Player").first());

        if(audio){
          audio.stop();
        }
        audio = new Audio("../audio/level1.ogg", 100, true);
        audio.play();
      });

      Q.scene("level2", function(stage) {
        Q.stageTMX("all-levels.tmx", stage);

        // Move the player into position
        Q("Player").items[0].p.x = 5168;
        Q("Player").items[0].p.y = 1085;

        stage.add("viewport").follow(Q("Player").first());

        stage.viewport.scale = 1;

        if(audio){
          audio.stop();
        }
        audio = new Audio("../audio/level2.ogg", 100, true);
        audio.play();
      });

      Q.scene("level3", function(stage) {
        Q.stageTMX("all-levels.tmx", stage);

        // Move the player into position
        Q("Player").items[0].p.x = 6750;
        Q("Player").items[0].p.y = 1085;

        stage.add("viewport").follow(Q("Player").first());

        stage.viewport.scale = 1;

        if(audio){
          audio.stop();
        }
        audio = new Audio("../audio/level3.ogg", 100, true);
        audio.play();
      });

      Q.scene("level3", function(stage) {
        Q.stageTMX("all-levels.tmx", stage);
        if(audio){
          audio.stop();
        }
        audio = new Audio("../audio/level2.ogg", 100, true);
        audio.play();
      });

      Q.scene("ending", function(stage) {
        // TODO : play around with where the zooming starts from
        stage.add("viewport"); //.follow(Q("Player").first());
        var x = 0;
        setInterval(function() {
          if(x < 12) {
            stage.viewport.scale = stage.viewport.scale / 1.3;
            stage.centerOn(3936,3552);
            x++;
          }
        },50);

        // TODO : need to find a ending song!
        if(audio){
          audio.stop();
        }
        //audio = new Audio("../audio/level1.ogg", 100, true);
        //audio.play();
      });


      Q.loadTMX("all-levels.tmx, player.json, dungeon.png, SaraFullSheet.png", function() {
        Q.compileSheets("SaraFullSheet.png", "player.json");
        var rate = 1 / 15;
        Q.animations("player", {
          walk_up: {frames: [104, 105, 106, 107, 108, 109, 110, 111, 112], rate: rate, flip: false, loop: true},
          walk_left: {frames: [117, 118, 119, 120, 121, 122, 123, 124, 125], rate: rate, flip: false, loop: true},
          walk_down: {frames: [130, 131, 132, 133, 134, 135, 136, 137, 138], rate: rate, flip: false, loop: true},
          walk_right: {frames: [143, 144, 145, 146, 147, 148, 149, 150, 151], rate: rate, flip: false, loop: true},
          stand_up: {frames: [104], rate: 1 / 10, flip: false},
          stand_left: {frames: [117], rate: 1 / 10, flip: false},
          stand_down: {frames: [130], rate: 1 / 10, flip: false},
          stand_right: {frames: [143], rate: 1 / 10, flip: false}
        });

        Q.stageScene("level1");
      }, {
        progressCallback: function(loaded, total) {
          $rootScope.loadingTotal = Math.floor(loaded / total * 100) + '%';
          if (loaded == total) {
            $ionicLoading.hide();
          }
        }
      });
    });
  });
