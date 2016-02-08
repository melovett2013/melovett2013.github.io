// The map visualization
MapVis = function(_parentElement, _data, _eventdata, _latitude, _longitude, _total) {
   	this.parentElement = _parentElement;
    this.displayData = _data;
    this.eventData = _eventdata;
    console.log(this.eventData);
    this.total = _total;

    // Create the map
    L.mapbox.accessToken = 'pk.eyJ1IjoiY2l0eWN5Y2xlIiwiYSI6IjZ3MXNtRW8ifQ.lmAxO5RTphn4Jo-QV63Vpg';
    this.layer = L.mapbox.tileLayer('citycycle.lnkh0jpk');
    this.map = L.map("map")
      .addLayer(this.layer)
      .setView([_latitude, _longitude], 11);
    this.svg = d3.select(this.map.getPanes().overlayPane).append("svg");
    this.g = this.svg.append("g").attr("class", "leaflet-zoom-hide");

    this.initVis();
}

MapVis.prototype.initVis = function() {
    // Create the red circles, sized relative to number of members from that area
    var that = this;
    this.displayData.forEach( function(d) {
        var circle = L.circle([d["latitude"], d["longitude"]], d["count"] * 20 + 200, {
            stroke:false,
            weight: 3,
            color: "#f03",
            fillColor: "#f03",
            opacity: .6,
            fillOpacity: .6
        }).addTo(that.map);
        circle.bindPopup("<p><center><b><font size=2>"+ d["city"] +"</font></b><br> Member Count: " 
            + d["count"] +"</center></p>");});

    // Create the blue circles, sized relative to number of rsvps from event
    this.eventData.forEach( function(d) {
        var circle = L.circle([d["latitude"], d["longitude"]], d["count"] * 20 + 200, {
            stroke:false,
            weight: 3,
            color: "#3987cb",
            fillColor: "#3987cb",
            opacity: .6,
            fillOpacity: .6
        }).addTo(that.map);
        circle.bindPopup("<p><center><b><font size=2><a href=" + d["url"] + " target=_blank>" + d["name"] +"</a></font></b><br>" 
            + d["address"] + "<br> " + (d["time"].getMonth() + 1) + "/" + d["time"].getDate() 
            + "/" + d["time"].getFullYear() + "<br> Rsved Yes: "+ d["count"] +"</center></p>");});
}