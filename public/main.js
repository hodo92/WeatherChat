
var fetch = function () {
    var city = $('.form-control').val()
    var searchtext = "select item.condition from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + city + "') and u='c'"
    $.getJSON("https://query.yahooapis.com/v1/public/yql?q=" + searchtext + "&format=json").success(function(data){
        console.log(data);
        $('#temp').html("Temperature in " + city + " is " + data.query.results.channel.item.condition.temp + "°C");
      }); 
    };


$(".search-city").on("click", function(){
    fetch();
});