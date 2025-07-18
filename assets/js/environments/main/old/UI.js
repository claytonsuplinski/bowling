JL.webgl.environments.game.mini_games.bowling.create_ui = function(){
	var self = this;

	this.menus = [
		{
			name   : 'start',
			params : {
				groups : [
					{
						name    : 'Computer Difficulty',
						options : [
							{ name : 'Easy'   , onclick : self.string_this + '.set_computer_difficulty( \'Easy\'   );' },
							{ name : 'Medium' , onclick : self.string_this + '.set_computer_difficulty( \'Medium\' );' },
							{ name : 'Hard'   , onclick : self.string_this + '.set_computer_difficulty( \'Hard\'   );' },
						],
					},
					{
						name    : 'Number of Computers',
						options : [
							{ name : '1' , onclick : self.string_this + '.set_num_computers( 1 );' },
							{ name : '2' , onclick : self.string_this + '.set_num_computers( 2 );' },
							{ name : '3' , onclick : self.string_this + '.set_num_computers( 3 );' },
						],
					},
				],
				init : function(){
					self.set_computer_difficulty( 'Easy' );
					self.set_num_computers( 1 );
				},
				on_begin : [
					self.string_this + '.ui.menus.start.close();',
					self.string_this + '.initialize();',
				].join(''),
			}
		},
		{
			name   : 'pause',
			params : {
				options : [
					{ name : 'Resume Game', onclick : self.string_this + '.ui.menus.pause.close();' },
					{ name : 'Controls'   , onclick : self.string_this + '.ui.menus.controls.draw({ prev : \'pause\' });' },
					{ name : 'New Game'   , onclick : self.string_this + '.reset();' },
				]
			}
		},
		{
			name   : 'controls',
			params : {
				controls : [
					{ label : 'W'    , description : 'Move the player forward.'  },
					{ label : 'A'    , description : 'Turn the player left.'     },
					{ label : 'S'    , description : 'Move the player backward.' },
					{ label : 'D'    , description : 'Turn the player right.'    },
					{ label : 'ENTER', description : 'Start / stop power gauge.' },
				],
				options : [
					{ name : 'Back', onclick : self.string_this + '.ui.menus.controls.back();' }
				]
			}
		},
		{
			name   : 'end',
			params : {
				options : [
					{ name : 'New Game' , onclick : self.string_this + '.ui.menus.end.close();' + self.string_this + '.reset();' },
					{ name : 'Exit'     , onclick : self.string_this + '.ui.menus.end.close();' },
				]
			}
		},
	];

	this.interfaces = [
	];
};

JL.webgl.environments.game.mini_games.bowling.set_computer_difficulty = function( val ){
	switch( val ){
                case 'Easy'   :
			this.computer_min_power    = 70;
			this.computer_min_accuracy = 0.25;
			break;
                case 'Medium' :
			this.computer_min_power    = 75;
			this.computer_min_accuracy = 0.5;
			break;
                case 'Hard'   :
			this.computer_min_power    = 80;
			this.computer_min_accuracy = 0.7;
			break;
                default       : return;
	}

	this.ui.menus.start.set_group_value( 'Computer Difficulty', val );
};

JL.webgl.environments.game.mini_games.bowling.set_num_computers = function( val ){
	this.num_computers = val;

	this.ui.menus.start.set_group_value( 'Number of Computers', val );
};
