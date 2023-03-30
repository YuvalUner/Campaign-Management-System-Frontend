function ErrorCodeExtractor(httpRequestReturn: string | null): number{
    if (httpRequestReturn === null){
        return -1;
    }
    const splitMessage: string[] = httpRequestReturn.split(" ");
    return parseInt(splitMessage[2]);
}

export default ErrorCodeExtractor;