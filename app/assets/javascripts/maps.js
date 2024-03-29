(function() {

  function initialize() {
    var mapOptions = {
      center: { lat: 39.5, lng: -98},
      zoom: 4,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    map.layers = [];
  }
  google.maps.event.addDomListener(window, 'load', initialize);

})();

var zipSearch = (function() {
    var clearMap = function() {
        map.layers.forEach(function(item) {
            item.setMap(null);
        });
        map.layers = [];
    };

    var clearSearch = function() {
        $('#start-address').val('');
        $('#end-address').val('');
    };

    var bindEventListeners = function() {
        $('#search').submit(search);
    };

    var search = function(e) {
        e.preventDefault();
        clearMap();
        disableForm();
        $.ajax({
            url: 'maps/search',
            method: 'POST',
            data: $('#search').serialize(),
            dataType: 'json'
        })
        .done(drawResults)
        .error(function(response){
          console.log(response);
          toastr.error("No results found", "Error");
          enableForm();
        });
    };

    var disableForm = function() {
        $('#search-btn').attr('disabled', 'disabled').hide();
        $('.spinner').css('display', 'block');
    };

    var enableForm = function() {
        $('#search-btn').removeAttr('disabled').show();
        $('.spinner').hide();
    };

    var drawResults = function(data) {
        clearSearch();
        enableForm();
        addMarker(data.start_point);
        addMarker(data.end_point);
        addLine(data.start_point, data.end_point);
        addZips(data.zips);
    };

    var addMarker = function(point) {
        var latLng = new google.maps.LatLng(point.coordinates[1], point.coordinates[0]);

        var marker = new google.maps.Marker({
          position: latLng,
          map: map
        });

        map.layers.push(marker);
    };

    var addLine = function(start, end) {
        var coords = [
            new google.maps.LatLng(start.coordinates[1], start.coordinates[0]),
            new google.maps.LatLng(end.coordinates[1], end.coordinates[0]),
        ];

        var path = new google.maps.Polyline({
            path: coords,
            geodesic: false,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
          });

        path.setMap(map);
        map.layers.push(path);

        var bounds = new google.maps.LatLngBounds;
        bounds.extend(coords[0]);
        bounds.extend(coords[1]);
        map.panTo(bounds.getCenter());
        map.fitBounds(bounds);
    };

    var addZips = function(zips) {
        var zipPoly;
        var paths;

        zips.forEach(function(zip) {
            paths = getPath(zip.geometry.coordinates);
            zipPoly = new google.maps.Polygon({
                paths: paths,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35
              });
            zipPoly.setMap(map);
            map.layers.push(zipPoly);

        });
    };

    // Flatten multipoly into an array of Google Maps LatLon objects
    var getPath = function(coordinates) {
        return _.map(coordinates, function(entry) {
            return _.reduce(entry, function(list, polygon) {
                _.each(_.map(polygon, function(point) {
                    return new google.maps.LatLng(point[1], point[0]);
                }), function(point) {
                    list.push(point);
                });

                return list;
            }, []);
        });
    };



    var initialize = function() {
        bindEventListeners();
    };

    return {
        initialize: initialize
    };
})();

$(document).ready(function() {
    zipSearch.initialize();
    toastr.options = {
      "closeButton": false,
      "debug": false,
      "positionClass": "toast-top-left",
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };
});