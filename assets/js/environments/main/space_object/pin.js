JL.webgl.space_object.pin = JL.functions.inherit_class( function(){}, JL.webgl.space_object._physics, {
	_inputs_assign  : [
		{ path : [ 'graphics_objects' ], value : {
			get_default : function(){
				var label = [ 'bowling', 'pin' ];
				var default_g_o = JL.webgl.functions.get_graphics_object( label );
				if( !default_g_o ) default_g_o = JL.webgl.functions.create_graphics_object({ label, async : false, });
				return [ default_g_o ];
			}
		} },
	],
	_inputs : [
		{ key : 'size', type : 'float', default : 1 },
	]
} );

JL.webgl.space_object.pin.prototype._on_instantiate = function( p ){
	if( !this.no_physics ){
		var size_half           = this.size / 2;
		var radius              = 0.169 * this.size;
		var radius_half         = radius / 2;
		var center_of_mass      = 0.264 * this.size;
		var center_of_mass_half = center_of_mass / 2;

		// The orientation offset is needed for moving the center of mass to the lower-middle of the pin.
		p.orientation = p.orientation || [{ type : 'translate', val : [ 0, -size_half, 0 ] }];

		p.collider = JL.functions.recursive_assign({
			position : { x : 0, y : 0, z : 0 },
			shapes   : [
				{
					type     : 'cylinder',
					rad_top  : radius_half,
					rad_bot  : radius_half,
					height   : this.size,
				},
				{
					type   : 'sphere',
					radius,
					position : { x : 0, y : -center_of_mass_half, z : 0 }
				},
			],
			collision_filter : 'item',
			// damping  : { linear : 0.5, angular : 0.5, },
		}, p.collider || {} );

		p.collider.position.y += size_half;

		this.original_position = JL.functions.deep_copy( p.collider.position );

		if( !p.collider.mass ) p.collider.mass = 100;

		p.collider.friction         = 0.5;
		p.collider.rolling_friction = 0.5;
	}
};

JL.webgl.space_object.pin.prototype.reset = function(){
	this.enable_physics();

	this.reset_physics();

	this.set_physics_position(
		this.original_position.x,
		this.original_position.y,
		this.original_position.z,
	);
};

JL.webgl.space_object.pin.prototype.move_off_screen = function(){
	if( this.physics_disabled ) return;

	this.enable_physics();

	this.set_physics_position(
		this.original_position.x + 999999,
		this.original_position.y,
		this.original_position.z,
	);

	this.calculate_position_from_physics();

	// this.disable_physics();
};

JL.webgl.space_object.pin.prototype.is_knocked_down = function(){
	if( this.physics_disabled ) return true;

	var position = this.get_world_transform().getOrigin();

	if( Math.abs( this.original_position.x - position.x() ) > 0.01 ) return true;
	if( Math.abs( this.original_position.z - position.z() ) > 0.01 ) return true;
	return false;
};
