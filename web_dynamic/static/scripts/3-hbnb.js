$(document).ready(function() {
  // Function to update the amenities list
  function updateAmenitiesList(amenities) {
      const amenityNames = Object.keys(amenities);

      // Join the names with a comma
      let displayText = amenityNames.join(', ');

      // Check if the text exceeds the maximum number of characters
      if (displayText.length > maxCharacters) {
          // Trim the text to the maximum number of characters and add "..."
          displayText = displayText.substring(0, maxCharacters - 3) + '...';
      }

      $('.amenities h4').text(displayText);
  }

  function loadPlaces() {
      $.ajax({
          type: 'POST',
          url: '/api/v1/places_search',
          contentType: 'application/json',
          data: JSON.stringify({}),
          success: function(data) {
              $('.places').empty();

              data.forEach(function(place) {
                  const article = $('<article>');
                  article.html(`
                      <div class="title_box">
                          <h2>${place.name}</h2>
                          <div class="price_by_night">$${place.price_by_night}</div>
                      </div>
                      <div class="information">
                          <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                          <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                          <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
                      </div>
                      <div class="description">${place.description}</div>
                  `);
                  $('.places').append(article);
              });
          }
      });
  }

  // Function to update the API status
  function updateApiStatus() {
      // Make an HTTP GET request to the API status endpoint
      $.get('/api/v1/status', function(data) {
          console.log(data); // Display the API response in the console.
          // Check if the status is "OK"
          if (data.status === "OK") {
              // Add the class "available" to the div#api_status
              $('#api_status').addClass('available');
          } else {
              // Remove the class "available" from the div#api_status
              $('#api_status').removeClass('available');
          }
      });
  }

  // Initial update of API status and load places
  updateApiStatus();
  loadPlaces();

  // Set an interval to periodically update the API status (e.g., every 10 seconds)
  setInterval(updateApiStatus, 10000); // Update every 10 seconds

  // Define an object to store selected amenities
  const selectedAmenities = {};

  // Define the maximum number of characters to display in the h4
  const maxCharacters = 30; // Change this value as needed

  // Listen for changes on each input checkbox tag
  $('input[type="checkbox"]').change(function() {
      // Get Amenity ID and Name from data attributes
      const amenityName = $(this).data('name');

      // Check if the checkbox is checked
      if ($(this).is(':checked')) {
          // Store Amenity Name in the selectedAmenities object
          selectedAmenities[amenityName] = true;
      } else {
          // Remove Amenity Name from the selectedAmenities object
          delete selectedAmenities[amenityName];
      }

      // Update the h4 tag inside the Amenities div with the list of checked Amenities
      updateAmenitiesList(selectedAmenities);
  });

  // Initial update of the amenities list when the page loads
  updateAmenitiesList(selectedAmenities);
});
