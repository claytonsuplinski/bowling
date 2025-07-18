JL.webgl.environments.game.mini_games.bowling.curr_player_idx = 0;

JL.webgl.environments.game.mini_games.bowling.next_player = function(){
	this.curr_player_idx++;
	this.curr_player_idx %= this.players.length;

	this.curr_player = this.players[ this.curr_player_idx ];
};

JL.webgl.environments.game.mini_games.bowling.get_leader = function(){
	return this.players.reduce( ( max, player ) => ( max.score > player.score ? max : player ) );
};

JL.webgl.environments.game.mini_games.bowling.align_all_players = function(){
	this.players.forEach(function( player, idx ){
		player.disable_physics();
		player.x = idx * 2;
		player.z = -5;
	}, this);

	this.curr_player.x = 0;
	this.curr_player.z = 0;
	this.curr_player.enable_physics();
};

JL.webgl.environments.game.mini_games.bowling.next_turn = function(){
	var self = this;

	var knocked_down_pins = this.num_knocked_down_pins();

	var curr_frame = this.curr_player.frames[ this.curr_player.curr_frame ];

	curr_frame.values.push( knocked_down_pins );

	this.curr_player.score += ( this.curr_player.turn_bonuses.length + 1 ) * knocked_down_pins;

	this.curr_player.turn_bonuses = this.curr_player.turn_bonuses.map( b => b - 1 ).filter( b => b > 0 );

	switch( curr_frame.values.length ){
		case 1:
			if( curr_frame.values[ 0 ] == 10 ){
				curr_frame.values[ 0 ] = 'X';
				if( curr_frame.max_values != 3 ) this.curr_player.turn_bonuses.push( 2 );
				if( curr_frame.max_values == 2 ) curr_frame.max_values = 1;
			}
			break;
		case 2:
			if( curr_frame.values[ 0 ] + curr_frame.values[ 1 ] == 10 ){
				curr_frame.values[ 1 ] = '/';
				if( curr_frame.max_values != 3 ) this.curr_player.turn_bonuses.push( 1 );
			}
			else if( curr_frame.values[ 1 ] == 10 ){
				curr_frame.values[ 1 ] = 'X';
				if( curr_frame.max_values != 3 ) this.curr_player.turn_bonuses.push( 2 );
			}
			else if( curr_frame.values[ 0 ] != 'X' ){
				curr_frame.max_values = 2;
			}
			break;
		case 3:
			if( curr_frame.values[ 1 ] + curr_frame.values[ 2 ] == 10 ){
				curr_frame.values[ 2 ] = '/';
			}
			else if( curr_frame.values[ 2 ] == 10 ){
				curr_frame.values[ 2 ] = 'X';
			}
			break;
	};

	var go_to_next_player = ( curr_frame.values.length >= curr_frame.max_values );

	var only_clear_fallen_pins = !go_to_next_player && ( [ 'X', '/' ].indexOf( curr_frame.values[ curr_frame.values.length - 1  ] ) == -1 );

	this.remove_balls();

	this.reset_pins( this.main_lane, only_clear_fallen_pins );

	if( go_to_next_player ){
		this.curr_player.curr_frame++;
		if( this.curr_player.curr_frame >= this.curr_player.frames.length ) this.curr_player.finished = true;

		if( this.players.every( player => player.finished ) ){
			var user_won = this.get_leader().user;

			this.curr_player.ui_info.game.finish.title = ( user_won ? 'VICTORY' : 'DEFEAT' );

			this.curr_player.select();

			this.game.trigger_game_over();

			return;
		}
		else{
			this.next_player();
		}
	}

	this.curr_player.select();

	this.align_all_players();

	this.curr_player.ui_draw();

	if( !this.curr_player.user ){
		setTimeout(function(){
			self.curr_player.throw_ball(
				JL.functions.random_number( self.computer_min_power   , 100 ),
				JL.functions.random_number( self.computer_min_accuracy, 1   )
			);
		}, 1000);  // Need timeout here -- otherwise computer isn't rotated correctly when enabling physics. Also, adds a more natural delay for the computer to throw the ball.
	}
};
