import React from "react";
import {Box, Button, Container, Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import {useNavigate} from "react-router-dom";
import ScreenRoutes from "../utils/constantsAndStaticObjects/screen-routes";
import Constants from "../utils/constantsAndStaticObjects/constants";

interface NotAuthorizedProps {
    errorMessage?: string;
}

/**
 * Our 401 not found page, stolen from https://frontendshape.com/post/react-mui-5-404-page-example
 * and modified slightly to become a 401 page.
 */
export default function NotAuthorizedPage(props: NotAuthorizedProps) {

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
                    <Grid xs={6}>
                        <Typography variant="h1">
                            401
                        </Typography>
                        <Typography variant="h6" sx={{
                            marginBottom: `${Constants.muiBoxDefaultPadding}px`,
                        }}>
                            {props.errorMessage ?? "You do not have permission to view this page "}
                        </Typography>
                        <Button variant="contained" onClick={() => {
                            nav(ScreenRoutes.HomePage);
                        }}>Back Home</Button>
                    </Grid>
                    <Grid xs={6}>
                        <img
                            src={"https://phabcart.imgix.net/cdn/scdn/images/uploads/52024AN_WEB_600.png?auto=compress"}
                            alt=""
                            width={500} height={250}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
