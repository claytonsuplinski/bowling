JL.webgl.environments.game.mini_games.bowling.intro = function(){
	var self = this;

	this.initialize({ no_players : true });

	this.main_lane.select();
	this.main_lane.add_per_frame_function( function(){
		JL.webgl.active_camera.lat  = 10;
		JL.webgl.active_camera.rad  = 12.5;
		JL.webgl.active_camera.lon -= 0.1;
	} );
};
