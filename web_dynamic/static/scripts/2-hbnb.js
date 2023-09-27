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
  
    // Function to update the API status
    function updateApiStatus() {
      // Make an HTTP GET request to the API status endpoint
      $.get('http://0.0.0.0:5001/api/v1/status/', function(data) {
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
  
    // Set an interval to periodically update the API status (e.g., every 10 seconds)
    setInterval(updateApiStatus, 10000); // Update every 10 seconds
  });
  