import React from "react";
import {Box} from "@mui/material";

export interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            aria-labelledby={`simple-tab-${index}`}
            style={{height: "100%", width: "100%"}}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3, height: "100%", width: "100%" }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default TabPanel;
