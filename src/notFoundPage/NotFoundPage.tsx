import React from "react";
import {Box, Button, Container, Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import {useNavigate} from "react-router-dom";
import ScreenRoutes from "../utils/constantsAndStaticObjects/screen-routes";
import Constants from "../utils/constantsAndStaticObjects/constants";

interface ErrorPageProps {
    errorMessage?: string;
    linkTo?: string;
    buttonText?: string;
}

/**
 * Our 404 not found page, stolen directly from https://frontendshape.com/post/react-mui-5-404-page-example
 */
export default function NotFoundPage(props: ErrorPageProps) {

    const nav = useNavigate();

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
            }}
        >
            <Container maxWidth="md">
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="h1">
                            404
                        </Typography>
                        <Typography variant="h6" sx={{
                            marginBottom: `${Constants.muiBoxDefaultPadding}px`,
                        }}>
                            {props.errorMessage ?? "The page you are looking for does not exist"}
                        </Typography>
                        <Button variant="contained" onClick={() => {
                            nav(props.linkTo ?? ScreenRoutes.HomePage);
                        }}>{props.buttonText ?? "Back Home"}</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <img
                            src="https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569__340.jpg"
                            alt=""
                            width={500} height={250}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
