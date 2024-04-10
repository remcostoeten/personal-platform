export const getCurrentDateTime = () => {
    let today = new Date();
    let date = `${today.getFullYear()}-${today.getMonth() + 1
        }-${today.getDate()}`;
    let time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

    return { isoString: today.toISOString(), date, time };
};

export const dayPeriod = (date: Date | string) => {
    const dateObj = new Date(date);
    const hours = dateObj.getHours();
    return hours < 12 ? 'AM' : 'PM';
}