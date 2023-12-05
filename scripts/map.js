//--------------
// show the map
//--------------
function showMap() {
    //-----------------------------------------
    // Define and initialize basic mapbox data
    //-----------------------------------------
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWRhbWNoZW4zIiwiYSI6ImNsMGZyNWRtZzB2angzanBjcHVkNTQ2YncifQ.fTdfEXaQ70WoIFLZ2QaRmQ';
    const map = new mapboxgl.Map({
        container: 'map', // Container ID
        style: 'mapbox://styles/mapbox/streets-v11', // Styling URL
        center: [-122.964274, 49.236082], // Starting position
        zoom: 8 // Starting zoom
    });

    // Add user controls to map (compass and zoom) to top left
    var nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-left');

    // declare some globally used variables
    var userLocationMarker;
    var searchLocationMarker;
    var userLocation;
    var searchLocation;

    //------------------------------------
    // Listen for when map finishes loading
    // then Add map features 
    //------------------------------------
    map.on('load', () => {
        var mapHospitalId = ''
        if (sessionStorage.getItem('hospitalID') != null) {
            mapHospitalId = sessionStorage.getItem('hospitalID')
        }
        sessionStorage.setItem('hospitalID', '')

        // Defines map pin icon for events
        map.loadImage(
            'https://cdn.iconscout.com/icon/free/png-256/pin-locate-marker-location-navigation-16-28668.png',
            (error, image) => {
                if (error) throw error;

                // // Add the image to the map style.
                map.addImage('eventpin', image); // Pin Icon


                // READING information from "hospitals" collection in Firestore
                function successCallback(position) {
                    let hospitalsQuery;

                    if (mapHospitalId) {
                        // Fetch only the specific hospital
                        hospitalsQuery = db.collection('hospitals').doc(mapHospitalId).get();
                    } else {
                        // Fetch all hospitals
                        hospitalsQuery = db.collection('hospitals').get();
                    }

                    hospitalsQuery.then(querySnapshot => {
                        const features = []; // Defines an empty array for information to be added to
                        // If mapHospitalId is set, querySnapshot is a single doc
                        if (mapHospitalId) {
                            const doc = querySnapshot;
                            // Process single hospital data
                            lat = doc.data().lat;
                                lng = doc.data().lng;
                                console.log(lat, lng);
                                coordinates = [lng, lat];
                                // calculate distance to display on the map
                                distance = (((111.320 * 0.555 * (userLocation[0] - lng)) ** 2 + (110.574 * (userLocation[1] - lat)) ** 2) ** 0.5).toFixed(2)
                                // Coordinates
                                event_name = doc.data().name; // Event Name
                                preview = doc.data().details; // Text Preview

                                // Pushes information into the features array
                                // in our application, we have a string description of the hospital including distance from current location calculated above
                                features.push({
                                    'type': 'Feature',
                                    'properties': {
                                        'description': `<div class='w-100'><h5 class='text-center'>${event_name}</h5> <br> <br><p>Distance: ${distance} km</p><p>${preview}</p> <br><div class="text-center"><a class="btn mapPopBtn rounded-pill py-2 my-2" href="/hospital_detail.html?docID=${doc.id}">Read more</a></div></div>`
                                    },
                                    'geometry': {
                                        'type': 'Point',
                                        'coordinates': coordinates
                                    }
                                });
                        } else {
                            // Process all hospitals data
                            querySnapshot.forEach(doc => {
                                lat = doc.data().lat;
                                lng = doc.data().lng;
                                console.log(lat, lng);
                                coordinates = [lng, lat];
                                // calculate distance to display on the map
                                distance = (((111.320 * 0.555 * (userLocation[0] - lng)) ** 2 + (110.574 * (userLocation[1] - lat)) ** 2) ** 0.5).toFixed(2)
                                // Coordinates
                                event_name = doc.data().name; // Event Name
                                preview = doc.data().details; // Text Preview

                                // Pushes information into the features array
                                // in our application, we have a string description of the hospital including distance from current location calculated above
                                features.push({
                                    'type': 'Feature',
                                    'properties': {
                                        'description': `<div class='w-100'><h5 class='text-center'>${event_name}</h5> <br> <br><p>Distance: ${distance} km</p><p>${preview}</p> <br><div class="text-center"><a class="btn mapPopBtn rounded-pill py-2 my-2" href="/hospital_detail.html?docID=${doc.id}">Read more</a></div></div>`
                                    },
                                    'geometry': {
                                        'type': 'Point',
                                        'coordinates': coordinates
                                    }
                                });
                            });
                        }

                        // Adds features as a source of data for the map
                        map.addSource('places', {
                            'type': 'geojson',
                            'data': {
                                'type': 'FeatureCollection',
                                'features': features
                            }
                        });

                        // Creates a layer above the map displaying the pins
                        // by using the sources that was just added
                        map.addLayer({
                            'id': 'places',
                            'type': 'symbol',
                            // source: 'places',
                            'source': 'places',
                            'layout': {
                                'icon-image': 'eventpin', // Pin Icon
                                'icon-size': 0.1, // Pin Size
                                'icon-allow-overlap': true // Allows icons to overlap
                            }
                        });

                        //-----------------------------------------------------------------------
                        // Add Click event listener, and handler function that creates a popup
                        // that displays info from "hospitals" collection in Firestore
                        //-----------------------------------------------------------------------
                        map.on('click', 'places', (e) => {
                            // Extract coordinates array.
                            // Extract description of that place
                            const coordinates = e.features[0].geometry.coordinates.slice();
                            const description = e.features[0].properties.description;

                            // Ensure that if the map is zoomed out such that multiple copies of the feature are visible, the popup appears over the copy being pointed to.
                            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                            }

                            new mapboxgl.Popup()
                                .setLngLat(coordinates)
                                .setHTML(description)
                                .addTo(map);
                        });

                        //-----------------------------------------------------------------------
                        // Add mousenter event listener, and handler function to 
                        // Change the cursor to a pointer when the mouse is over the places layer.
                        //-----------------------------------------------------------------------
                        map.on('mouseenter', 'places', () => {
                            map.getCanvas().style.cursor = 'pointer';
                        });

                        // Defaults cursor when not hovering over the places layer
                        map.on('mouseleave', 'places', () => {
                            map.getCanvas().style.cursor = '';
                        });
                    });
                }

                //----------------------
                // Get current location
                //----------------------
                async function getLocation() {
                    return new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(function (position) {
                            userLocation = [position.coords.longitude, position.coords.latitude];
                            console.log(userLocation);
                            console.log(searchLocation);

                            // Add a marker to the map at the user's location
                            userLocationMarker = new mapboxgl.Marker()
                                .setLngLat(userLocation)
                                .addTo(map);

                            // Center the map on the user's location
                            map.flyTo({
                                center: userLocation
                            });
                            resolve(successCallback(position));
                        }, reject);
                    });
                }
                (async () => {
                    console.log(await getLocation());
                })();

            }
        );

        // Add the image to the map style.
        map.loadImage(
            'https://cdn-icons-png.flaticon.com/512/61/61168.png',
            (error, image) => {
                if (error) throw error;

                // Add the image to the map style with width and height values
                map.addImage('userpin', image, { width: 10, height: 10 });

                // Add the MapboxGeocoder search box to the map
                const geocoder = new MapboxGeocoder({
                    accessToken: mapboxgl.accessToken,
                    mapboxgl: mapboxgl
                });
                map.addControl(geocoder);

                // Listen for the 'result' event from the geocoder (when a search is made)
                geocoder.on('result', function (e) {
                    searchLocation = e.result.geometry.coordinates;
                    console.log(userLocation);
                    console.log(searchLocation);

                    // Add a marker to the map at the search location
                    searchLocationMarker && searchLocationMarker.remove(); // Remove the previous search marker if it exists
                    searchLocationMarker = new mapboxgl.Marker({ color: 'red' })
                        .setLngLat(searchLocation)
                        .addTo(map);

                    // Fit the map to include both the user's location and the search location
                    const bounds = new mapboxgl.LngLatBounds();
                    bounds.extend(userLocation);
                    bounds.extend(searchLocation);

                    map.fitBounds(bounds, {
                        padding: {
                            top: 100,
                            bottom: 50,
                            left: 100,
                            right: 50
                        } // Add some padding so that markers aren't at the edge or blocked
                    });
                });
            }
        );
    });
}

// Call the function to display the map with the user's location and event pins
showMap();
