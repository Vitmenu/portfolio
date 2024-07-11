export const extractTime = (timeStamp) => {
    timeStamp = parseInt(timeStamp);
    const date = new Date(timeStamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    return time;
};

export const getTimeAgo = (timeStamp) => {

    timeStamp = parseInt(timeStamp);

    const currentTimeStamp = Date.now();
    const timeDifference = currentTimeStamp - timeStamp;

    const minutesAgo = Math.floor(timeDifference / (1000 * 60));
    const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60));

    const currentDate = new Date(currentTimeStamp);
    const givenDate = new Date(timeStamp);

    const isToday = currentDate.toDateString() === givenDate.toDateString();

    return isToday && hoursAgo < 1
        ? `${minutesAgo}m ago` : isToday && hoursAgo < 24
        ? `Today ${extractTime(timeStamp)}`
        : new Date(timeStamp).toDateString();
};