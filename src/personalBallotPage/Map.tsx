import React, {useEffect} from "react";
import Ballot from "../models/ballot";
import AddressFormatter from "../utils/address-formatter";
import ComponentIds from "../utils/constantsAndStaticObjects/component-ids";

interface MapProps {
    ballot: Ballot;
}

function Map(props: MapProps): JSX.Element {

    let map = null;
    const marker = new google.maps.Marker({
        position: {lat: 0, lng: 0},
        map: map,
    });

    const geocoder = new google.maps.Geocoder();

    useEffect(() => {
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
