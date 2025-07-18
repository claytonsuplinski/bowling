JL.webgl.environments.game.mini_games.bowling.add_lane = function( p ){
	var p = p || {};

	var add_function = ( p.no_collider ? 'add_space_object' : 'add_item' );

	var lane_params = Object.assign( Object.assign( {}, p ), {
		x        : p.x,
		y        : 0,
		z        : p.z,
		graphics_objects : [ JL.webgl.graphics_objects.game.mini_games.bowling.lane ],
		draw_xyz : true,
	});

	var backstop_params = {
		x        : p.x,
		y        : 0,
		z        : p.z,
		graphics_objects : [ JL.webgl.graphics_objects.game.mini_games.bowling.backstop ],
		draw_xyz : true,
	};

	if( !p.no_collider ){
		var gutter_bottom_offset  = this.gutter_half_width + this.bowling_lane_half_width;
		var side_wall_offset      = this.side_wall_dim + this.gutter_width + this.bowling_lane_half_width;

		var dim_bottom_box        = { x : this.bowling_lane_half_length , y : this.gutter_half_bottom          , z : this.gutter_half_width        };
		var dim_side_wall_box     = { x : this.bowling_lane_half_length , y : this.bowling_lane_half_height    , z : this.side_wall_dim            };
		var dim_approach_area_box = { x : this.approach_area_half_length, y : this.bowling_lane_half_height / 2, z : this.approach_area_half_width };

		//---------------//
		// Lane Collider //
		//---------------//

		lane_params.collider = {
			motion           : 'static',
			friction         : 1,
			rolling_friction : 1,
			collision_filter : this.collision_filters.lane,
			shapes           : [
				//------//
				// Lane //
				//------//
				{
					type       : 'cube',
					dimensions : { x : this.bowling_lane_half_length, y : this.bowling_lane_half_height, z : this.bowling_lane_half_width },
				},
				//---------------//
				// Approach Area //
				//---------------//
				{
					type       : 'cube',
					dimensions : dim_approach_area_box,
					position   : { x : this.bowling_lane_half_length + this.approach_area_half_length, y : this.bowling_lane_half_height / 2, z : 0 },
				},
				//------------//
				// Side Walls //
				//------------//
				{ type : 'cube', dimensions : dim_side_wall_box, position : { x : 0, y : this.bowling_lane_half_height, z :  side_wall_offset } },
				{ type : 'cube', dimensions : dim_side_wall_box, position : { x : 0, y : this.bowling_lane_half_height, z : -side_wall_offset } },
				//---------//
				// Gutters //
				//---------//
				{ type : 'cube', dimensions : dim_bottom_box, position : { x : 0, y : this.gutter_half_bottom, z :  gutter_bottom_offset } },
				{ type : 'cube', dimensions : dim_bottom_box, position : { x : 0, y : this.gutter_half_bottom, z : -gutter_bottom_offset } },
			]
		};

		//-------------------//
		// Backstop Collider //
		//-------------------//

		backstop_params.collider = {
			motion           : 'static',
			collision_filter : this.collision_filters.lane,
			shapes           : [
				{
					type       : 'cube',
					dimensions : { x :   0.5, y : 3.5, z : 3.5 },
					position   : { x : -35.5, y : 3.5, z : 0   },
					// position   : { x : ( p.x || 0 ) - 35.5, y : 3.5, z : ( p.z || 0 ) }
				},
			]
		};

		//----------------------------------------------//
		// Create Collider for Approach Area Boundaries //
		//----------------------------------------------//

		var approach_area_boundary_width  = 1;
		var approach_area_boundary_height = 5;

		var dim_approach_area_boundary_side_box = { x : this.approach_area_half_length, y : approach_area_boundary_height, z : approach_area_boundary_width };

		var approach_area_boundary_side_x = approach_area_boundary_width + this.approach_area_half_length;
		var approach_area_boundary_side_z = approach_area_boundary_width + this.approach_area_half_width ;

		this.approach_area_boundary_collider = new JL.webgl.physics.collider({
			mass             : 0,
			motion           : 'static',
			position         : { x : -approach_area_boundary_width + p.x + this.bowling_lane_half_length, y : approach_area_boundary_height + this.bowling_lane_half_height, z : 0 },
			collision_filter : this.collision_filters.still,
			world            : this.world,
			shapes           : [
				{
					type       : 'cube',
					dimensions : { x :  approach_area_boundary_width, y : approach_area_boundary_height, z : this.approach_area_half_width },
				},
				{
					type       : 'cube',
					dimensions : { x : approach_area_boundary_width, y : approach_area_boundary_height, z : this.approach_area_half_width },
					position   : { x : 2 * ( this.approach_area_half_length + approach_area_boundary_width ), y : 0, z : 0 }
				},
				{
					type       : 'cube',
					dimensions : dim_approach_area_boundary_side_box,
					position   : { x : approach_area_boundary_side_x, y : 0, z :  approach_area_boundary_side_z }
				},
				{
					type       : 'cube',
					dimensions : dim_approach_area_boundary_side_box,
					position   : { x : approach_area_boundary_side_x, y : 0, z : -approach_area_boundary_side_z }
				},
			]
		});
	}

	var lane = this[ add_function ]( lane_params );
	lane.pins = [];

	lane.backstop = this[ add_function ]( backstop_params );

	if( !p.no_pins ){
		for( var i = 0; i < 10; i++ ) lane.pins.push( this.add_pin( p ) );

		this.reset_pins( lane );
	}

	return lane;
};

JL.webgl.environments.game.mini_games.bowling.add_pin = function( p ){
	var p = p || {};

	var params = {
		graphics_objects : [ JL.webgl.graphics_objects.game.mini_games.bowling.pin ],
		scale    : this.pin_scale,
		draw_xyz : true,
	};

	if( !p.no_collider ){
		params.radius      = this.pin_collider_radius;
		params.damping     = { linear : 0.5, angular : 0.5 };
		params.sleep       = { sleepSpeedLimit : 2 };
		params.orientation = [
                        { type : 'translate', val : [ 0, -this.pin_scale[ 1 ] / 2, 0 ] },
                ];
		params.collider = {
			mass             : 10000,
			collision_filter : this.collision_filters.pins,
			shapes           : [
				{
					type     : 'cylinder',
					rad_top  : this.pin_collider_radius / 2,
					rad_bot  : this.pin_collider_radius / 2,
					height   : this.pin_scale[ 1 ],
				},
				{
					type   : 'sphere',
					radius : this.pin_collider_radius,
					position : { x : 0, y : -this.pin_center_of_mass_half, z : 0 }
				},
			]
		};
	}

	var pin = this[( p.no_collider ? 'add_space_object' : 'add_item' )]( params );

	return pin;
};

JL.webgl.environments.game.mini_games.bowling.pin_knocked_down = function( pin ){
	var position = pin.collider.body.getWorldTransform().getOrigin();
	return ( [ 'x', 'z' ].find( x => Math.round( 10 * position[ x ]() ) / 10 != pin.original_position[ x ] ) );
};

JL.webgl.environments.game.mini_games.bowling.reset_pins = function( lane, clear_fallen ){
	[       
		{ x : -28, z : -1.5 },
		{ x : -28, z : -0.5 },
		{ x : -28, z :  0.5 },
		{ x : -28, z :  1.5 },

		{ x : -27, z : -1   },
		{ x : -27, z :  0   },
		{ x : -27, z :  1   },

		{ x : -26, z : -0.5 },
		{ x : -26, z :  0.5 },

		{ x : -25, z :  0   },
	].forEach(function( pin_offset, pin_index ){
		var pin = lane.pins[ pin_index ];

		var x = lane.x + ( pin_offset.x || 0 );
		var z = lane.z + ( pin_offset.z || 0 );

		if( pin.collider ){
			var clear_pin = ( clear_fallen && ( pin.physics_disabled || this.pin_knocked_down( pin ) ) );

			pin.enable_physics();

			var y = lane.y + 1.1 * this.pin_scale[ 1 ];

			pin.reset_physics();

			if( clear_pin ) x += 999999;

			pin.set_physics_position( x, y, z );

			pin.calculate_position_from_physics(); // Need this line, otherwise knocked-down pins won't get cleared.

			if( clear_pin ) pin.disable_physics();

			pin.original_position = { x : x, y : y, z : z };
		}
		else{
			pin.x = x;
			pin.y = lane.y + this.bowling_lane_half_height;
			pin.z = z;
		}
	}, this);
};

JL.webgl.environments.game.mini_games.bowling.num_knocked_down_pins = function(){
	var output = 0;

	this.main_lane.pins.filter( pin => !pin.physics_disabled ).forEach(function( pin ){
		if( this.pin_knocked_down( pin ) ) output++;
	}, this);

	return output;
};
