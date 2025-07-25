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
	mouse       : {
		events : {
			touch_start_1 : [{ fn : function( e, touch ){
				if( !JL.webgl.variables.throw_curr ){
					if( JL.webgl.active_camera.target.is_user ){
						JL.webgl.variables.throw_curr = { x : touch.screenX, y : touch.screenY, t : ( new Date() ).getTime() };
					}
				}
			}, }],
			touch_move_1 : [{ fn : function( e, touch ){
				if( JL.webgl.variables.throw_curr ){
					JL.webgl.variables.throw_prev = JL.webgl.variables.throw_curr;
					JL.webgl.variables.throw_curr = { x : touch.screenX, y : touch.screenY, t : ( new Date() ).getTime() };
				}
			}, }],
			touch_end : [{ fn : function( e ){
				if( JL.webgl.variables.throw_prev ){
					var prev = JL.webgl.variables.throw_prev;
					var curr = JL.webgl.variables.throw_curr;

					var y_delta = prev.y - curr.y;

					if( y_delta > 2 ){
						var t_factor = 1 - ( 0.05 * ( JL.functions.clamp( curr.t - prev.t, 5, 25 ) - 5 ) / 20 );

						var power = Math.min( ( JL.functions.clamp( y_delta, 0, 20 ) / 15 ) * t_factor, 1 );

						if( power > 0.4 ){
							if( JL.webgl.active_camera.target.is_user ){
								JL.webgl.active_camera.target.throw_ball({ power,
									force_x : prev.x - curr.x,
								});
							}
						}
					}

					delete JL.webgl.variables.throw_prev;
					delete JL.webgl.variables.throw_curr;
				}
			}, }],
		},
	},
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
