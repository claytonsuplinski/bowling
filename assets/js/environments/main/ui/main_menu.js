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

JL.webgl.ui.item.main_menu.draw = function(){
	var self = this;

	// $( '.ui-main-menu .settings' ).html(
	// 	this.ui_info.map(function( option ){
	// 		return '<div class="option" onclick="' + option.onclick + '">' +
	// 			option.name +
	// 		'</div>';
	// 	}).join('')
	// );
};

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

	_this.draw();

	new JL.json_edit({
		parent    : { id : '#main-menu-settings' },
		on_change : function( obj, path, val ){
			console.log( obj, path, val );
		},
		value : this.environment.settings,
		structure : [
			{ key : 'num_pins', label : 'Number of Pins', type : 'int', default : 10, min : 0, max : 1000 },
			{ key : 'num_cpus', label : 'CPUs'          , type : 'int', default :  0, min : 0, max :   10 },

			// { key : 'name'               , type : 'str'      , },
			// { key : 'x'                  , type : 'float'    , default : 0, ui_row : '0_pos' },
			// { key : 'y'                  , type : 'float'    , default : 0, ui_row : '0_pos' },
			// { key : 'z'                  , type : 'float'    , default : 0, ui_row : '0_pos' },
			// { key : 'auto_update'        , type : 'bool'     , },
			// { key : 'tile_num_segments'  , type : 'int'      , default : 128 },
			// { key : 'display_type'       , type : 'dropdown' , default : 'radial', options : [ 'radial', 'nearest' ] },
			// { key : 'heightmaps'         , type : 'str'      , },
			// { key : 'arr_of_objs'        , type : 'arr'      , entries_collapsed : 1, 
			// 	structure : [
			// 		{ key : 'x'  , type : 'float', default : 0   },
			// 		{ key : 'y'  , type : 'bool' , show_while_collapsed : true, },
			// 		{ key : 'abc', type : 'str'  , default : 'test', autocomplete : [ 'abc', 'bcd', 'cde', 'def', ] },
			// 		{ key : 'def', type : 'arr'  , 
			// 			structure : [
			// 				{ key : 'x', type : 'float', default : 123 },
			// 			]
			// 		},
			// 	]
			// },
			// { key : 'arr_of_vals', type : 'arr',
			// 	structure : { type : 'float', default : 123 },
			// },
			// { key : 'arr_of_arrs', type : 'arr', 
			// 	structure : { type : 'arr', length : 3, 
			// 		structure : { type : 'int', default : 4 },
			// 	},
			// },
			// { key : 'custom_field', type : 'custom', ui_row : '0_obj', 
			// 	get_default    : function(){
			// 		return {
			// 			type   : 'cube',
			// 			label  : [ 'default_item' ],
			// 			params : {
			// 				x : 0.001,
			// 				y : 0.001,
			// 				z : 0.001,
			// 			},
			// 		};
			// 	},
			// 	get_value_name : function( v ){ return ( v.label || v.keys ).join('/'); },
			// 	edit_value     : function( path, value ){ edit_val( path, value ); },
			// },
		],
	});
};
