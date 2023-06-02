import User from "./user";

interface Admin extends User {
    RoleName?: string,
    RoleLevel?: number,
}

export default Admin;