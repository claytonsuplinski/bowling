JL.webgl.init({
	attr : {
		variables : {
			default_background   : '_default',
			default_key_bindings : [ 'mouse', 'reset' ],
		},
	},
	controllers : {},
	hashlinks   : {},
	keyboard    : {
		bindings : {
			power_gauge : [
				{ name : "ENTER", controllers : { ps4 : 'X' }, down : function(){ JL.webgl.ui.item.power_gauge.on_user_input(); } },
			],
		},
	},
	mouse       : {},
	environment : {
		custom_functions : {
			on_load : function(){
				try{ JL.webgl.device.options.vr.loading_background.hide(); } catch(e){}
			},
			pre_instantiate : function(){
				this.on_pause = function(){
					JL.webgl.ui.key_bindings.disable();
					if( JL.webgl.ui.mouse ) JL.webgl.ui.mouse.disable();
				};

				this.on_resume = function(){
					JL.webgl.ui.key_bindings.enable();
					if( JL.webgl.ui.mouse ) JL.webgl.ui.mouse.enable();
				};
			},
		}
	},
	load : {
		custom_functions : {
			assets_on_start : function( p ){
				try{ JL.webgl.device.options.vr.loading_background.show(); } catch(e){}
				JL.webgl.ui.intermediate_loading.show();
				p.callback();
			},
			assets_on_finish : function(){
				JL.webgl.ui.intermediate_loading.hide();
			},
		},
	},
});
