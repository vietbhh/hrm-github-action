import { useFormatMessage } from "@apps/utility/common";
import React, { useEffect, useRef } from "react";
import { withScriptjs } from "react-google-maps";
import GooglePlacesAutocomplete, {
    geocodeByLatLng,
    geocodeByPlaceId
} from "react-google-places-autocomplete";
const PlacesAuto = (props) => {
    const {
        handleClickMap,
        handleSelecteAddress,
        positonInMap,
        LatLng,
        address,
        place_id
    } = props;
    const getGeofencing = (place_id) => {
        if (place_id) {
            geocodeByPlaceId(place_id)
                .then((results) => {
                    handleSelecteAddress(results[0]);
                })
                .catch((error) => console.error(error));
        }
    };
    const getGeoByLatLng = (LatLng) => {
        geocodeByLatLng(LatLng)
            .then((results) => {
                handleSelecteAddress(results[0]);
            })
            .catch((error) => console.error(error));
    };

    const onSelect = (e) => {
        getGeofencing(e.value.place_id);
    };
    const firstUpdate = useRef(true);
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        getGeoByLatLng(positonInMap);
    }, [positonInMap]);
    return (
        <div className="w-75">
            <label>
                {useFormatMessage("modules.attendance_setting.fields.address")}{" "}
                *
            </label>
            <GooglePlacesAutocomplete
                selectProps={{
                    componentRestrictions: { country: ["vn"] },
                    styles: {
                        input: (provided) => ({
                            ...provided,
                            color: "black"
                        }),
                        option: (provided) => ({
                            ...provided,
                            color: "black"
                        }),
                        singleValue: (provided) => ({
                            ...provided,
                            color: "black"
                        })
                    },
                    placeholder: "Accurate Address",
                    value: {
                        label: address,
                        value: { place_id: place_id }
                    },
                    onChange: onSelect,
                    className: "select_address",
                    classNamePrefix: "address_prefix"
                }}
            />
        </div>
    );
};

export default withScriptjs(PlacesAuto);
