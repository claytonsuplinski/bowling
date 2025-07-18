JL.webgl.functions.init_environment( [ 'main' ], {
	lights      : [{ position : [ 500, 500, -500 ], ambient : 0.2, color : [ 0.8, 0.8, 0.8 ] }],
	load_groups : [ 'Main Zone' ],
	properties  : {
		settings : {},
	}
});

JL.webgl.environments.main.change_setting = function( name, val ){
	var s = this.settings.find( x => x.name == name );

	if( s.min !== undefined && s.max !== undefined ) s.value = JL.functions.clamp( val, min, max );
};

JL.webgl.environments.main.get_change_zone = function( p ){
	var this_str = 'JL.webgl.environments.main';
	return this_str + '.change_zone( {}, ' + this_str + '.zones[\'' + p.zone + '\'], ' + JSON.stringify( p.args ) + ' || {} );';
};

JL.webgl.environments.main.load = function(){
	this.add_space_object({
		graphics_objects : [ this.get_graphics_objects([ 'antarctica' ]) ],
		camera_offset    : { lat : 40, rad : 1.5, offset : [0, -0.1, -0.5] },
		draw_xyz         : true,
		ui_elements      : [ 'main_menu' ],
		select           : true,
		// ui_info          : {
		// 	main_menu : {},
		// },
		per_frame_functions : [
			function(){ try{ JL.webgl.active_camera.lon += 0.1; } catch(e){} },
		],
	});
};
