
var currentMap;
var day = {};
var currentDay = 1;

$(function initializeMap (){

  var fullstackAcademy = new google.maps.LatLng(40.705086, -74.009151);

  var styleArr = [{
    featureType: 'landscape',
    stylers: [{ saturation: -100 }, { lightness: 60 }]
  }, {
    featureType: 'road.local',
    stylers: [{ saturation: -100 }, { lightness: 40 }, { visibility: 'on' }]
  }, {
    featureType: 'transit',
    stylers: [{ saturation: -100 }, { visibility: 'simplified' }]
  }, {
    featureType: 'administrative.province',
    stylers: [{ visibility: 'off' }]
  }, {
    featureType: 'water',
    stylers: [{ visibility: 'on' }, { lightness: 30 }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ef8c25' }, { lightness: 40 }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ visibility: 'off' }]
  }, {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{ color: '#b6c54c' }, { lightness: 40 }, { saturation: -40 }]
  }];

  var mapCanvas = document.getElementById('map-canvas');

   currentMap = new google.maps.Map(mapCanvas, {
    center: fullstackAcademy,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: styleArr
  });





  // drawMarker('hotel', [40.705137, -74.007624]);
  // drawMarker('restaurant', [40.705137, -74.013940]);
  // drawMarker('activity', [40.716291, -73.995315]);

});

hotels.forEach(function(hotel) {
  let optionNode = '<option value="' + hotel.id + '">' + hotel.name + '</option>'
  $('#hotel-choices').append(optionNode);
});

restaurants.forEach(function(restaurant) {
  let optionNode = '<option value="' + restaurant.id + '">' + restaurant.name + '</option>'
  $('#restaurant-choices').append(optionNode);
});

activities.forEach(function(activity) {
  let optionNode = '<option value="' + activity.id + '">' + activity.name + '</option>'
  $('#activity-choices').append(optionNode);
});

$('#hotel-add').on('click', function(event){
  let hotelId = $('select#hotel-choices option:selected').val();
  var index;
  hotels.forEach(function(hotel, i){
    if(hotel["id"] == hotelId) index = i;
  })
   let hotel = hotels[index].name

  let hoteldiv = '<div class="itinerary-item"> <span class="title">' + hotel + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>'
  $('#hotel-list').append(hoteldiv);
  let pos = hotels[index].place.location;
  drawMarker('hotel', pos, hotel);



})

$('#restaurant-add').on('click', function(event){

  let resId = $('select#restaurant-choices option:checked').val();
  var index;
  restaurants.forEach(function(restaurant, i){
    if(restaurant["id"] == resId) index = i;
  })
  let restaurant = restaurants[index].name
  let restaurantdiv = '<div class="itinerary-item"> <span class="title">' + restaurant + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>'
  $('#restaurant-list').append(restaurantdiv);
  drawMarker('restaurant', restaurants[index].place.location, restaurant)
})

$('#activity-add').on('click', function(event){

  let actId = $('select#activity-choices option:checked').val();
  var index;
  activities.forEach(function(activity, i){
    if(activity["id"] == actId) index = i;
  })
  let activity = activities[index].name;
  let activitydiv = '<div class="itinerary-item"> <span class="title">' + activity + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>'
  $('#activity-list').append(activitydiv);
  drawMarker('activity', activities[index].place.location, activity)
})

$('#itinerary').on('click', function(event){
  //console.log(event.target);
  if($(event.target).hasClass('btn')){
    console.log($(event.target).prev().text())
    $('#itinerary').data($(event.target).prev().text()).setMap(null);
    $(event.target).closest('div').remove();
  }
})

$('#day-add').on('click', function(event) {
  let nextDay = '' + $('.day-btn').length;
  console.log(nextDay)
  let dayBtn = '<button class="btn btn-circle day-btn">' + nextDay + '</button>'
  $(dayBtn).insertBefore('#day-add');
})

$('.day-buttons').on('click', function(event){
  if(!$(event.target).is('#day-add')){
  let newDay = $(event.target).text();
  console.log(newDay);
}
})

var iconURLs = {
    hotel: '/images/lodging_0star.png',
    restaurant: '/images/restaurant.png',
    activity: '/images/star-3.png'
  };

 function drawMarker (type, coords, name) {
    var latLng = new google.maps.LatLng(coords[0], coords[1]);
    var iconURL = iconURLs[type];
    var marker = new google.maps.Marker({
      icon: iconURL,
      position: latLng
    });
    $('#itinerary').data(name, marker)
    marker.setMap(currentMap);
  }


/*
Day object
{
  currentDay : bool
  hotels: [],
  restaurants: [],
  activities: [],
  markers: {
  name: marker
  }
}

populate html from object
-remove current-day class

-remove all children from hotel-list
-remove all children from restaurant-list
- " activity list
-set all markers for prev day to null
-change index to current day
-add current-day class to clicked day
-add items and markers to itinerary panel
*/
