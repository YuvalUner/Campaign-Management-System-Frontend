import React, {useEffect} from "react";
import Ballot from "../models/ballot";
import AddressFormatter from "../utils/helperMethods/address-formatter";
import ComponentIds from "../utils/constantsAndStaticObjects/component-ids";

interface MapProps {
    ballot: Ballot;
}

/**
 * The Map component is a helper component that renders a map with a marker at the address of the ballot.
 * It uses the Google Maps API.
 * @param props
 * @constructor
 */
function Map(props: MapProps): JSX.Element {

    let map = null;
    const marker = new google.maps.Marker({
        position: {lat: 0, lng: 0},
        map: map,
    });

    const geocoder = new google.maps.Geocoder();

    useEffect(() => {
        // Get the lat and lng of the address and set the map and marker to that location.
        // Code taken from Google's API documentation.
        geocoder.geocode({address: AddressFormatter(props.ballot.ballotAddress + props.ballot.cityName)},
            (results, status) => {
                if (status === "OK") {
                    if (results) {
                        map = new google.maps.Map(document.getElementById(ComponentIds.MapDiv) as HTMLElement, {
                            center: results[0].geometry.location,
                            zoom: 16,
                        });
                        marker.setPosition(results[0].geometry.location);
                        marker.setMap(map);
                    }
                }
            });
    }, []);

    return (
        <div id={ComponentIds.MapDiv} style={{width: "100%", height: "50%"}}/>
    );
}

export default Map;
