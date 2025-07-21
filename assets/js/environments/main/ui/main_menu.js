JL.webgl.ui.item.main_menu = function( p ){
	this.init( p );
};

JL.webgl.ui.item.main_menu.css = `
	.ui-main-menu{
		position:fixed;
		top:0;
		left:0;
		width :100vw;
		height:100vh;
		background:linear-gradient( 90deg, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0.75) 40%, rgba(255,255,255, 0.3) 70%, rgba(255,255,255,0) 100% );
		overflow:auto;
	}

	.ui-main-menu .title{
		font-size:30px;
		background:#265d71;
		background:linear-gradient( -90deg, rgba(162, 211, 229, 0.11), #264a71 );
		border-bottom:1px solid rgba(0,0,0,0.25);
		width:100%;
		padding:20px;
		color:#fff;
		text-shadow: 1px  1px #003e55,
			    -1px  1px #003e55,
			     1px -1px #003e55,
			    -1px -1px #003e55;
	}

	.ui-main-menu .title img{
		height:43px;
		margin-right:4px;
		vertical-align:top;
	}

	.ui-main-menu .options{
		padding-bottom:25px;
	}

	.ui-main-menu .options .option{
		width:50vw;
		font-size:16px;
		cursor:pointer;
		background:linear-gradient( 90deg, rgba(237, 252, 255, 0.9), rgba(255, 255, 255, 0) );
		border:1px solid rgba(0,0,0,0.25);
		border-left:0;
		border-right:0;
		padding:15px 50px;
		margin:10px 0 0;
	}

	.ui-main-menu .options .option:hover{
		background:#fff;
	}

	#main-menu-settings{
		padding:10px;
		padding-bottom:0;
	}

	#main-menu-settings .jl-json-edit td.lbl{
		background:#34567a;
		width:150px;
		vertical-align:middle;
		padding:0 5px;
		font-size:14px;
	}

	#main-menu-settings .jl-json-edit input{
		padding:5px;
	}

	@media only screen and (max-width : 500px) {
		.ui-main-menu .title{
			font-size:20px;
			
		}

		.ui-main-menu .title img{
			height:28px;
		}

		.ui-main-menu .options .option{
			width:100vw;
		}
	}
`;

JL.webgl.ui.item.main_menu.ui_framework = function(){
	return `<div id="main-menu" class="ui-main-menu">
		<div class="title">
			<img src="./assets/textures/environments/main/antarctica.png" />
			Bowling
		</div>
		<div id="main-menu-settings">
		</div>
		<div class="options">
			<div class="option" onclick="JL.webgl.functions.load_and_select_environment({ keys : [ \'main\', \'zone_game\' ] });">Start Game</div>
		</div>
	</div>`;
};

JL.webgl.ui.item.main_menu.ui_onselect = function(){
	var _this = JL.webgl.ui.item.main_menu;

	_this.target = this;

	// var ui_info = _this.ui_info = this.ui_info.main_menu;

	if( !JL.webgl.variables.bowling ) JL.webgl.variables.bowling = {};

	_this.json_edit = new JL.json_edit({
		parent    : { id : '#main-menu-settings' },
		value     : JL.webgl.variables.bowling,
		structure : [
			{ key : 'lane', label : 'Lane', type : 'dropdown', options : [
				{ name : 'Standard', value : 'standard', },
			] },
			{ key : 'num_pins', label : 'Number of Pins', type : 'int', default : 10, min : 0, max : 1000 },
			{ key : 'num_cpus', label : 'CPUs'          , type : 'int', default :  0, min : 0, max :   10 },
		],
	});
};
