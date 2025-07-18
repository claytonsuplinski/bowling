Object.assign( JL.webgl.load.groups, {
	"Bowling": {
		steps : [
			{
				init : function(callback){
					var g_o_to_load = [];

					[ 'red', 'yellow', 'green', 'blue', 'purple' ].forEach(function( color ){
						g_o_to_load.push({
							label  : [ 'game', 'mini_games', 'bowling', 'ball', color ],
							type   : "sphere",
							params : {
								segs       : 12,
								texture    : './assets/textures/environments/game/mini_games/bowling/balls/' + color + '.png',
								properties : { material : 'environment' },
							}
						});
					}, this);

					var push_g_o = function( label ){
						var path = label.join('/');
						g_o_to_load.push({
							label  : label,
							params : {
								filename   : './assets/models/' + path + '/model.obj'  ,
								texture    : './assets/models/' + path + '/texture.png',
								properties : { material : 'environment' }
							}
						});
					};

					[ 'pin', 'lane', 'floor', 'walls', 'ceiling', 'backstop' ].forEach(function( name ){
						push_g_o([ 'game', 'mini_games', 'bowling', name ]);
					}, this);

					[ 'tulip_chair', 'dalfred_stool' ].forEach(function( name ){
						push_g_o([ 'furniture', 'chairs', name ]);
					}, this);

					[ 'side_table' ].forEach(function( name ){
						push_g_o([ 'furniture', name ]);
					}, this);

					[ 'tv' ].forEach(function( name ){
						push_g_o([ 'appliances', name ]);
					}, this);

					JL.webgl.load.graphics_objects_list( this, g_o_to_load );

					callback();
				}
			},
			{
				init : function(callback){
					var g_o_to_load = [];

					var instanced_graphics_objects = [];

					// TODO : Get decorative objects instanced (like the tulip_chair and tv)
					[
						{
					     	keys      : [ 'furniture', 'chairs', 'tulip_chair' ],
						instances : [
					     		{ pos : [ -10, 0, 10 ], rot : [ 0,   0, 0 ], scl : [ 3, 3, 3 ] },
					     		{ pos : [ -10, 0, 15 ], rot : [ 0,   0, 0 ], scl : [ 3, 3, 3 ] },
					     		{ pos : [ -10, 0, 20 ], rot : [ 0,   0, 0 ], scl : [ 3, 3, 3 ] },
					     		{ pos : [  10, 0, 10 ], rot : [ 0, 180, 0 ], scl : [ 3, 3, 3 ] },
					     		{ pos : [  10, 0, 15 ], rot : [ 0, 180, 0 ], scl : [ 3, 3, 3 ] },
					     		{ pos : [  10, 0, 20 ], rot : [ 0, 180, 0 ], scl : [ 3, 3, 3 ] },
					     	],
					     },
						{
					     	keys      : [ 'furniture', 'chairs', 'dalfred_stool' ],
						instances : [
					     		{ pos : [ -10, 0, 40 ], rot : [ 0, 0, 0 ], scl : [ 4, 4, 4 ] },
					     		{ pos : [ -10, 0, 45 ], rot : [ 0, 0, 0 ], scl : [ 4, 4, 4 ] },
					     		{ pos : [ -10, 0, 50 ], rot : [ 0, 0, 0 ], scl : [ 4, 4, 4 ] },
					     		{ pos : [  10, 0, 40 ], rot : [ 0, 0, 0 ], scl : [ 4, 4, 4 ] },
					     		{ pos : [  10, 0, 45 ], rot : [ 0, 0, 0 ], scl : [ 4, 4, 4 ] },
					     		{ pos : [  10, 0, 50 ], rot : [ 0, 0, 0 ], scl : [ 4, 4, 4 ] },
					     	],
					     },
					].forEach(function( group ){
						var name = group.keys[ group.keys.length - 1 ];
						instanced_graphics_objects.push({
							label      : [ 'environments', 'game', 'mini_games', 'bowling', name ],
							keys       : group.keys,
							instances  : group.instances,
							properties : { material : 'environment' },
						});
					});

					instanced_graphics_objects.forEach(function( obj ){
						var path = ( obj.keys || [] ).join('/');
						var properties = {};
						if( obj.properties ) Object.assign( properties, obj.properties );
						if( !properties.effects ) properties.effects = [];
						properties.effects.push( '_instanced_pos', '_instanced_rot', '_instanced_scl' );
						g_o_to_load.push({
							type   : obj.type,
							label  : obj.label || obj.keys,
							params : {
								filename    : './assets/models/' + path + '/model.obj',
								texture     : ( properties.color ? false : './assets/models/' + path + '/texture.png' ),
								size        : obj.scale,
								properties  : properties,
								transforms  : obj.transforms,
								custom_init : function(){
									this.num_instances = obj.instances.length;

									obj.instances.forEach(function( instance ){
										// var rot = instance.rot.map( x => JL.functions.constants.to_radians * x );

										this.pos.push(
											instance.pos[ 0 ],
											instance.pos[ 1 ],
											instance.pos[ 2 ]
										);
										this.rot.push(
											instance.rot[ 0 ],
											instance.rot[ 1 ],
											instance.rot[ 2 ]
										);
										this.scl.push(
											instance.scl[ 0 ],
											instance.scl[ 1 ],
											instance.scl[ 2 ]
										);
									}, this);

									try{
										if( properties.effects.includes( '_instanced_hue_rotate' ) ){
											obj.instances.forEach(function( instance ){
												this.hue_rotate.push( instance.hue_rotate );
											}, this);
										}
									} catch(e){}
								}
							}
						});
					});

					JL.webgl.load.graphics_objects_list( this, g_o_to_load );

					callback();
				}
			},
		],
		scripts : [
			JL.webgl.dir.jl_webgl + "/environment/game.js",

			"./assets/js/ui/EnvironmentMenu.js",
			"./assets/js/environments/game/menu/Start.js",
			"./assets/js/environments/game/menu/Pause.js",
			"./assets/js/environments/game/menu/Controls.js",
			"./assets/js/environments/game/menu/End.js",

			"./assets/js/ui/item/game/Begin.js",
			"./assets/js/ui/item/game/Controls.js",
			"./assets/js/ui/item/game/Finish.js",
			"./assets/js/ui/item/game/Pause.js",
			"./assets/js/ui/item/game/PowerGauge.js",
			"./assets/js/ui/item/game/Title.js",

			"./assets/js/environments/game/mini_games/bowling/Main.js",
			"./assets/js/environments/game/mini_games/bowling/Constants.js",
			"./assets/js/environments/game/mini_games/bowling/Player.js",
			"./assets/js/environments/game/mini_games/bowling/Lane.js",
			"./assets/js/environments/game/mini_games/bowling/UI.js",
			"./assets/js/environments/game/mini_games/bowling/Intro.js",
			"./assets/js/environments/game/mini_games/bowling/TurnManager.js",
			"./assets/js/ui/item/game/scoreboard/Bowling.js",
		]
	}
} );
