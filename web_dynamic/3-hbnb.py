#!/usr/bin/python3
""" Starts a Flash Web Application """
import uuid
from models import storage
from models.state import State
from models.city import City
from models.amenity import Amenity
from models.place import Place
from os import environ
from flask import Flask, render_template
from flask import Flask, jsonify, request, abort
from api.v1.views import app_views
app = Flask(__name__)
# app.jinja_env.trim_blocks = True
# app.jinja_env.lstrip_blocks = True


@app.teardown_appcontext
def close_db(error):
    """ Remove the current SQLAlchemy Session """
    storage.close()


@app.route('/3-hbnb', strict_slashes=False)
def hbnb():
    """ HBNB is alive! """
    states = storage.all(State).values()
    states = sorted(states, key=lambda k: k.name)
    st_ct = []

    for state in states:
        st_ct.append([state, sorted(state.cities, key=lambda k: k.name)])

    amenities = storage.all(Amenity).values()
    amenities = sorted(amenities, key=lambda k: k.name)

    places = storage.all(Place).values()
    places = sorted(places, key=lambda k: k.name)

    cache_id = (str(uuid.uuid4())) # Generate an UUID

    return render_template('3-hbnb.html',
                           states=st_ct,
                           amenities=amenities,
                           places=places,
                           cache_id=cache_id) # Add cache in template

@app_views.route('/places_search', methods=['POST'], strict_slashes=False)
def places_search():
    # Récupérez les données JSON de la requête
    data = request.get_json()

    # Vérifiez si les données JSON sont valides
    if not data:
        abort(400, description='Not a JSON')

    # Récupérez les valeurs des clés states, cities et amenities du JSON
    states = data.get('states', [])
    cities = data.get('cities', [])
    amenities = data.get('amenities', [])

    # Créez une liste vide pour stocker les résultats de la recherche
    search_results = []

    # Si toutes les listes sont vides, renvoyez tous les objets Place
    if not states and not cities and not amenities:
        search_results = storage.all(Place).values()
    else:
        # Si la liste states n'est pas vide, ajoutez les places des États spécifiés
        for state_id in states:
            state = storage.get(State, state_id)
            if state:
                cities.extend([city.id for city in state.cities])

        # Supprimez les doublons des villes
        cities = list(set(cities))

        # Ajoutez les places des villes spécifiées
        for city_id in cities:
            city = storage.get(City, city_id)
            if city:
                search_results.extend(city.places)

        # Si la liste amenities n'est pas vide, filtrez les résultats par amenity
        if amenities:
            search_results = [place for place in search_results if all(amenity_id in place.amenities for amenity_id in amenities)]

    # Convertissez les résultats en liste de dictionnaires
    results = [place.to_dict() for place in search_results]

    # Renvoyez les résultats au format JSON
    return jsonify(results)



if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5000)
