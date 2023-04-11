/**
 * Formats an address in a way that is better for the google maps api.
 * @param address
 * @constructor
 */
function AddressFormatter(address: string){
    const splitAddress = address.split(",");
    let returnAddress = "";
    splitAddress.forEach((element) => {
        returnAddress += element.trim() + " ";
    });
    return returnAddress;
}

export default AddressFormatter;
