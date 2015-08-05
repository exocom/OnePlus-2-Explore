angular.module('starter', ['ionic'])

  .run(function($ionicPlatform, $ionicLoading, $rootScope, $interval) {
    //})
    //.controller('foo', function() {
    $ionicLoading.show({
      template: 'Loading'
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
        .include('Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX')
        .setup({maximize: true})
        .controls(true).touch();

      Q.gravityY = 0;
      Q.gravityX = 0;
      Q.SPRITE_PLAYER = 1;
      Q.SPRITE_GEM = 2;

      Q.Sprite.extend('Player', {
        init: function(p) {
          this._super(p, {
            sheet: 'player',  // Setting a sprite sheet sets sprite width and height
            sprite: 'player',
            direction: 'right',
            type: Q.SPRITE_PLAYER,
            collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_GEM,
            level: 1
          });

          this.p.points = [
            [-20, -10],
            [20, -10],
            [15, 20],
            [-15, 20]
          ];

          this.add('2d, platformerControls, animation, tween');

          this.on('hit.sprite', function(collision) {
            var _this = this;
             if (collision.obj.isA('Gem')) {

               this.p.level++;
               //Q.stageScene('endGame', 1, {label: 'You Won!'});

               this.p.isDancing = true;
               setTimeout(function() {
                 _this.p.isDancing = false;
                 _this.animate({opacity: 0});
                 console.log(_this.p.level);
                 if(_this.p.level === 4){
                   Q.stageScene('ending');
                 } else {
                   Q.stageScene('level' + _this.p.level);
                 }
                 _this.animate({opacity: 1});

               },1000);
             }
          });
        },
        step: function(dt) {
          var p = this.p;

          var speed = Q.inputs['fire'] ? 5 : 5;

          if (p.isDancing) {
            this.play('dance_' + this.p.direction);
          } else {
            switch (true) {
              case Q.inputs['right']:
                p.x += speed;
                this.p.direction = 'right';
                this.play('walk_' + this.p.direction);
                break;
              case Q.inputs['left']:
                p.x -= speed;
                this.p.direction = 'left';
                this.play('walk_' + this.p.direction);
                break;
              case Q.inputs['up']:
                p.y -= speed;
                this.p.direction = 'up';
                this.play('walk_' + this.p.direction);
                break;
              case Q.inputs['down']:
                this.p.direction = 'down';
                this.play('walk_' + this.p.direction);
                p.y += speed;
                break;
              default :
                this.play('stand_' + this.p.direction);
                break;
            }
          }
        }
      });

      Q.Sprite.extend('Gem', {
        init: function(p) {
          this._super(p,{
            sheet: p.sprite,
            type: Q.SPRITE_GEM,
            collisionMask: Q.SPRITE_PLAYER,
            sensor: true,
            vx: 0,
            vy: 0,
            gravity: 0
          });
          this.add('animation');
          this.on('sensor');
        },
        sensor: function(colObj) {
          this.destroy();
        }
      });

      var audio = null;

      Q.scene('level1', function(stage) {
        Q.stageTMX('all-levels.tmx', stage);

        Q('Player').items[0].p.level = 1;
        stage.add('viewport').follow(Q('Player').first());

        if(audio){
          audio.stop();
        }
        audio = new Audio('http://opengameart.org/sites/default/files/audio_preview/00%20intro_0.ogg.mp3', 100, true);
        audio.play();
      });

      Q.scene('level2', function(stage) {
        Q.stageTMX('all-levels.tmx', stage);

        // Move the player into position
        Q('Player').items[0].p.x = 5168;
        Q('Player').items[0].p.y = 1085;
        Q('Player').items[0].p.level = 2;

        stage.add('viewport').follow(Q('Player').first());

        if(audio && audio.pause){
          audio.pause();
        }
        audio = new Audio('http://opengameart.org/sites/default/files/Electrix_NES.mp3', 100, true);
        audio.play();
      });

      Q.scene('level3', function(stage) {
        Q.stageTMX('all-levels.tmx', stage);

        // Move the player into position
        Q('Player').items[0].p.x = 5900;
        Q('Player').items[0].p.y = 1085;
        Q('Player').items[0].p.level = 3;

        stage.add('viewport').follow(Q('Player').first());

        stage.viewport.scale = 1;

        if(audio && audio.pause){
          audio.pause();
        }
        audio = new Audio('http://opengameart.org/sites/default/files/audio_preview/JRPG_mainTheme.ogg.mp3', 100, true);
        audio.play();
      });

      Q.scene('ending', function(stage) {
        Q.stageTMX('all-levels.tmx', stage);
        // TODO : play around with where the zooming starts from
        stage.add('viewport');
        Q('Player').destroy();
        Q('Gems').destroy();

        var x = 0;
        var mapScale = [.3,.1,.055,.045];

        if(audio && audio.pause){
          audio.pause();
        }

        var resizeMap = function() {
          if(x < 4) {
            setTimeout(function() {
              setTimeout(resizeMap,10);
              stage.centerOn(3936, 3552);
              stage.viewport.scale = mapScale[x];
              stage.centerOn(3936, 3552);

              x++;
            }, x === 0 ? 10 : 2000 + (x * 250));
          }
        };
        resizeMap();
      });


      Q.loadTMX('all-levels.tmx, dungeon.png, player.json, SaraFullSheet.png, gems.json, gems_db16.png', function() {
        Q.compileSheets('SaraFullSheet.png', 'player.json');
        Q.compileSheets('gems_db16.png', 'gems.json');
        var rate = 1 / 15;
        Q.animations('player', {
          walk_up: {frames: [104, 105, 106, 107, 108, 109, 110, 111, 112], rate: rate, flip: false, loop: true},
          walk_left: {frames: [117, 118, 119, 120, 121, 122, 123, 124, 125], rate: rate, flip: false, loop: true},
          walk_down: {frames: [130, 131, 132, 133, 134, 135, 136, 137, 138], rate: rate, flip: false, loop: true},
          walk_right: {frames: [143, 144, 145, 146, 147, 148, 149, 150, 151], rate: rate, flip: false, loop: true},

          dance_up: {frames: [0,1,2,3,4,5,6], rate: rate, flip: false, loop: true},
          dance_left: {frames: [13,14,15,16,17,18,19], rate: rate, flip: false, loop: true},
          dance_down: {frames: [26,27,26,29,30,31,32], rate: rate, flip: false, loop: true},
          dance_right: {frames: [39,40,41,42,43,44,45], rate: rate, flip: false, loop: true},

          stand_up: {frames: [104], rate: 1 / 10, flip: false},
          stand_left: {frames: [117], rate: 1 / 10, flip: false},
          stand_down: {frames: [130], rate: 1 / 10, flip: false},
          stand_right: {frames: [143], rate: 1 / 10, flip: false}
        });

        Q.stageScene('level1');
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
