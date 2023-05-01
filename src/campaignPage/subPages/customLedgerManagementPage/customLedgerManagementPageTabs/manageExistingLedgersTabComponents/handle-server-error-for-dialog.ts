import ErrorCodeExtractor from "../../../../../utils/helperMethods/error-code-extractor";
import CustomStatusCode from "../../../../../utils/constantsAndStaticObjects/custom-status-code";
import Events from "../../../../../utils/helperMethods/events";

// eslint-disable-next-line
function handleServerErrorForDialog(error: any) {
    const errorCode = ErrorCodeExtractor(error.response.data);
    if (errorCode === CustomStatusCode.LedgerNotFound){
        Events.dispatch(Events.EventNames.BubbleErrorUpwards, "Ledger not found" +
            " - it may have been deleted by another user. Please try refreshing the page.");
    } else if (errorCode === CustomStatusCode.CampaignNotFound){
        Events.dispatch(Events.EventNames.BubbleErrorUpwards, "Campaign not found" +
            " - it may have been deleted by another user. Please try refreshing the page.");
    }
}

export default handleServerErrorForDialog;
