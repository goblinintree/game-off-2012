/*
 * The MIT License
 * 
 * Copyright (c) 2012 Petar Petrov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 
Tilemap = ActorObject.extend({
    defaults: {
        // pixel size
        'pxWidth' : _Globals.conf.get('screen-width'),
        'pxHeight' : _Globals.conf.get('screen-height'),   
        
        // tilemap width & height
        'tileSize' : 64,
        'width' : _Globals.conf.get('screen-width') / 64,
        'height' : _Globals.conf.get('screen-height') / 64,
        'base-z' : 10,
        'maxObstacles' : 25,
        
        // Carrots 
        'maxCarrots' : 10,
        'currentCarrots' : 0,
        'carrotSpawnTime' : 2000,
        
        // globals
        obstaclesMap: undefined,
    },
    initialize: function() {
        var model = this;
        
        // generate layer #1 - ground tiles
        for (var i = 0; i < model.get('width'); i++) {
            for (var j = 0; j < model.get('height'); j++) {
                var entity = Crafty.e("2D, Canvas, grass")
                .attr({x: i * model.get('tileSize'), y: j * model.get('tileSize'), z: 0});
            }
        }
        
        // generate layer #2 - obstacles
        var obstaclesCoords = [];
        var cx = model.get('width') - 2;
        var cy = model.get('height') - 2;
        
        for (var i = 0; i < model.get('maxObstacles'); i++) {
            
            var type = Crafty.math.randomInt(1, 4);
            var occupiedTile = false;
            var ox;
            var oy;
            var oz;
            var spriteName = '';
            
            do {
                ox = Crafty.math.randomInt(1, cx);
                oy = Crafty.math.randomInt(1, cy);
                occupiedTile = _.size(_.where(obstaclesCoords, {x: ox, y: oy})) > 0;
                
                if (_Globals.conf.get('debug') && occupiedTile)
                    console.log("Calculate new obstalce position for " + i);
                
            } while (occupiedTile);
            
            // save into tile map
            obstaclesCoords.push({x: ox, y: oy});
            
            // get absolute position
            ox *= model.get('tileSize');
            oy *= model.get('tileSize');
            
            if (type == 1) { // small stone
                spriteName = 'stone_small';
                oz = model.get('base-z') + oy + model.get('tileSize') - 16;
            } else if (type == 2) {
                spriteName = 'stone_big';
                oz = model.get('base-z') + oy + model.get('tileSize') - 8;
            } else if (type == 3) {
                spriteName = 'tree';
                oz = model.get('base-z') + oy + model.get('tileSize');
            } else if (type == 4) {
                spriteName = 'barrel_small';
                oz = model.get('base-z') + oy + model.get('tileSize') - 16;
//            } else if (type == 5) {
//                spriteName = 'barrel_big';
            } else {
                continue;
            }
            
             var entity = Crafty.e("2D, Canvas, " + spriteName + ", Collision")
                .attr({x: ox, y: oy, z: oz});
                
            if (type == 1) { // stone_small
                entity.collision(
                    [16, 40], 
                    [48, 40], 
                    [48, 48], 
                    [16, 48]
                );
            } else if (type == 2) { // stone_big
                entity.collision(
                    [16, 40], 
                    [48, 40], 
                    [48, 48], 
                    [16, 48]
                );                       
            } else if (type == 3) { // tree
                entity.collision(
                    [12, 52], 
                    [56, 52], 
                    [56, 64], 
                    [12, 64]
                );                 
            } else if (type == 4) { // barrel_small
                entity.collision(
                    [16, 40], 
                    [48, 40], 
                    [48, 48], 
                    [16, 48]
                );                      
            }
        }
        
        // set into local var
        model.set('obstaclesMap', obstaclesCoords);
        
        Crafty.c('MapLogic', {
            _zIndex: model.get('base-z') + 24, // precalculate Z
            init: function () {
                this.requires("RealDelay");
                
                // Create new carrot only if maximum is not reached
                if (Crafty("carrot").length < model.get('maxCarrots')) {
                    var ox = Crafty.math.randomInt(1, cx) * model.get('tileSize');
                    var oy = Crafty.math.randomInt(1, cy) * model.get('tileSize');
                            
                    Crafty.e("2D, Canvas, carrot, SpriteAnimation, Collision")
                    .attr({x: ox, y: oy, z: oy + this._zIndex, health: 100})
                    .animate('wind', 0, 0, 3) // setup animation
                    .animate('wind', 15, -1); // play animation
                    
//                    model.set('currentCarrots', model.get('currentCarrots') + 1);
                    //console.log('carrots = ' + model.get('currentCarrots'));
                }
                
                var mapLogic = this;
                        
                // Spawn new carrot every 60 seconds
                Crafty.e("RealDelay").realDelay(function() {
                    
                    if (_Globals.conf.get('debug'))
                        console.log("MapLogic= " + Crafty("MapLogic").length + " RDelay=" + Crafty("RealDelay").length);
                    
                    // cleanup and create new logic entity
                    mapLogic.destroy();
                    Crafty.e("MapLogic");
                    this.destroy();
                }, model.get('carrotSpawnTime'));                
            }
        });
        // Start Carrot spawning logic
        var logic = Crafty.e("MapLogic");
    },
    
    // get unoccupied map position given start coordinates
    spawnAt: function(startX, startY) {
        
        var cx = startX,
            cy = startY;
            
        var occupiedTile = false;
        var nextX = [1, 0, -1, 0];
        var nextY = [0, 1, 0, -1];
        var i = 0, m = 1;
        
        do {
            occupiedTile = _.size(_.where(this.get('obstaclesMap'), {x: cx, y: cy})) > 0;
                
            if (occupiedTile) {
                // nadebugvaj gooo ....
                if (_Globals.conf.get('debug'))
                    console.log("Cannot spawn player at " + cx + "," + cy);
                    
                cx = startX + nextX[i] * m;
                cy = startY + nextY[i] * m;
                
                if ( ++i > 3 ) {
                    i = 0;
                    m++; 
                }
            }
                
        } while (occupiedTile);
        
        return {x: cx * this.get('tileSize'), y: cy * this.get('tileSize')};
    }, 
    // try to spawn at the central tile map position
    spawnAtCentre: function() {
        return this.spawnAt(
            this.get('width') * 0.5, 
            this.get('height') * 0.5);
    }
});
