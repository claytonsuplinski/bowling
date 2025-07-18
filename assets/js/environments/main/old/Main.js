JL.webgl.functions.init_environment( [ 'game', 'mini_games', 'bowling' ], {
	collision_filters : [
		// TODO : Physics appears to be broken for bowling demo. Might be related to collision_filters.
		{ name : 'user' , collide_with : [ 'still'                ] },
		{ name : 'still', collide_with : [ 'user'                 ] },
		{ name : 'ball' , collide_with : [ 'lane', 'pins'         ] },
		{ name : 'pins' , collide_with : [ 'pins', 'ball', 'lane' ] },
		{ name : 'lane' , collide_with : [ 'pins', 'ball'         ] },
	],
	load_groups : [ 'Bowling' ],
	physics_on  : true,
	properties  : {
		balls : [],
	}
});

JL.webgl.environments.game.mini_games.bowling.init = function(){
	this.init_constants();
};

JL.webgl.environments.game.mini_games.bowling.load = function( p ){
	var self = this;

	var p = p || {};

	this.add_space_object({ graphics_objects : [ JL.webgl.graphics_objects.game.mini_games.bowling.floor   ], draw_xyz : true });
	this.add_space_object({ graphics_objects : [ JL.webgl.graphics_objects.game.mini_games.bowling.walls   ], draw_xyz : true });
	this.add_space_object({ graphics_objects : [ JL.webgl.graphics_objects.game.mini_games.bowling.ceiling ], draw_xyz : true });

	var lane_offset   = 4 * this.bowling_lane_half_width;
	var lane_offset_2 = 2 * lane_offset;

	this.lanes = [];

	[
		{
			x           : -39,
			ui_elements : [ ['game','title'], ['game','begin'], ['game','controls'] ],
			ui_info     : {
				game : {
					title    : 'BOWLING',
					begin    : { onclick : 'JL.webgl.environments.game.mini_games.bowling.ui.menus.start.draw();'    },
					controls : { onclick : 'JL.webgl.environments.game.mini_games.bowling.ui.menus.controls.draw();' },
				},
			}
		},
		{ x : -39, z :  lane_offset  , no_collider : true },
		{ x : -39, z : -lane_offset  , no_collider : true },
		{ x : -39, z :  lane_offset_2, no_collider : true },
		{ x : -39, z : -lane_offset_2, no_collider : true },
	].forEach(function( lane_params ){
		var lane = this.add_lane( lane_params );
		if( !lane_params.no_collider ) this.main_lane = lane;
		this.lanes.push( lane );
	}, this);

	if( !p.no_players ){
		this.players = [];

		this.players.push( this.user = this.create_player({
			name : 'User',
			user : true,
			y    : this.ball_radius + this.bowling_lane_half_height,
		}) );

		for( var i = 1; i <= this.num_computers; i++ ){
			this.players.push( this[ 'cpu' + i  ] = this.create_player({
				name : 'Computer ' + i,
				y    : this.ball_radius + this.bowling_lane_half_height,
				z    : 2 * this.ball_radius,
			}) );
		}

		this.curr_player_idx = 0;
		this.curr_player = this.players[ this.curr_player_idx ];

		this.align_all_players();

		this.user.ui_draw();

		this.game = this.create_game({
			name         : 'Bowling',
			on_game_over : function(){ JL.webgl.ui.item.game.finish.show(); },
		});
	}

	/*
	-Radius of the bowling ball should be 4.25 inches (diameter of 8.5 inches)

	-Pins should be 1 foot apart (measured from the center of the pins)
	-Pins should be 15 inches tall
	-The front-most pin should be 60 feet from the start of the lane

	-The width of the lane should be 3.5 feet
	*/

	var chair = this.add_space_object({
		graphics_objects : [ JL.webgl.graphics_objects.furniture.chairs.tulip_chair ],
		draw_xyz         : true,
		x                : 15,
		z                : -5,
	});

	var table = this.add_space_object({
		graphics_objects : [ JL.webgl.graphics_objects.furniture.side_table ],
		draw_xyz         : true,
		x                : 15,
		z                :  5,
	});

	var stool = this.add_space_object({
		graphics_objects : [ JL.webgl.graphics_objects.furniture.chairs.dalfred_stool ],
		draw_xyz         : true,
		x                : 12.5,
		z                : -5,
	});

	var tv = this.add_space_object({
		graphics_objects : [ JL.webgl.graphics_objects.appliances.tv ],
		scale            : [ 5, 5, 5 ],
		draw_xyz         : true,
		x                :  20,
		z                : -10,
	});

};

JL.webgl.environments.game.mini_games.bowling.random_ball_model = function(){
	var colors = Object.keys( JL.webgl.graphics_objects.game.mini_games.bowling.ball );
	return JL.webgl.graphics_objects.game.mini_games.bowling.ball[ colors[ Math.floor( JL.functions.random_number( 0, colors.length ) ) ] ];
};

JL.webgl.environments.game.mini_games.bowling.remove_balls = function(){
	this.balls.forEach(function( ball ){
		ball.remove_physics();
		this._root_object.remove_child( ball, 'independent' );
	}, this);
	this.balls = [];
};
