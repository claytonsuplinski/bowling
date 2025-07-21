JL.webgl.load.init_class([ 'ui', 'item', 'finish' ], function(){
	var class_obj = function( p ){
		this.init( p ); 
	};

	class_obj.css = `
		.ui-game-finish{
			display:none;
			width:0%;
			position:fixed;
			bottom:15px;
			left:0;
			right:0;
			margin:auto;
			text-align:center;
			font-size:36px;
			color:rgba(255,255,255,0.95);
			padding:8px 0px;
			overflow:hidden;

			z-index:999;

			box-shadow:0 0 15px -1px rgba(0,0,0,0.9);

			background: rgba(19, 68, 122, 0.83);
			background: -webkit-linear-gradient( 90deg, rgba(19, 68, 122, 0.23), rgba(19, 68, 122, 0.9) 10vw, rgba(19, 68, 122, 0.9) 90vw, rgba(19, 68, 122, 0.23) );
			background:    -moz-linear-gradient( 90deg, rgba(19, 68, 122, 0.23), rgba(19, 68, 122, 0.9) 10vw, rgba(19, 68, 122, 0.9) 90vw, rgba(19, 68, 122, 0.23) );
			background:      -o-linear-gradient( 90deg, rgba(19, 68, 122, 0.23), rgba(19, 68, 122, 0.9) 10vw, rgba(19, 68, 122, 0.9) 90vw, rgba(19, 68, 122, 0.23) );
			background:         linear-gradient( 90deg, rgba(19, 68, 122, 0.23), rgba(19, 68, 122, 0.9) 10vw, rgba(19, 68, 122, 0.9) 90vw, rgba(19, 68, 122, 0.23) );
		}

		.ui-game-finish .caption{
			opacity:0;
			white-space:nowrap;
			color:#DCECFE;
			font-weight:400;
			padding:5px;

			text-shadow:1px 1px 1px rgba(0, 0, 0, 0.5);
		}

		.ui-game-finish hr{
			margin:0 auto;
			width:300px;
			border-color:rgba(255,255,255,0.25);
		}
	`;

	class_obj.show = function(){
		var self = this;

		var id = '.ui-game-finish';

		$( id ).show( 'fade', function(){
			$( id ).animate(
				{ width : '100%' },
				{
					duration : 1000,
					complete : function(){
						$( id + ' .caption' ).animate({ opacity : 1 }, { duration : 500 });
					}
				}
			);
		} );

		if( self.ui_info.callback ) setTimeout( function(){ self.ui_info.callback(); }, 3000 );
	};

	class_obj.close = function(){
		$( '.ui-game-finish' ).hide( 'fade' );
	};

	class_obj.update_title = function( val ){
		$( '.ui-game-finish .caption' ).html( val || class_obj.ui_info.finish.title );
	};

	class_obj.ui_framework = function(){
		class_obj.ui_info = this.ui_info.finish || {};

		return '<div class="ui-game ui-game-finish">' +
			'<div class="no-click-screen"></div>' +
			'<hr>' +
			'<div class="caption">' + ( class_obj.ui_info.title || '&nbsp;' ) + '</div>' +
			'<hr>' +
		'</div>';
	};

	return class_obj;
});
