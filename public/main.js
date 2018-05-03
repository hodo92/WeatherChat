//Local storage
var STORAGE_ID = 'weather-app';
var saveToLocalStorage = function () {
    localStorage.setItem(STORAGE_ID, JSON.stringify(citiesInfos));
}
var getFromLocalStorage = function () {
    return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
}




//Templates
var source = $('#weather-template').html();
var template = Handlebars.compile(source)

var citiesInfos = [];

var prepInfos = function (data) {
    var name = data.name;
    var tempC = (data.main.temp) - 273.15;
    var C = tempC.toFixed(0);
    var tempF = (data.main.temp) * 9 / 5 - 459.67;
    var F = tempF.toFixed(0);

    var fullDate = new Date();
    var month = fullDate.getMonth() + 1;
    var twoDigitMonth = function () {
        if (month < 10) {
            return '0' + month;
        }
    }
    var currentMonth = twoDigitMonth();
    var date = fullDate.getDate() + "/" + currentMonth + "/" + fullDate.getFullYear();

    var dt = new Date();
    var hours = dt.getHours();
    var minutes = dt.getMinutes();
    var currentMinute = function () {
        // console.log(minutes)
        if (minutes < 10) {
            minutes = "0" + minutes;
            return hours + ':' + minutes;
        } else {
            return hours + ':' + minutes;
        }
    }
    var time = currentMinute();
    var typeOfWeather = data.weather[0].main;


    //Obj to keep all the infos
    var infoObj = {
        name: name,
        C: C,
        F: F,
        date: date,
        time: time,
        typeOfWeather: typeOfWeather,
        comments: []
    }
    addInfo(infoObj);
}

var fetch = function () {
    var cityValue = $('.get-city').val();

    $.ajax({
        method: "GET",
        url: "http://api.openweathermap.org/data/2.5/weather?q=" + cityValue + "&APPID=d703871f861842b79c60988ccf3b17ec",

        success: function (data) {
            $('.get-city').val('')
            // console.log(data)
            prepInfos(data)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // console.log(textStatus);
        }
    });
};

var conditionWeather = function (typeOfWeather) {
    var lastResult = $('.result').last();
    lastResult.css('background-image', 'url("./' + typeOfWeather + '.jpg")');
}



var addInfo = function (infoObj) {
    citiesInfos.push(infoObj);
    saveToLocalStorage()
    renderPage();
}

var renderInfo = function (infoObj, typeOfWeather) {
    var newHTML = template(infoObj);
    $('.results').append(newHTML);
    conditionWeather(typeOfWeather);
}

var removeInfo = function (btn) {
    //remove from array
    var city = $(btn).closest('.infos');
    var cityIndex = city.index();
    citiesInfos.splice(cityIndex, 1);
     saveToLocalStorage();
    //remove from page, understands that one item less
    renderPage();
}

var addComments = function (btn) {
    //add comment to the array
    var commentVal = $(btn).closest('.input-group').find('input').val();
    var city = $(btn).closest('.result')
    var postComment = city.find('.comment-HTML').find('.list-comments');
    var cityIndex = city.index();
    citiesInfos[cityIndex].comments.push(commentVal);
     saveToLocalStorage();
    //render comments
    $(postComment).append('<li>' + commentVal + '</li>');
}

//render the page item by item
var renderPage = function () {
    $('.results').empty();
    for (var i = 0; i < citiesInfos.length; i++) {
        // console.log(citiesInfos[i]);
        renderInfo(citiesInfos[i], citiesInfos[i].typeOfWeather);
    }

}


//Click handlers
$('#weather_form').on("submit", function (event) {
    event.preventDefault()
    fetch();
})

$('.results').on("click", ".fa-trash", function () {
    removeInfo(this);
})

$('.results').on("click", ".comment-btn", function (event) {
    event.preventDefault()
    addComments(this);
});


//update the var from local storage 
 citiesInfos = getFromLocalStorage();
// first render of the page 
renderPage();





