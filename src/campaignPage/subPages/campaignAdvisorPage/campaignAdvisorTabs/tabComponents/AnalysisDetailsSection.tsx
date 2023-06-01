import React from "react";
import AnalysisRow from "../../../../../models/analysis-row";
import {Accordion, AccordionSummary, Box, IconButton, Stack, Tooltip, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AnalysisDetailsSectionTable from "./AnalysisDetailsSectionTable";
import InfoIcon from "@mui/icons-material/Info";

interface AnalysisDetailsSectionProps {
    analysisDetails: AnalysisRow[];
    analysisType: string;
    tooltipText?: string;
}

function AnalysisDetailsSection(props: AnalysisDetailsSectionProps): JSX.Element {


    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <Stack direction={"row"} spacing={1}>
                    <Typography variant={"body1"}>{props.analysisType}</Typography>
                    {props.tooltipText !== undefined && <Tooltip title={props.tooltipText}>
                        <IconButton size={"small"}>
                            <InfoIcon color={"primary"} sx={{
                                fontSize: "1rem",
                            }}/>
                        </IconButton></Tooltip>}
                </Stack>
            </AccordionSummary>
            <Box sx={{
                padding: "1rem",
            }}>
                {props.analysisDetails?.length > 0 ?
                    <AnalysisDetailsSectionTable analysisDetails={props.analysisDetails}/>
                    : <Typography variant={"body2"}>{`No ${props.analysisType.toLowerCase()} found`}</Typography>
                }
            </Box>
        </Accordion>
    );
}

export default AnalysisDetailsSection;
