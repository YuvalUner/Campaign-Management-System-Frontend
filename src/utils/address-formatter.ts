function AddressFormatter(address: string){
    const splitAddress = address.split(",");
    let returnAddress = "";
    splitAddress.forEach((element) => {
        returnAddress += element.trim() + " ";
    });
    return returnAddress;
}

export default AddressFormatter;
