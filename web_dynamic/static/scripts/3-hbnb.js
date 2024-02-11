$(function () {
    let amenities = {};
    $('input[type="checkbox"]').change(function () {
        if ($(this).is(":checked")) {
            amenities[$(this).attr("data-id")] = $(this).attr("data-name");
        } else {
            delete amenities[$(this).attr("data-id")];
        }
        $(".amenities h4").text(Object.values(amenities).sort().join(", "));
    });
});

$(function () {
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
        success: function (response) {
            $("section.places").append(response.map(place => {
                `<article>
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
                 </article>`;
            }));
        }
    });
});
