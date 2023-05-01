function toDdMmYyyy(date: Date): string {
    // Workaround in odd cases where the date is not a Date object, but is still a valid date string
    date = new Date(date);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    let formattedDate = "";
    formattedDate += day < 10 ? "0" + day : day;
    formattedDate += "/";
    formattedDate += month < 10 ? "0" + month : month;
    formattedDate += "/";
    formattedDate += year;

    return formattedDate;
}

function toDdMmYyyyHhMm(date: Date | undefined): string {
    if (date === undefined) return "";

    // Workaround in odd cases where the date is not a Date object, but is still a valid date string
    date = new Date(date);
    let formattedDate = toDdMmYyyy(date);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    formattedDate += " ";
    formattedDate += hours < 10 ? "0" + hours : hours;
    formattedDate += ":";
    formattedDate += minutes < 10 ? "0" + minutes : minutes;

    return formattedDate;
}

export { toDdMmYyyy, toDdMmYyyyHhMm };
