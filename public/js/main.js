
var currentMap;
var days = [];
var currentDay = 0;
var bounds = new google.maps.LatLngBounds();

function updateMapBounds(day){
  bounds = new google.maps.LatLngBounds();
  //access markers array
  var markers = days[day].markers;
  for(marker in markers){
    bounds.extend(markers[marker].position);
  }

  currentMap.fitBounds(bounds);


};

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


   addDay();


  // drawMarker('hotel', [40.705137, -74.007624]);
  // drawMarker('restaurant', [40.705137, -74.013940]);
  // drawMarker('activity', [40.716291, -73.995315]);

});



var iconURLs = {
  hotel: '/images/lodging_0star.png',
  restaurant: '/images/restaurant.png',
  activity: '/images/star-3.png'
};

function addDay(){
  this.days.push(new Day());
}

function drawMarker (type, coords, name) {
  var latLng = new google.maps.LatLng(coords[0], coords[1]);
  var iconURL = iconURLs[type];
  var marker = new google.maps.Marker({
    icon: iconURL,
    position: latLng
  });
  days[currentDay].markers[name] = marker
  marker.setMap(currentMap);
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

  days[currentDay][type].push(itineraryName);

  //creates necessary fields for marker and calls drawMarker()
  location = itinerary[index].place.location;
  drawMarker(type, location, itineraryName);
}


function hidePreviousMarkers(prevDayIndex){
  var markers = days[prevDayIndex].markers;

  for( marker in markers){
    console.log("Im trying to hide a map");
    markers[marker].setMap(null);
  }
}

function showItineraries(dayIndex){
  days[dayIndex].hotel.forEach((hotel, i, arr) =>{
    $('#hotel-list').append(createItineraryHTML(hotel));
  });

  days[dayIndex].activity.forEach((activity, i, arr) =>{
    $('#activity-list').append(createItineraryHTML(activity));
  });

  days[dayIndex].restaurant.forEach((restaurant, i, arr) =>{
    $('#restaurant-list').append(createItineraryHTML(restaurant));
  });

}

function showSelectedMarkers(selectedDayIndex){
  var markers = days[selectedDayIndex].markers;
  console.log(markers);
  for( marker in markers){

    markers[marker].setMap(currentMap);
  }
}

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

//Wires up add buttons and adds selected Itinerary
$('#hotel-add').on('click', function(event){
  addSelectedItinerary('hotel');

})

$('#restaurant-add').on('click', function(event){
  addSelectedItinerary('restaurant');
})

$('#activity-add').on('click', function(event){
  addSelectedItinerary('activity');
})


//wires itinerary section to delete itinerary if btn is clicked
$('#itinerary').on('click', function(event){

  if($(event.target).hasClass('btn')){
    var name = $(event.target).prev().text();
    var type = $(event.target).closest('.list-group').attr('id').split('-')[0];
    var indexToRemove = days[currentDay][type].indexOf(name);
    days[currentDay][type].splice(indexToRemove, 1);
    days[currentDay].markers[name].setMap(null);
    delete days[currentDay].markers[name];
    $(event.target).closest('div').remove();
  }
})

//wires up button to add a day
$('#day-add').on('click', function(event) {
  let nextDay = '' + $('.day-btn').length;
  let dayBtn = '<button class="btn btn-circle day-btn">' + nextDay + '</button>'
  addDay();
  console.log(days);
  $(dayBtn).insertBefore('#day-add');
})


$('.day-buttons').on('click', function(event){ //click to switch day
  if(!$(event.target).is('#day-add') && $(event.target).is('.day-btn')){


    //selecting selectedDay and previousDay elements
    let selectedDay = $(event.target);
    var previousDay = $('.current-day');
    //sets currentDay indexto selected text
    currentDay = selectedDay.text() - 1;
    let prevDayIndex = +previousDay.text() -1;

    switchDay(currentDay, prevDayIndex);
    //update buttons
    previousDay.removeClass('current-day');
    selectedDay.addClass('current-day');

    //update header
    $('#dayValue').text("" + (currentDay+1));
  }
})

function switchDay(nextDay, prevDay){
      //hide previous and show selected
    console.log(prevDay, "this is prevDay");
    console.log(nextDay, "this is nextDay");
    console.log(days );
    hidePreviousMarkers(prevDay);
    showSelectedMarkers(nextDay);
    updateMapBounds(nextDay);

    //remove previous itinerary items and update with new
    $('.itinerary-item').remove();
    showItineraries(nextDay);


}


//Wiring for button that deletes day

$('#delete-day').on('click', function(event){
  var thisDay = +$('#dayValue').text();
  var previousDay = $('.current-day').prev();
  if(thisDay === days.length && thisDay != 1){ //if we are deleting last day
    switchDay(thisDay-2, thisDay-1);
    days.pop();
    $('.current-day').remove();
    previousDay.addClass("current-day");
    $('#dayValue').text("" + (thisDay - 1));
  }
  else if(thisDay != 1) {
    hidePreviousMarkers(thisDay - 1);
    days[thisDay-1] = new Day();
    $('.itinerary-item').remove();
  }
  else {
    hidePreviousMarkers(0);
    days[0] = new Day();
    $('.itinerary-item').remove();
  }

});


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
