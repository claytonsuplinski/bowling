JL.webgl.load.init_class([ 'ui', 'item', 'scoreboard' ], function(){
	var class_obj = function( p ){
		this.init( p );
	};

	class_obj.css = `
		.ui-scoreboard{
			position:fixed;
			margin:auto;
			right:auto;
			top :5px;
			left:5px;
			text-align:center;
			background:rgba(19, 95, 185, 0.8);
			color:#fff;
			max-width:calc( 100% - 1vw - 40px );
			padding:0 3px;
		}

		.ui-scoreboard *{
			font-size:14px;
			color:#fff;
		}

		.ui-scoreboard table.players{
			border-collapse:collapse;
			border-spacing:0;
		}

		.ui-scoreboard .player > td{
			border:1px solid #91c0ff;
		}

		.ui-scoreboard .player > td:not(:nth-child(1)){
			border-left:0;
		}

		.ui-scoreboard .player .name{
			background:rgba(0,0,0,0.2);
			width:60px;
			border-right:1px solid #91c0ff;
			padding:0 5px;
		}

		.ui-scoreboard .player.active .name{
			-webkit-animation:scoreboard-active-player 1.5s infinite;
			   -moz-animation:scoreboard-active-player 1.5s infinite;
				animation:scoreboard-active-player 1.5s infinite;
		}

		@-webkit-keyframes scoreboard-active-player{
			  0% { background:rgb(25,  65, 113); }
			 50% { background:rgb(51, 144, 255); }
			100% { background:rgb(25,  65, 113); }
		}

		@keyframes scoreboard-active-player{
			  0% { background:rgb(25,  65, 113); }
			 50% { background:rgb(51, 144, 255); }
			100% { background:rgb(25,  65, 113); }
		}

		.ui-scoreboard .player .frames.collapsed{
			display:none;
		}

		.ui-scoreboard .player .score{
			background:rgba(224, 238, 255, 0.32);
			width:45px;
			text-align:right;
			padding:0 5px;
		}

		.ui-scoreboard .player .time{
			width:70px;
		}

		.ui-scoreboard.bowling .player .frames td.frame{
			border:1px solid rgba(0,0,0,0.3);
			background:rgba(255, 255, 255, 0.1);
		}

		.ui-scoreboard.bowling .player .frames td.frame .values{
			width:40px;
		}

		.ui-scoreboard.bowling .player .frames td.frame .values td{
			padding:1px;
			font-size:12px;
			text-align:center;
		}

		.ui-scoreboard .collapse-toggle{
			position:absolute;
			left:calc( 100% + 1px );
			top:0;
			background:#18428f;
			padding:2px 5px;
			font-size:10px;
			border:1px solid #809dc4;
			color:rgba(255,255,255,0.9);
			cursor:pointer;
		}

		.ui-scoreboard .collapse-toggle:hover{
			background:#3b61a6;
		}
	`;

	class_obj.toggle_collapse = function(){
		this.collapsed = !this.collapsed;
		$( '.ui-scoreboard .players .frames' )[ ( this.collapsed ? 'add' : 'remove' ) + 'Class' ]( 'collapsed' );
		$( '.ui-scoreboard .collapse-toggle' ).html( this.collapsed ? 'Expand' : 'Collapse' );
	};

	class_obj.ui_framework = function(){
		return '<div class="ui-game ui-scoreboard bowling"></div>';
	};

	class_obj.ui_draw = function(){
		var ui_info = this.ui_info || {};

		var _this = JL.webgl.ui.item.scoreboard;

		if( _this.collapsed === undefined ) _this.collapsed = true;

		$( '.ui-scoreboard.bowling' ).html(
			'<table class="players">' + 
				ui_info._game.players.map(function( player, idx ){
					return '<tr class="player ' + ( ui_info._game.curr_player_idx == idx ? 'active' : '' ) + '">' + 
						'<td class="name" >' + player.name  + '</td>' +
						( !player.frames ? '' :
							'<td class="frames ' + ( _this.collapsed ? 'collapsed' : '' ) + '">' +
								'<table><tr>' +
									player.frames.map(function( frame ){
										var html = '<td class="frame">';
											html += '<table class="values"><tr>';
											for( var i = 0; i < frame.max_values; i++ ){
												html += '<td>';
												try{ html += ( frame.values[ i ] !== undefined ? frame.values[ i ] : '-' ); } catch(e){}
												html += '</td>';
											}
											html += '</tr></table>';
										html += '</td>';
										return html;
									}).join('') +
								'</tr></table>' +
							'</td>'
						) +
						'<td class="score">' + player.score + '</td>' +
					'</tr>';
				}).join('') +
			'</table>' +
			'<div class="collapse-toggle no-highlight" onclick="JL.webgl.ui.item.scoreboard.toggle_collapse();">' + 
				( _this.collapsed ? 'Expand' : 'Collapse' ) + 
			'</div>'
		);
	};

	class_obj.ui_onselect = function(){
		this.ui_draw();
	};

	return class_obj;
});
