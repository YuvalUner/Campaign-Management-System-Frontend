import TabPageBaseProps from "./tab-page-base-props";
import Permission from "../../models/permission";

interface TabPageBasePropsWithPermission extends TabPageBaseProps{
    permission: Permission;
}

export default TabPageBasePropsWithPermission;
