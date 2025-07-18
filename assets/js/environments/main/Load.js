Object.assign( JL.webgl.load.groups, {
	"Main Zone": {
		steps : [
			{
				init : function(callback){
					JL.webgl.load.graphics_objects_list( this, [
						{
							label  : [ 'environments', 'main', 'antarctica' ],
							type   : "extruded_png",
							params : {
								image     : './assets/textures/environments/main/antarctica.png',
								depth     : 0.1,
								back_face : true,
							}
						},
					]);
					callback();
				}
			},
		],
		scripts : [
			"./assets/js/environments/main/ui/main_menu.js",
		]
	},
} );
