import React, {useEffect, useState} from "react";
import UserPrivateInfo from "../models/user-private-info";
import GenericRequestMaker from "../utils/generic-request-maker";
import config from "../app-config.json";
import {HttpStatusCode} from "axios";
import ErrorCodeExtractor from "../utils/error-code-extractor";
import userPrivateInfo from "../models/user-private-info";


function ProfilePage(): JSX.Element {
    // Define state object to store user's personal details
    const [userDetails, setUserDetails] = useState<UserPrivateInfo>({
        firstNameHeb : "",
        lastNameHeb : "",
        idNumber : 0,
        cityName : "",
    });

    // Define a state variable to track whether the form has been submitted
    const [submitted, setSubmitted] = useState(false);


    // Define a function to handle form submission
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!userDetails.firstNameHeb || !userDetails.lastNameHeb || !userDetails.idNumber || !userDetails.cityName) {
            alert("Please fill in all fields");
            return;
        }
        if (userDetails.firstNameHeb.match(/^[\u0590-\u05FF ]+$/) === null) {
            alert("First name must be in Hebrew letters only");
            return;
        }
        if (userDetails.lastNameHeb.match(/^[\u0590-\u05FF ]+$/) === null) {
            alert("Last name must be in Hebrew letters only");
            return;
        }
        if (userDetails.cityName.match(/^[a-zA-Z ]+$/) === null) {
            alert("City name must be in English letters only");
            return;
        }
        if (userDetails.idNumber.toString().length !== 9) {
            alert("ID number must be exactly 9 digits");
            return;
        }

        // store user details in local storage
        localStorage.setItem("userDetails", JSON.stringify(userDetails));

        setSubmitted(true);

        const res = await GenericRequestMaker.MakePutRequest(
            config.ControllerUrls.Users.Base + config.ControllerUrls.Users.UserPrivateInfo,
            userDetails
        );


        /*if (res.status === HttpStatusCode.Ok){
            // TODO: Handle success
        }
        else{
            const errNum = ErrorCodeExtractor(res.data);
            if (res.status === HttpStatusCode.BadRequest){
            }
            else{

            }
        }*/
    };

    // Define a function to handle changes in the input fields
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUserDetails((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };


    useEffect(() => {
        const storedDetails = localStorage.getItem("userDetails");
        if (storedDetails) {
            setUserDetails(JSON.parse(storedDetails));
            setSubmitted(true);
        }
        // eslint-disable-next-line no-use-before-define
        window.addEventListener("beforeunload", handleUnload);
        // eslint-disable-next-line no-use-before-define
        return () => window.removeEventListener("beforeunload", handleUnload);
    }, []);

    const handleUnload = () => {
        localStorage.removeItem("userDetails");
    };

    return (
        <div>
            <h1>Profile Page</h1>
            {submitted ? (
                // If the form has been submitted, display the user's personal details in read-only format
                <div>
                    <p>Name: {userDetails.firstNameHeb}</p>
                    <p>Surname: {userDetails.lastNameHeb}</p>
                    <p>ID: {userDetails.idNumber}</p>
                    <p>Address: {userDetails.cityName}</p>
                </div>
            ) : (
                // If the form hasn't been submitted yet, display the form for the user to enter their personal details
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="firstNameHeb"
                            value={userDetails.firstNameHeb}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Last Name:
                        <input
                            type="text"
                            name="lastNameHeb"
                            value={userDetails.lastNameHeb}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        ID:
                        <input
                            type="text"
                            name="idNumber"
                            value={userDetails.idNumber}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        City:
                        <input
                            type="text"
                            name="cityName"
                            value={userDetails.cityName}
                            onChange={handleInputChange}
                        />
                    </label>
                    <button type="submit">Submit</button>
                </form>
            )}
        </div>
    );
}

export default ProfilePage;
