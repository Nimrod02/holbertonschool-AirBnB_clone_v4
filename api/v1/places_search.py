from api.v1.views import app_views
from flask import Flask, jsonify, request
from models import storage
from models.place import Place
from models.state import State
from models.city import City


@app_views.route('/places_search', methods=['POST'], strict_slashes=False)
def search_places():
    # Get the JSON data from the request
    data = request.get_json()

    if data is None:
        return jsonify({"error": "Not a JSON"}), 400

    # Retrieve all places if the JSON is empty
    if not data or all(len(v) == 0 for v in data.values()):
        places = storage.all(Place).values()
        return jsonify([place.to_dict() for place in places])

    # Get the lists of State ids, City ids, and Amenity ids from the JSON
    state_ids = data.get("states", [])
    city_ids = data.get("cities", [])
    amenity_ids = data.get("amenities", [])

    # Retrieve places based on the specified criteria
    places = []
    if state_ids:
        for state_id in state_ids:
            state = storage.get(State, state_id)
            if state:
                for city in state.cities:
                    places.extend(city.places)
    if city_ids:
        for city_id in city_ids:
            city = storage.get(City, city_id)
            if city:
                places.extend(city.places)

    # Filter places based on amenities if specified
    if amenity_ids:
        places = [place for place in places if all(amenity_id in place.amenities for amenity_id in amenity_ids)]

    return jsonify([place.to_dict() for place in places])
