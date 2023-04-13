import {TabPage} from "../../models/tab-page";

/**
 * An array of all the active tabs.
 * This is a complete workaround for the fact that, for whatever reason, whenever the user clicks on the X
 * button to close a tab, the state of the campaign page is lost during the function call, causing all
 * tabs to close.
 */
const activeTabsBackup: TabPage[] = [];

export default activeTabsBackup;
