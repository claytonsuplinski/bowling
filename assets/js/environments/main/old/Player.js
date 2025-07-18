JL.webgl.environments.game.mini_games.bowling.create_player = function( p ){
	var self = this;

	var p = p || {};

	p.graphics_objects = [ p.model || this.random_ball_model() ];
	p.scale            = [ this.ball_radius, this.ball_radius, this.ball_radius ];

	p.camera_offset = { lat : 14, lon : 0, rad : 4.5 * this.ball_radius };

	if( !p.select && p.user ) p.select = true;

	p.rotation = [ [ 0, 90, 0 ] ];

	p.orientation = [];

	p.turn_mag = 0.2;

	p.collider = {
		collision_filter : this.collision_filters.user,
		shapes           : [{ type : 'sphere', radius : this.ball_radius }],
	};

	p.ui_elements = [ ['game','scoreboard','bowling'], ['game', 'finish'], ['game','pause'], ['game','power_gauge'] ];

	p.ui_info = {
		_game : this,
		game  : {
			finish      : {
				callback : function(){
					JL.webgl.ui.item.game.finish.close();
					self.ui.menus.end.draw();
				}
			},
			pause       : { onclick : 'JL.webgl.environments.game.mini_games.bowling.ui.menus.pause.draw();' },
			power_gauge : {
				callback : function(){
					if( self.curr_player.user ) self.curr_player.throw_ball();
				}
			}
		}
	};

	var player = this.add_walker( p );

	player.walk_mag *= -1;

	player.environment = this;

	player.frames = [];
	for( var i = 0; i < 10; i++ ) player.frames.push({ values : [], max_values : ( i != 9 ? 2 : 3 ) });

	player.turn_bonuses = []; // for adding on additional points during future rolls for strikes and spares

	Object.assign( player, this.player );

	return player;
};

JL.webgl.environments.game.mini_games.bowling.player = { score : 0, curr_frame : 0 };

JL.webgl.environments.game.mini_games.bowling.player.throw_ball = function( power, accuracy ){
	if( !this.finished && !this.environment.balls.length ){
		var throw_mag = -1000000;
		var throw_spread = 4;

		if( power    === undefined ) power    = JL.webgl.ui.item.game.power_gauge.power;
		if( accuracy === undefined ) accuracy = JL.webgl.ui.item.game.power_gauge.accuracy;

		var player_pos = this.collider.body.getWorldTransform().getOrigin();
		var player_x = player_pos.x();
		var player_y = player_pos.y();
		var player_z = player_pos.z();

		var ball = this.environment.add_item({
			name               : 'Ball ' + ( this.environment.balls.length + 1 ),
			graphics_objects   : [ this.environment.random_ball_model() ],
			scale              : [ this.environment.ball_radius, this.environment.ball_radius, this.environment.ball_radius ],
			x                  : player_x,
			y                  : player_y + 1.1 * this.environment.ball_radius,
			z                  : player_z,
			camera_offset      : { lat : 15, rad : 8 * this.environment.ball_radius },
			independent_camera : true,
			collider           : {
				mass             : 50000,
				friction         : 1,
				rolling_friction : 1,
				collision_filter : this.environment.collision_filters.ball,
				shapes           : [{ type : 'sphere', radius : this.environment.ball_radius }],
			},
		});

		ball.collider.add_collision_event(function( target ){
			if( target.a == JL.webgl.environments.game.mini_games.bowling.main_lane.backstop.collider.body.a ){
				ball.hit_backstop = true;
				ball.collider.remove_collision_event();
			}
		});

		ball.calculate_position_from_physics(); // Need this line, otherwise the ball appears at the origin for one frame (before the model matrix is updated by the physics engine)

		var spread       = throw_spread * ( 1 - accuracy );
		var angle_offset = JL.functions.random_number( -spread, spread );

		var dir = WXSATS.functions.vector_rotate_y( JL.webgl.functions.get_forward_vector( this.matrix, throw_mag * power ), angle_offset );

		ball.apply_force( dir[ 0 ], dir[ 1 ], -dir[ 2 ] );

		ball.select([ ball, this ]);

		this.environment.balls.push( ball );

		setTimeout(function(){
			var ball_stopped_interval = setInterval(function(){
				if( ball.get_speed() <= 0.005 || ball.hit_backstop || ball.collider.body.getWorldTransform().getOrigin().y() < -1 ){
					clearInterval( ball_stopped_interval );

					JL.webgl.environments.game.mini_games.bowling.next_turn();
				}
			}, 100);
		}, 2000);
	}
};
