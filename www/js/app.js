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
        init: function (p) {
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
              break;
            case Q.inputs['left']:
              p.x -= 5;
              break;
            case Q.inputs['up']:
              p.y -= 5;
              break;
            case Q.inputs['down']:
              p.y += 5;
              break;
          }
        }
      });

      Q.scene("level1", function (stage) {
        Q.stageTMX("all-levels.tmx", stage);
        stage.add("viewport").follow(Q("Player").first());

        stage.viewport.scale = 1;
      });

      Q.loadTMX("all-levels.tmx, test-64.png, player.json, dungeon.png, SaraFullSheet.png", function () {
        Q.compileSheets("SaraFullSheet.png", "player.json");
        Q.animations("player", {
          walk_right: {frames: [0, 1, 2, 3, 4, 5, 6, 7], rate: 1 / 15, flip: false, loop: true},
          walk_left: {frames: [0, 1, 2, 3, 4, 5, 6, 7], rate: 1 / 15, flip: "x", loop: true}
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
