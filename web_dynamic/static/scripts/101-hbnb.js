$(function () {
    let amenities = {};
    $('.amenities input[type="checkbox"]').change(function () {
        if ($(this).is(":checked")) {
            amenities[$(this).attr("data-id")] = $(this).attr("data-name");
        } else {
            delete amenities[$(this).attr("data-id")];
        }
        $(".amenities h4").text(Object.values(amenities).sort().join(", "));
    });

    let states = {};
    $('.locations > ul > h2 > input[type="checkbox"]').change(function () {
        if ($(this).is(":checked")) {
            states[$(this).attr("data-id")] = $(this).attr("data-name");
        } else {
            delete states[$(this).attr("data-id")];
        }
        $(".locations h4").text(Object.values(states).sort().join(", "));
    });

    let cities = {};
    $('.locations > ul > ul > li input[type="checkbox"]').change(function () {
        if ($(this).is(":checked")) {
            cities[$(this).attr("data-id")] = $(this).attr("data-name");
        } else {
            delete cities[$(this).attr("data-id")];
        }
        $(".locations h4").text(Object.values(cities).sort().join(", "));
    });

    $.get("http://0.0.0.0:5001/api/v1/status/", function(data, status) {
        if (status === "success" && data.status === "OK") {
            $("#api_status").addClass("available");
        } else {
            $("#api_status").removeClass("available");
        }
    });

    $.ajax({
        url: "http://0.0.0.0:5001/api/v1/places_search/",
        type: "POST",
        headers: { "Content-Type": "application/json" },
        data: JSON.stringfy({}),
        dataType: "json",
        success: postPlaces
    });

    $("button").click(function () {
        $.ajax({
            url: "http://0.0.0.0:5001/api/v1/places_search/",
            type: "POST",
            headers: { "Content-Type": "application/json" },
            data: JSON.stringfy({
                "amenities": Object.keys(amenities),
                "cities": Object.keys(cities),
                "states": Object.keys(states)
            }),
            dataType: "json",
            success: postPlaces
        });
    });

    $(".spanReview").click(function () {
        $.get("http://0.0.0.0:5001/api/v1/places/" + $(this).attr("data-id") + "/reviews", function(response) {
            if ($(".spanReview").text() === "show") {
                for (const review of response) {
                    $(".reviews ul").append("<li>{{ review.text }}</li>");
                }
                $(".spanReview").text("hide");
            } else if ($(".spanReview").text() === "hide") {
                $(".reviews ul").empty();
                $(".spanReview").text("show");
            }
        });
    });
});


function postPlaces (response) {
    $("section.places").append(response.map(place => {
        return `<article>
                   <div class="title_box">
	             <h2>{{ place.name }}</h2>
	             <div class="price_by_night">${{ place.price_by_night }}</div>
                   </div>
                   <div class="information">
                     <div class="max_guest">{{ place.max_guest }} Guest{% if place.max_guest != 1 %}s{% endif %}</div>
                     <div class="number_rooms">{{ place.number_rooms }} Bedroom{% if place.number_rooms != 1 %}s{% endif %}</div>
                     <div class="number_bathrooms">{{ place.number_bathrooms }} Bathroom{% if place.number_bathrooms != 1 %}s{% endif %}</div>
                   </div>
                   <div class="user">
                     <b>Owner:</b> {{ place.user.first_name }} {{ place.user.last_name }}
                   </div>
                   <div class="description">
                     {{ place.description | safe }}
                   </div>
                   <div class="reviews">
                     <h2>Reviews <span class="spanReview" data-id="{{ place.id }}">show</span></h2>
                     <ul></ul>
                   </div>
                 </article>`;
    }));
}
