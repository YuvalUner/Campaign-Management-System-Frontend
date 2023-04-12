import React from "react";
import {Avatar, Box, Card, CardActions, CardHeader, Collapse, ListItem, Typography} from "@mui/material";
import Constants from "../../utils/constantsAndStaticObjects/constants";
import {toDdMmYyyyHhMm} from "../../utils/date-converter";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandMoreButton from "./ExpandMoreButton";
import AnnouncementWithPublisherDetails from "../../models/announcement-with-publisher-details";

interface AnnouncementCardProps {
    announcement: AnnouncementWithPublisherDetails;
}

const maxAnnouncementLength = 150;

function AnnouncementCard(props: AnnouncementCardProps): JSX.Element {

    let needsExpansion = false;
    let announcementContent = "";

    if (props.announcement.announcementContent !== null && props.announcement.announcementContent.length > 0) {
        needsExpansion = props.announcement.announcementContent.length > maxAnnouncementLength;
        announcementContent = needsExpansion ?
            props.announcement.announcementContent.substring(0, maxAnnouncementLength) + "..." :
            props.announcement.announcementContent;
    }

    const [expanded, setExpanded] = React.useState(false);

    let publisherName: string = props.announcement.displayNameEng ?? "Unknown";

    if (props.announcement.firstNameHeb !== null) {
        publisherName = props.announcement.firstNameHeb + " " + props.announcement.lastNameHeb;
    }

    return (
        <ListItem>
            <Card sx={{
                width: "100%",
            }}>
                <CardHeader
                    avatar={
                        <Avatar alt={props.announcement.campaignName as string}
                            src={props.announcement.campaignLogoUrl}/>
                    }
                    title={props.announcement.announcementTitle}
                    subheader={`Published by ${publisherName} on ${toDdMmYyyyHhMm(props.announcement.publishingDate)}`}
                    action={
                        <AnnouncementIcon/>
                    }
                />
                <Box sx={{
                    marginLeft: `${Constants.muiBoxDefaultPadding}px`,
                    marginRight: `${Constants.muiBoxDefaultPadding / 2}px`,
                    whitespace: "pre-line",
                }}>
                    <Collapse in={!expanded} timeout="auto" unmountOnExit>
                        <Typography paragraph>
                            {announcementContent}
                        </Typography>
                    </Collapse>
                    <Collapse in={expanded} timeout="auto">
                        <Typography paragraph>
                            {props.announcement.announcementContent}
                        </Typography>
                    </Collapse>
                </Box>
                <CardActions disableSpacing>
                    <ExpandMoreButton
                        onClick={() => setExpanded(!expanded)}
                        aria-expanded={expanded}
                        aria-label="show more"
                        expand={expanded}
                        sx={{
                            visibility: needsExpansion ? "visible" : "hidden",
                            anchorOrigin: {
                                vertical: "bottom",
                                horizontal: "right",
                            },
                        }}
                    >
                        <ExpandMoreIcon/>
                    </ExpandMoreButton>
                </CardActions>
            </Card>
        </ListItem>
    );
}

export default AnnouncementCard;

