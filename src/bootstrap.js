$(document).ready(function(){require(["src/config.js","src/actor_object.js","src/hiscore.js"],function(){_Globals.conf=new Config({});$("#stats").hide();Clay.ready(function(){console.log("clay is ready");hiscore=new Hiscore();hiscore.open();_Globals.hiscore=hiscore});Crafty.init(_Globals.conf.get("screen-width"),_Globals.conf.get("screen-height"),60).canvas.init();Crafty.background("transparent");Crafty.scene("loading",function(){Crafty.load(["art/stuz_tiles.png","art/stuz_rabbit.png","art/stuz_enemy.png","art/stuz_fart_moving.png","art/stuz_carrots.png","art/stuz_forkit.png","art/stuz_splash.png","sfx/fart1.ogg","sfx/fart2.ogg","sfx/pull.ogg","sfx/scream1.ogg","sfx/scream2.ogg","sfx/aaaah.ogg","sfx/laughter01.ogg","sfx/laughter02.ogg","sfx/burp.ogg","sfx/trouble_in_the_garden_lowq.ogg",],function(){Crafty.sprite(64,"art/stuz_tiles.png",{grass:[0,0],stone_small:[1,0],stone_big:[2,0],heysack:[3,0],tree:[0,1],bush:[1,1],barrel:[2,1],});Crafty.sprite("art/stuz_rabbit.png",{player:[0,0,32,48],});Crafty.sprite("art/stuz_enemy.png",{enemy:[0,0,32,48],});Crafty.sprite(64,"art/stuz_fart_moving.png",{explosion1:[0,0],});Crafty.sprite("art/stuz_carrots.png",{carrot:[0,0,32,32],});Crafty.sprite(48,"art/stuz_forkit.png",{fork:[0,0],});Crafty.sprite("art/stuz_splash.png",{splash:[0,0],});Crafty.audio.add({fart1:["sfx/fart1.ogg"],fart2:["sfx/fart2.ogg"],pull:["sfx/pull.ogg"],scream1:["sfx/scream1.ogg"],scream2:["sfx/scream2.ogg"],aaaah:["sfx/aaaah.ogg"],laughter1:["sfx/laughter01.ogg"],laughter2:["sfx/laughter02.ogg"],burp:["sfx/burp.ogg"],music:["sfx/trouble_in_the_garden_lowq.ogg"],});Crafty.scene(_Globals.scene);$("#loading").hide()},function(a){$("#loading").html("Loaded: "+a.percent.toFixed(0)+"%")},function(a){$("#loading").html("Could not load: "+a.src);if(_Globals.conf.get("debug")){console.log(a)}});if(_Globals.conf.get("debug")){console.log("Loading ...")}$("#loading").show()});require(["src/actor_object.js","src/tilemap.js","src/player.js","src/enemy.js","src/scene.splash.js","src/scene.game.js","src/gfx.js",],function(){Crafty.scene("loading")})})});