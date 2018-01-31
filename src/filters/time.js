const time = (timestap) => {
    if (!timestap) {
        return ''
    }

    const times = new Date(timestap)
    const year = times.getFullYear()
    let month = times.getMonth() + 1
    let day = times.getDate()

    let hour = times.getHours()
    let minutes = times.getMinutes()
    let seconds = times.getSeconds()

    // 加0
    if (month.toString().length === 1) {
        month = `0${month}`
    }

    if (day.toString().length === 1) {
        day = `0${day}`
    }

    if (hour.toString().length === 1) {
        hour = `0${hour}`
    }

    if (minutes.toString().length === 1) {
        minutes = `0${minutes}`
    }

    if (seconds.toString().length === 1) {
        seconds = `0${seconds}`
    }

    return `${year}/${month}/${day} ${hour}:${minutes}:${seconds}`
}

export default time
