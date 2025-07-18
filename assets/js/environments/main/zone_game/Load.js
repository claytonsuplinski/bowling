Object.assign( JL.webgl.load.groups, {
	"Bowling Game": {
		steps : [
			{
				init : function(callback){
					JL.webgl.load.graphics_objects_list( this, [
						{
							label      : [ 'player_arrow' ],
							keys       : [ 'interface', 'pointer' ],
							params     : {
								properties : { effects : [ "_dynamic_color", "_hue_rotate", "_hue_rotate_crystals" ] },
								transforms : [
									{ type : 'rotate'   , axis : 'x', val : 90 },
									{ type : 'translate', y : 0.1 },
								],
								attr       : {
									frags_vec4  : { color_main : [1,0,0,0], },
									frags_float : {
										hue_rotate_crystals_mag   : 0.5,
										hue_rotate_crystals_scale : 5,
									},
								},
							},
						},
						{
							label  : [ 'bowling_ball' ],
							type   : 'sphere',
							params : {
								properties : { "effects" : [ "_pattern_squares_03", "_hue_rotate", ] }
							},
						},
					]);
					callback();
				}
			},
		],
		scripts : [
			"./assets/js/environments/main/ui/power_gauge.js",
			"./assets/js/environments/main/ui/scoreboard.js",

			"./assets/js/environments/main/space_object/ball.js",
			"./assets/js/environments/main/space_object/pin.js",
			"./assets/js/environments/main/space_object/player.js",
			"./assets/js/environments/main/space_object/bowling_game.js",
		]
	},
} );
