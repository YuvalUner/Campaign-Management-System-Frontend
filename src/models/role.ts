interface Role {
    roleName: string;
    roleLevel?: number;
    roleDescription: string;
}

const builtInRoleNames: string[] = [
    "Campaign Owner",
    "Campaign Manager",
    "Candidate",
    "Volunteer",
    "Worker",
];

const matchRoleToRoleLevel = (roleName: string): number => {
    switch (roleName) {
    case "Campaign Owner":
        return 3;
    case "Campaign Manager":
        return 1;
    case "Candidate":
        return 2;
    default:
        return 0;
    }
};

export default Role;
export {builtInRoleNames, matchRoleToRoleLevel};
