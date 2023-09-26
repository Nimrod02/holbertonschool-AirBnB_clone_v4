$(document).ready(function() {
        const amenityDict = {};
      
        function updateAmenities() {
          const amenitiesList = Object.keys(amenityDict);
          const amenitiesText = amenitiesList.join(', ');
      
          $('div.Amenities > h4').text(amenitiesText);
        }
      
        $('input[type="checkbox"]').change(function() {
          const amenityID = $(this).attr('data-id');
      
          if ($(this).is(':checked')) {
            amenityDict[amenityID] = true;
          } else {
            delete amenityDict[amenityID];
          }
      
          updateAmenities();
        });
      });