JL.webgl.space_object.bowling_game = JL.functions.inherit_class( function(){}, JL.webgl.space_object._regular, {
	_inputs : [
		{ key : 'num_pins'   , type :   'int', default : 10    , ui_order : '0_a', max : 500 },
		{ key : 'pin_spacing', type : 'float', default :  0.8  , ui_order : '0_b' },
		{ key : 'num_cpus'   , type :   'int', default :  0    , ui_order : '0_c' },
		{ key : 'ball_radius', type : 'float', default :  0.285, ui_order : '0_d' },
		{ key : 'num_frames' , type :   'int', default : 1    , ui_order : '0_e', min : 1 },
		// { key : 'num_frames' , type :   'int', default : 10    , ui_order : '0_e', min : 1 },
	]
} );

JL.webgl.space_object.bowling_game.prototype._constructor = function( p ){
	this.positions = [];

	try{ Object.assign( this, JL.webgl.variables.bowling ); } catch(e){}

	this.camera_offset = { lat : 15, lon : 180, rad : 10 };

	this.ui_elements = JL.functions.filter_duplicates( ( this.ui_elements || [] ).concat([ 'scoreboard', 'finish', ]) );

	if( !this.ui_info ) this.ui_info = {};
	this.ui_info._game  = this;
	this.ui_info.finish = {};

	this.pins_x_offset =  0;
	this.pins_y_offset =  0;
	this.pins_z_offset = 20;

	var min_x =  Infinity;
	var max_x = -Infinity;
	var min_z =  0;
	var max_z = -Infinity;

	var z = 0;
	while( this.positions.length < this.num_pins ){
		var row_offset = ( z % 2 ? 0.5 : 0 );
		for( var r_i = 0; r_i < z + 1; r_i++ ){
			var x = this.pin_spacing * ( r_i % 2 ? 1 : -1 );

			if( row_offset == 0 ){
				if( r_i > 0 ) x *= ( Math.floor( ( r_i + 1 ) / 2 ) + row_offset );
				else          x  = 0;
			}
			else{
				x *= ( Math.floor( r_i / 2 ) + row_offset );
			}

			var curr_x = this.x + this.pins_x_offset + x;
			var curr_z = this.z + this.pins_z_offset + ( z * this.pin_spacing );

			if( curr_x < min_x ) min_x = curr_x;
			if( curr_x > max_x ) max_x = curr_x;
			if( curr_z < min_z ) min_z = curr_z;
			if( curr_z > max_z ) max_z = curr_z;
			
			this.positions.push({
				x : curr_x,
				y : this.pins_y_offset,
				z : curr_z,
			});

			if( this.positions.length >= this.num_pins ) break;
		}

		z++;
	}

	this.pins = [];

	for( var position of this.positions ){
		this.pins.push(
			this.environment.add_space_object({
				collider      : { position, },
				parent_object : this,
			}, JL.webgl.space_object.pin )
		);
	}

	var boundary_padding_x = 10;
	var boundary_padding_z = 20;

	var boundary_min_x = min_x - boundary_padding_x;
	var boundary_max_x = max_x + boundary_padding_x;

	var boundary_min_z = min_z - boundary_padding_z;
	var boundary_max_z = max_z + boundary_padding_z;

	this.boundary = this.environment.add_collider({
		shapes   : [
			{ type : 'cube', dimensions : { x : 50, y : 50, z :  5 }, position : { x :   0, y : 50, z : boundary_min_z } },
			{ type : 'cube', dimensions : { x : 50, y : 50, z :  5 }, position : { x :   0, y : 50, z : boundary_max_z } },

			{ type : 'cube', dimensions : { x :  5, y : 50, z : 50 }, position : { x : boundary_min_x, y : 50, z :   0 } },
			{ type : 'cube', dimensions : { x :  5, y : 50, z : 50 }, position : { x : boundary_max_x, y : 50, z :   0 } },
		],
		position : { x : 0, y : 0, z : 0 },
		collision_filter : 'still',
	});

	this.user_barrier = this.environment.add_collider({
		shapes   : [
			{ type : 'cube', dimensions : { x : 50, y : 50, z :  1 }, position : { x :   0, y : 50, z : min_z + 2 } },
		],
		position : { x : 0, y : 0, z : 0 },
		collision_filter : 'user_sensor',
	});

	this.players = [];

	this.curr_player_idx = -1;

	this.user = this.environment.add_space_object({
		name             : 'User',
		is_user          : true,
		hue_rotate       : 0,
		parent_object    : this,
	}, JL.webgl.space_object.player );
	this.players.push( this.user );

	// TODO : test
	for( var i = 0; i < 1; i++ ){
		this.players.push(
			this.environment.add_space_object({
				name          : 'CPU ' + ( i + 1 ),
				hue_rotate    : JL.webgl.constants.PI2 * ( 0.8 * JL.functions.get_unique_distributed_value( i + 1 ) + 0.1 ),
				parent_object : this,
			}, JL.webgl.space_object.player )
		);
	}

	if( !JL.webgl.variables.is_editing ) this.next_player();
	else                                 this.reset_all_players_physics();
};

JL.webgl.space_object.bowling_game.prototype.reset_all_players_physics = function(){
	for( var i = 0; i < this.players.length; i++ ){
		this.players[ i ].set_physics_position( this.x + 5, this.y + 0.1, this.z - ( 5 * i ) );
		this.players[ i ].set_physics_rotation( 0, 0, 0, 1 );
	}
};

JL.webgl.space_object.bowling_game.prototype.next_player = function(){
	this.reset_all_players_physics();

	this.curr_player_idx++;
	this.curr_player_idx %= this.players.length;

	this.curr_player = this.players[ this.curr_player_idx ];

	this.curr_player.set_physics_position( this.x, this.y + 0.1, this.z );

	this.curr_player.select();
};

JL.webgl.space_object.bowling_game.prototype.get_result = function(){
	var score_user = 0;
	var score_cpu  = 0;
	for( var player of this.players ){
		if( player.is_user ) score_user = Math.max( player.score, score_user );
		else                 score_cpu  = Math.max( player.score, score_cpu  );
	}

	return ( score_user - score_cpu );
};

JL.webgl.space_object.bowling_game.prototype.is_finished = function(){
	return this.players.every( player => player.finished );
};

JL.webgl.space_object.bowling_game.prototype.get_num_knocked_down_pins = function(){
	var output = 0;
	for( var pin of this.pins ){
		if( pin.is_knocked_down() ) output++;
	}
	return output;
};

JL.webgl.space_object.bowling_game.prototype.reset_pins = function(){
	for( var pin of this.pins ) pin.reset();
};

JL.webgl.space_object.bowling_game.prototype.remove_knocked_down_pins = function(){
	for( var pin of this.pins ){
		if( pin.is_knocked_down() ){
			pin.move_off_screen();
		}
	}
};
