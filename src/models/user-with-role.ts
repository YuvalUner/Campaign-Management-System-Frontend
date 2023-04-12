import User from "./user";
import Role from "./role";
import { matchRoleToRoleLevel } from "./role";

interface UserWithRole extends User, Role{
}

const sortUsersByRoleLevel = (users: UserWithRole[]): [UserWithRole[],
    UserWithRole[], UserWithRole[], UserWithRole[]]=> {
    const usersByRoleLevel: [UserWithRole[], UserWithRole[], UserWithRole[], UserWithRole[]] = [[], [], [], []];
    users.forEach((user: UserWithRole) => {
        usersByRoleLevel[matchRoleToRoleLevel(user.roleName)].push(user);
    });
    return usersByRoleLevel;
};

export default UserWithRole;
export {sortUsersByRoleLevel};
