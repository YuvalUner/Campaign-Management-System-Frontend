import React from "react";
import {Avatar, IconButton} from "@mui/material";
import User from "../../models/user";

interface UserProfileImageProps {
    user: User;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

function UserProfileImage(props: UserProfileImageProps): JSX.Element {

    if (props.user.displayNameEng === undefined || props.user.displayNameEng === null) {
        props.user.displayNameEng = "Unknown";
    }

    if (props.user.profilePicUrl === undefined || props.user.profilePicUrl === null) {
        props.user.profilePicUrl = "";
    }

    return (
        <IconButton onClick={props.onClick}>
            <Avatar alt={props.user.displayNameEng} src={props.user.profilePicUrl}/>
        </IconButton>
    );
}

export default UserProfileImage;
