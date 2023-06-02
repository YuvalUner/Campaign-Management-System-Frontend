import React from "react";
import AnalysisSample from "../../../../../models/analysis-sample";
import {Accordion, AccordionSummary, Box, Divider, List, ListItemText, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface SamplesListProps {
    samples: AnalysisSample[];
    samplesType: string;
}

function SamplesList(props: SamplesListProps): JSX.Element {
    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography variant={"body1"}>{props.samplesType} samples</Typography>
            </AccordionSummary>
            <Box sx={{
                padding: "1rem"
            }}>
                {(props.samples !== undefined && props.samples.length > 0) ?
                    <List>
                        {props.samples.map((sample, idx) => {
                            return (
                                <>
                                    <ListItemText key={props.samplesType + idx}
                                        primary={`${idx + 1}.  ${sample.sampleText}`} sx={{
                                            marginBottom: "3px"
                                        }}/>
                                    {idx !== props.samples.length - 1 && <Divider variant="inset" component="li" />}
                                </>
                            );
                        })}
                    </List>
                    : <Typography variant={"body2"}>{`No ${props.samplesType.toLowerCase()} samples found`}</Typography>
                }
            </Box>
        </Accordion>
    );
}

export default SamplesList;
