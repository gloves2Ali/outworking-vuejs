const date = (timestap) => {
    if (!timestap) {
        return ''
    }

    const times = new Date(timestap)
    const year = times.getFullYear()
    let month = times.getMonth() + 1
    let day = times.getDate()

    // 加0
    if (month.toString().length === 1) {
        month = `0${month}`
    }

    if (day.toString().length === 1) {
        day = `0${day}`
    }

    return `${year}/${month}/${day}`
}

export default date
