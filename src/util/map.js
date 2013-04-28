Map = function(coordinates, zoom){
	var ELEMENT_ID = 'map';
	var DEFAULT_ZOOM = 9;
	var markers = [];
	
	var map = L.map(ELEMENT_ID).setView([coordinates.lat, coordinates.lon], zoom?zoom:DEFAULT_ZOOM);	
	L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
	}).addTo(map);
	
	this.addMarker = function(coordinates, infoBulle){
		var marker = L.marker([coordinates.lat, coordinates.lon]).addTo(map);
		markers.push(marker);
		if(infoBulle){
			var content = '';
			if(infoBulle.title){
				content+= '<h3>'+infoBulle.title+'</h3>';
			}
			if(infoBulle.description){
				content+= '<p>'+infoBulle.description+'</p>';
			}
			if(infoBulle.link){
				content+= '<a href="'+infoBulle.link+'" class="btn btn-block"><i class="icon-globe"></i></a>';
			}
			marker.bindPopup(content);
		}
	};
	
	this.addCircle = function(coordinates){
		L.circle([coordinates.lat, coordinates.lon], 5000, {
			color: 'red',
			fillColor: '#f03',
			fillOpacity: 0.2
		}).addTo(map);
	};
	
	this.getLayerBounds = function(){
		var bounds = map.getBounds();
		return [
			{
				lat : bounds.getNorthWest().lat,
				lon : bounds.getNorthWest().lng
			},
			{
				lat : bounds.getSouthEast().lat,
				lon : bounds.getSouthEast().lng
			}
		];
	};
	
	this.onLayerChange = function(callback){
		var mapClass = this;
		var trigger = function(e){
			callback(mapClass.getLayerBounds());
		}
		map.on("zoomend", function (e) {
			trigger(e);
		});
		map.on("moveend", function (e) {
			trigger(e);
		});
	};
	
	this.removeAllMarkers = function(){
		for(var i in markers){
			map.removeLayer(markers[i]);
		}
	}
	
};