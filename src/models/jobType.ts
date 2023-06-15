export interface JobType {
    jobTypeName?: string;
    jobTypeDescription?: string;
    isCustomJobType: boolean;
}
export const builtInTypesNames: string[] = [
    "Phone Operator",
    "Ballot Crew",
    "Ballot Staff",
    "Driver",
    "Other",
];
