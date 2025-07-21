JL.webgl.space_object.ball = JL.functions.inherit_class( function(){}, JL.webgl.space_object._physics, {
	_inputs_assign  : [
		{ path : [ 'graphics_objects' ], value : {
			get_default : function(){ return [ JL.webgl.functions.get_graphics_object( 'bowling_ball' ) ]; },
		} },
		{ path : [ 'independent_camera' ], value : { default : true, } },
	],
	_inputs : [
		{ key : 'radius', type : 'float', default : 1 },
	]
} );

JL.webgl.space_object.ball.prototype._on_instantiate = function( p ){
	var self = this;

	this.player = p.parent_object;
	this.game   = this.player.parent_object;

	this.ui_elements = JL.functions.filter_duplicates( ( this.ui_elements || [] ).concat([ 'scoreboard' ]) );

	if( !this.ui_info ) this.ui_info = {};
	this.ui_info._game = this.game;

	this.camera_offset = { lat : 20, lon : 180, rad : 10 };

	var boundary_a = this.game.boundary.body.a;

	p.collider = Object.assign({
		friction         : 1,
		rolling_friction : 1,
		collision_filter : 'item',
		shapes           : [{ type : 'sphere', radius : this.radius, }],
		on_collide       : function( target ){
			if( target.a == boundary_a ) self.finish_throw();
		},
	}, p.collider || {} );

	if( !p.collider.mass ) p.collider.mass = 10000;

	this.scale = [ this.radius, this.radius, this.radius, ];

	this.stop_interval = setInterval(function(){
		if( self.get_speed() <= 0.005 ){
			clearInterval( self.stop_interval );
			self.finish_throw();
		}
	}, 500 );
};

JL.webgl.space_object.ball.prototype.finish_throw = function(){
	clearInterval( this.stop_interval );

	this.player.post_throw_update();

	this.remove();
};
