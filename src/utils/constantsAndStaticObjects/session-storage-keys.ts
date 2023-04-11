/**
 * This file contains all the keys that are used to store data in the session storage or local storage.
 * It is used to avoid typos and to make the code more readable.<br/>
 * Anything being here does not mean that it is being used, but only possibly, as things were added here whenever
 * an attempt to fix a bug using session / local storage was made (and usually failed).
 */
const SessionStorageKeys = {
    HomePageController: "HomePageController",
    AuthToken: "AuthToken",
    ShouldTryRelogin: "ShouldTryRelogin",
};

export default SessionStorageKeys;
