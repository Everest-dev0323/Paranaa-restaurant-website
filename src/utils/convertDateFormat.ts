export function dateIsValid(dateStr: string) {
    const regex = /^\d{4}\-\d{2}\-\d{2}$/;

    if (dateStr.match(regex) === null) {
        return false;
    }

    const [year, month, day] = dateStr.split('-');

    // 👇️ format Date string as `yyyy-mm-dd`
    const isoFormattedStr = `${year}-${month}-${day}`;

    const date = new Date(isoFormattedStr);
//console.log(date,'etss')
    const timestamp = date.getTime();

    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
        return false;
    }

    return date.toISOString().startsWith(isoFormattedStr);
}
export const convertDateFormat = (dateString: string) => {
    const [year, month, day] = dateString.split('-');

    const result = [year, month, day].join('/');
    return result
}