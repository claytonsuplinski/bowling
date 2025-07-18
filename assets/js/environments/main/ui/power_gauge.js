JL.webgl.load.init_class([ 'ui', 'item', 'power_gauge' ], function(){
	var class_obj = function( p ){
		var p = p || {};

		this.init( p ); 
	};

	class_obj.key_bindings = [ 'power_gauge' ];

	class_obj.css = `
		.ui-power-gauge{
			position:fixed;
			margin:auto;
			left:0;
			right:0;
			text-align:center;
			width:35vw;
			bottom:2.25vw;
		}

		.ui-power-gauge .tick-marks,
		.ui-power-gauge .sub-bars,
		.ui-power-gauge .power-bar{
			width:calc( 100% - 35px );
			margin:auto;
		}

		.ui-power-gauge .tick-marks{
			position:relative;
			text-align:left;
			color:#fff;
			height:1.4vw;
			line-height:1.4;
			width:100%;

			text-shadow: 0.1vw  0.1vw 0.1vw #0F2A47,
				    -0.1vw  0.1vw 0.1vw #0F2A47,
				     0.1vw -0.1vw 0.1vw #0F2A47,
				    -0.1vw -0.1vw 0.1vw #0F2A47,
				     0.1vw  0     0.1vw #0F2A47,
				    -0.1vw  0     0.1vw #0F2A47,
				    -0.1vw  0     0.1vw #0F2A47,
				     0      0.1vw 0.1vw #0F2A47,
				     0     -0.1vw 0.1vw #0F2A47;
		}

		.ui-power-gauge .tick-marks.small{
			height:0;
		}

		.ui-power-gauge .tick-marks .tick{
			position:absolute;
			width:2vw;
			text-align:center;
			transform:translateX(-50%);
			z-index:1;
		}

		.ui-power-gauge .tick-marks.big .tick{
			padding-top:2.45vw;
		}

		.ui-power-gauge .tick-marks .tick:after{
			content:"";
			background:#6088B3;
			position:absolute;
			left  : 0;
			right : 0;
			margin:auto;
		}

		.ui-power-gauge .tick-marks.big .tick:after{
			width : 0.2vw;
			height: 0.5vw;
			top   : 0.7vw;
			background:#2B6199;

			box-shadow:-0.1vw -0.1vw 0 #39BBFF,
				    0.1vw -0.1vw 0 #39BBFF,
				    0.1vw  0     0 #39BBFF,
				   -0.1vw  0     0 #39BBFF,
				    0     -0.1vw 0 #39BBFF;
		}

		.ui-power-gauge .tick-marks.small .tick:after{
			width : 0.1vw;
			height: 0.4vw;
			bottom:-0.4vw;
			background:#0890DC;
		}

		.ui-power-gauge .power-bar-container{
			background:rgba(19, 95, 185, 0.8);
			padding:0.5vw;
			border-radius:2vw;
			border:0.12vw solid #87BFFF;
			box-shadow:0.1vw 0.1vw 0.5vw #000;
		}

		.ui-power-gauge .power-bar{
			position:relative;
			height:1.25vw;
			border-top   :0.1vw solid #00A8FF;
			border-bottom:0.1vw solid #39BBFF;

			background:#204977;
			background: -webkit-linear-gradient( 0deg, #3A689C, #153A65 );
			background:    -moz-linear-gradient( 0deg, #3A689C, #153A65 );
			background:      -o-linear-gradient( 0deg, #3A689C, #153A65 );
			background:         linear-gradient( 0deg, #3A689C, #153A65 );
		}

		.ui-power-gauge .power-bar .positive-bar{
			position:absolute;
			width:95%;
			height:100%;
			right:0;
		}

		.ui-power-gauge .power-bar .negative-bar{
			position:absolute;
			width:5%;
			height:100%;
			left:0;
		}

		.ui-power-gauge .power-bar .power-value,
		.ui-power-gauge .power-bar .curr-power{
			position:absolute;
			width:0%;
			height:65%;
			top:0;
			left:0;
			bottom:0;
			margin:auto;

			z-index:2;

			background:#76ECFF;
			background: -webkit-linear-gradient( 0deg, #A2F2FF, #75b8ff );
			background:    -moz-linear-gradient( 0deg, #A2F2FF, #75b8ff );
			background:      -o-linear-gradient( 0deg, #A2F2FF, #75b8ff );
			background:         linear-gradient( 0deg, #A2F2FF, #75b8ff );
		}

		.ui-power-gauge .power-bar .negative-bar .curr-power{
			right:0;
			margin-right:0;
		}

		.ui-power-gauge .power-bar .power-value{
			opacity:0.5;
			z-index:1;
		}

		.ui-power-gauge .sub-bars{
			position:relative;
			height:5px;
		}

		.ui-power-gauge .sub-bars .accuracy-section{
			width:10%;
			height:5px;
			position:absolute;
			border:1px solid rgba(255, 255, 255, 0.25);

			background:#fff;
			background: -webkit-linear-gradient( 90deg, #AA5353, #5BFF5B, #AA5353 );
			background:    -moz-linear-gradient( 90deg, #AA5353, #5BFF5B, #AA5353 );
			background:      -o-linear-gradient( 90deg, #AA5353, #5BFF5B, #AA5353 );
			background:         linear-gradient( 90deg, #AA5353, #5BFF5B, #AA5353 );
		}
	`;

	class_obj.start = function(){
		this.timestamp = new Date();

		this.power    = 0;
		this.accuracy = 0;

		this.draw_power_value();

		this.reversed = false;

		// TODO : Figure out why this doesn't seem to work quite right with the 'X' button on the PS4 controller.
		// 	-Things don't seem to be pausing when the 'X' button is used (probably causing things to seem laggier too).
		// 		-It does pause when the 'ENTER' key is used though.
		if( !this.no_pause ) JL.webgl.main.pause({ keyboard_exceptions : [ 'ENTER' ] });

		// TODO : See about including this in the per_frame_functions of the currently selected object.
		this.interval = setInterval( function(){
			class_obj.update();
		}, 16 );
	};

	class_obj.on_user_input = function(){
		if( this.interval == undefined ) this.start();
		else if( !this.power ) this.set_power();
		else{
			this.set_accuracy();
		}
	};

	class_obj.reverse = function(){
		this.reversed = !this.reversed;
	};

	class_obj.draw_power_value = function(){
		$( '.ui-power-gauge .power-value' ).width( this.power + '%' );
	};

	class_obj.set_power = function(){
		this.power = this.percent;

		this.draw_power_value();

		this.reversed = true;
	};

	class_obj.set_accuracy = function(){
		this.accuracy = Math.max( ( this.accuracy_radius - Math.abs( this.percent ) ) / this.accuracy_radius, 0 );

		this.stop();
	};

	class_obj.stop = function(){
		this.cancel();

		if( this.callback ) this.callback();
	};

	class_obj.cancel = function(){
		if( !this.no_pause ) JL.webgl.main.resume();

		clearInterval( this.interval );

		delete this.interval;

		this.percent = 0;
	};

	class_obj.set = function( percent ){
		if( percent >= 0 ){
			$( '.ui-power-gauge .positive-bar .curr-power' ).width( percent + '%' );
			$( '.ui-power-gauge .negative-bar .curr-power' ).width( '0%' );
		}
		else{
			$( '.ui-power-gauge .negative-bar .curr-power' ).width( ( -100 * percent / this.accuracy_radius ) + '%' );
			$( '.ui-power-gauge .positive-bar .curr-power' ).width( '0%' );
		}
	};

	class_obj.update = function(){
		var now = new Date();

		var percent_delta = ( now - this.timestamp ) / this.speed_reduction_factor;

		if( this.reversed ) this.percent -= percent_delta;
		else                     this.percent += percent_delta;

		if( this.percent > 100 ){
			this.percent = 100;
			this.reverse();
		}
		else if( this.percent <= 0 && this.power == 0 ){
			this.percent = 0;
			this.cancel();
		}
		else if( this.percent <= -this.accuracy_radius ){
			this.percent = -this.accuracy_radius;
			this.set_accuracy();
		}

		this.set( this.percent );

		this.timestamp = now;
	};

	class_obj.ui_framework = function(){
		var ui_info = this.ui_info.power_gauge || {};

		var small_ticks = [ 5, 10, 15, 20, 30, 35, 40, 45, 55, 60, 65, 70, 80, 85, 90, 95 ];
		var big_ticks   = [ 0, 25, 50, 75, 100 ];

		return '<div class="ui-game ui-power-gauge" onclick="' + ui_info.onclick + '">' + 
			'<div class="power-bar-container">' + 
				'<div class="power-bar">' + 
					'<div class="negative-bar">' + 
						'<div class="curr-power"></div>' + 
					'</div>' +
					'<div class="positive-bar">' + 
						'<div class="tick-marks small">' +
							small_ticks.map( x => '<div class="tick" style="left:' + x + '%;"></div>' ).join('') +
						'</div>' +
						'<div class="curr-power"></div>' + 
						'<div class="power-value"></div>' + 
						'<div class="tick-marks big">' +
							big_ticks.map( x => '<div class="tick" style="left:' + x + '%;">' + x + '%</div>' ).join('') +
						'</div>' +
					'</div>' +
				'</div>' + 
				'<div class="sub-bars">' +
					'<div class="accuracy-section"></div>' +
				'</div>' +
			'</div>' +
		'</div>';
	};

	class_obj.ui_onselect = function(){
		var ui_info = this.ui_info.power_gauge || {};

		try{ class_obj.callback = ui_info.callback; } catch(e){}

		class_obj.no_pause = ui_info.no_pause;

		class_obj.percent = 0;

		class_obj.accuracy_radius = 5;

		class_obj.speed_reduction_factor = 30 / ( ui_info.speed || 1 );

		$( '.ui-power-gauge' ).show( 'fade' );
	};

	return class_obj;
});
