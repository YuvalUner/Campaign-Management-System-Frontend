import CustomVotersLedger from "../../../../../models/custom-voters-ledger";

interface DialogProps {
    open: boolean;
    onClose: () => void;
    customLedger: CustomVotersLedger;
    campaignGuid: string;
}

export default DialogProps;
