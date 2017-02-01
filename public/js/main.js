
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
/*
For Each loops populate select elements with options from global dummy data
*/
hotels.forEach(function(hotel) {
  $('#hotel-choices').append(createOptionEle(hotel.id, hotel.name));
});

restaurants.forEach(function(restaurant) {
  $('#restaurant-choices').append(createOptionEle(restaurant.id, restaurant.name));
});

activities.forEach(function(activity) {
  $('#activity-choices').append(createOptionEle(activity.id, activity.name));
});

$('#hotel-add').on('click', function(event){
  addSelectedItinerary('hotel');

})

$('#restaurant-add').on('click', function(event){
  addSelectedItinerary('restaurant');
})

$('#activity-add').on('click', function(event){
  addSelectedItinerary('activity');
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

function addToItinerary(){

}


//takes id and string of hotel then returns option HTML string
function createOptionEle(id, string){
  return '<option value="' + id + '">' + string + '</option>';
}

//takes type of itinerary and returns div HTML for added itinerary
function createItineraryHTML(name){
  return '<div class="itinerary-item"> <span class="title">' + name + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
}

//calling this function takes 'hotel' 'restaurant' or 'activity' for argument
//adds HTML for itinerary and calls drawMarker()
function addSelectedItinerary(type){

  let itineraryId = $('select#' + type +'-choices option:checked').val();
  var index;
  var itinerary;
  var itineraryName;
  var itineraryHTML;
  var location;

  //switch statement assigns itinerary to proper corresponding global variable
  switch(type){
    case "restaurant":
      itinerary = restaurants;
      break;
    case "hotel":
      itinerary = hotels;
      break;
    case "activity":
      itinerary = activities;
  }

  //Loop finds correct index for itinerary
  itinerary.forEach(function(place, i){
    if(place["id"] == itineraryId) {
      index = i;
    }
  })

  //creates HTML for button and appends to list
  itineraryName = itinerary[index].name;
  itineraryHTML = createItineraryHTML(itineraryName);
  $('#'+ type +'-list').append(itineraryHTML);

  //creates necessary fields for marker and calls drawMarker()
  location = itinerary[index].place.location;
  drawMarker(type, location, itineraryName);
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
