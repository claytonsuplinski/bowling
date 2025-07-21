JL.webgl.space_object.player = JL.functions.inherit_class( function(){}, JL.webgl.space_object._walker, {
	_inputs_assign  : [
		{ path : [ 'graphics_objects' ], value : {
			get_default : function(){ return [ JL.webgl.functions.get_graphics_object( 'player_arrow' ) ]; },
		} },
		{ path : [ 'walk_mag' ], value : { default : 5000000,   } },
		{ path : [ 'turn_mag' ], value : { default :       0.5, } },
	],
	_inputs : [
		{ key : 'is_user'   , type : 'bool'  },
		{ key : 'hue_rotate', type : 'float', default : 0 },
	]
} );

JL.webgl.space_object.player.prototype._on_instantiate = function( p ){
	var self = this;

	this.game = this.parent_object;

	this.score        = 0;
	this.curr_frame   = 0;
	this.turn_bonuses = [];

	this.computer_min_power    = 0.7;
	this.computer_min_accuracy = 0.7;

	this.ui_elements = JL.functions.filter_duplicates( ( this.ui_elements || [] ).concat([ 'scoreboard', ]) );

	if( !this.ui_info ) this.ui_info = {};
	this.ui_info._game = this.game;

	JL.functions.set_nested_object( this, [ 'frags_float', 'hue_rotate' ], this.hue_rotate );

	this.frames = [];
	var last_frame_idx = this.game.num_frames - 1;
	for( var i = 0; i < this.game.num_frames; i++ ) this.frames.push({ values : [], max_values : ( i != last_frame_idx ? 2 : 3 ) });

	if( this.is_user ){
		this.ui_elements.push( 'power_gauge' );
		this.ui_info.power_gauge = {
			// TODO : Modify the following value to make power_gauge go faster/slower.
			// 	-Could be useful for difficulty levels.
			// speed    : 2,
			onclick  : 'JL.webgl.ui.item.power_gauge.on_user_input();',
			callback : function(){ self.throw_ball(); },
		};
	}
};

JL.webgl.space_object.player.prototype.___on_init = function( p ){
	if( !this.is_user ) this.key_bindings = this.key_bindings.filter( k => ![ 'walker', ].includes( k ) );
};

JL.webgl.space_object.player.prototype.on_select = function(){
	if( !this.is_done_with_turn() ) this.cpu_throw_ball();
};

JL.webgl.space_object.player.prototype.throw_ball = function( p ){
	if( !this.curr_ball ){
		var p = p || {};

		var forward = JL.webgl.functions.get_forward_vector( this.matrix );

		var power = 1;
		if( p.power !== undefined ) power = p.power;

		var accuracy = 1;
		if( p.accuracy !== undefined ) accuracy = p.accuracy;

		this.curr_ball = this.throw_projectile({
			obj_params     : { y : 0.5, radius : p.ball_radius || 0.3, parent_object : this, },
			obj_type       : JL.webgl.space_object.ball,
			forward_offset : 1,
			spread_y       : 20,
			force_y        :  1000000,
			force_z        : 10000000 * power,
			accuracy,
		});

		if( this.hue_rotate !== undefined ){
			JL.functions.set_nested_object( this.curr_ball, [ 'frags_float', 'hue_rotate' ], this.hue_rotate - 90 );
		}

		this.curr_ball.select();
	}
};

JL.webgl.space_object.player.prototype.cpu_throw_ball = function(){
	var self = this;
	if( !this.is_user ){
		setTimeout(function(){
			self.throw_ball({
				power    : JL.functions.random_number( self.computer_min_power   , 1 ),
				accuracy : JL.functions.random_number( self.computer_min_accuracy, 1 ),
			});
		}, 1000); 
		// Need timeout here -- otherwise computer isn't rotated correctly when enabling physics.
		// 	-Also, adds a more natural delay for the computer to throw the ball.
	}
};

JL.webgl.space_object.player.prototype.is_done_with_turn = function(){
	var curr_frame = this.frames[ this.curr_frame ];
	if( !curr_frame ) return true;
	return ( curr_frame.values.length >= curr_frame.max_values );
};

JL.webgl.space_object.player.prototype.post_throw_update = function(){
	var is_last_frame = ( this.curr_frame == this.frames.length - 1 );

        var num_knocked_down_pins = this.game.get_num_knocked_down_pins();

	var curr_frame = this.frames[ this.curr_frame ];

	if( !curr_frame ) return;

	if( is_last_frame ){
		if( curr_frame.values.length >= 1 ){
			var prev_val = curr_frame.values[ curr_frame.values.length - 1 ];
			if( !isNaN( prev_val ) ) num_knocked_down_pins -= prev_val;
		}
	}
	else{
		if( curr_frame.values.length == 1 ) num_knocked_down_pins -= curr_frame.values[ 0 ];
	}

        curr_frame.values.push( num_knocked_down_pins );

	this.score += ( this.turn_bonuses.length + 1 ) * num_knocked_down_pins;

	this.turn_bonuses = this.turn_bonuses.map( b => b - 1 ).filter( b => b > 0 );

	switch( curr_frame.values.length ){
		case 1:
			if( curr_frame.values[ 0 ] == this.game.num_pins ){
				curr_frame.values[ 0 ] = 'X';
				if( curr_frame.max_values != 3 ) this.turn_bonuses.push( 2 );
				if( curr_frame.max_values == 2 ) curr_frame.max_values = 1;
			}
			break;
		case 2:
			if( curr_frame.values[ 0 ] + curr_frame.values[ 1 ] == this.game.num_pins ){
				curr_frame.values[ 1 ] = '/';
				if( curr_frame.max_values != 3 ) this.turn_bonuses.push( 1 );
			}
                        else if( curr_frame.values[ 1 ] == this.game.num_pins ){
                                curr_frame.values[ 1 ] = 'X';
                                if( curr_frame.max_values != 3 ) this.turn_bonuses.push( 2 );
                        }
                        else if( curr_frame.values[ 0 ] != 'X' ){
                                curr_frame.max_values = 2;
                        }
                        break;
                case 3:
                        if( curr_frame.values[ 1 ] + curr_frame.values[ 2 ] == this.game.num_pins ){
                                curr_frame.values[ 2 ] = '/';
                        }
                        else if( curr_frame.values[ 2 ] == this.game.num_pins ){
                                curr_frame.values[ 2 ] = 'X';
                        }
                        break;
        };

	delete this.curr_ball;

	if( this.is_done_with_turn() ){
		this.game.reset_pins();

		this.curr_frame++;
		if( this.curr_frame >= this.frames.length ) this.finished = true;

		this.game.next_player();

		if( this.game.is_finished() ){
			var game_result = this.game.get_result();

			this.game.ui_info.finish.title = ( game_result > 0 ? 'VICTORY' : ( game_result < 0 ? 'DEFEAT' : 'TIE' ) );

			this.game.select();

			JL.webgl.ui.item.finish.show();
		}
	}
	else{
		this.game.remove_knocked_down_pins();

        	if( this.game.get_num_knocked_down_pins() == this.game.num_pins ) this.game.reset_pins();

		this.select();
	}
};
