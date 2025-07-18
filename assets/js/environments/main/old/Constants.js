JL.webgl.environments.game.mini_games.bowling.init_constants = function(){
	this.ball_radius = 0.354;

	this.bowling_lane_height = 1;

	this.bowling_lane_half_width  = 1.75;
	this.bowling_lane_half_length = 35;
	this.bowling_lane_half_height = this.bowling_lane_height / 2;

	this.approach_area_half_width  = 3.5;
	this.approach_area_half_length = 7.5;

	this.gutter_width       = 0.77;
	this.gutter_half_width  = this.gutter_width / 2;
	this.gutter_half_bottom = 0.0575;

	this.side_wall_dim = 0.5;

	var pin_scale = 1.25;
	this.pin_scale           = [ pin_scale, pin_scale, pin_scale ];
	this.pin_collider_radius = 0.169 * pin_scale;
	this.pin_center_of_mass  = 0.264 * pin_scale;
	this.pin_center_of_mass_half = this.pin_center_of_mass / 2;
	this.pin_y = 2 * this.pin_collider_radius + this.bowling_lane_half_height;
};
