Auth = function(){
	
	var scope = this;
		
	this.init = function(){
		
		//Facebook
		
		(function(d, s, id){
		     var js, fjs = d.getElementsByTagName(s)[0];
		     if (d.getElementById(id)) {return;}
		     js = d.createElement(s); js.id = id;
		     js.src = "//connect.facebook.net/fr_FR/all.js";
		     fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
		
		window.fbAsyncInit = function() {
			FB.init({
		        appId  : '463627307038698',
		        channelUrl : 'http://my-skate-spots.com',
		        status : true,
		        cookie : true,
		        xfbml  : true
		    });
			var facebookInformation = function(){
				FB.api('/me', function(resp) {
					var user = {
						id : resp.id,
						name : resp.name,
						email : resp.email,
						avatar : 'http://graph.facebook.com/' + resp.id + '/picture'
					}
					scope.onAuthCallback(user);
				});
			};
						
			FB.getLoginStatus(function(response) {
				if (response.status === 'connected') {
			    	facebookInformation();
				} else if (response.status === 'not_authorized') {

				} else {

				}
			});
			
			FB.Event.subscribe('auth.login', function(response) {
				facebookInformation();
		    });
		};
		
		//Google
		
		(function() {
		       var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
		       po.src = 'https://apis.google.com/js/client:plusone.js?onload=render';
		       var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
	     })();
				
		render = function() {
			gapi.signin.render('googleSigninButton', {
			  callback: 'signinCallback',
			  clientid: '631974897480.apps.googleusercontent.com',
			  cookiepolicy: 'single_host_origin',
			  requestvisibleactions: 'http://schemas.google.com/AddActivity',
			  scope: 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email'
			});
		}
				
		signinCallback = function (authResult) {
			if (authResult['access_token']) {
				gapi.auth.setToken(authResult);
				gapi.client.load('plus', 'v1', function() {
					gapi.client.plus.people.get( {'userId' : 'me'} ).execute(function(resp) {
						var user = {
							id : resp.id,
							name : resp.displayName,
							email : '',
							avatar : resp.image.url
						}
						gapi.client.load('oauth2', 'v2', function() {
							var request = gapi.client.oauth2.userinfo.get();
							request.execute(function(obj){
								user.email = obj['email'];
								document.getElementById('googleSigninButton').setAttribute('style', 'display: none');
								scope.onAuthCallback(user);
							});
				        });
					})
				});
			}else if(authResult['error']){
				console.log('User is not connected');
			}
		}
	};
	
}