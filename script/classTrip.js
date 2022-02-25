class Trip {
    /**
     * Transform the parsed trip into a trip object
     * @constructor
     * @param {object} l - Format [(year,month,day,hour,minut), elec, number, speed, (hours,minuts,seconds), price]
     */
    constructor(l) {
        this.date = this.format_date(l[0]);
        this.elec = this.format_velo(l[1]);
        this.number = parseInt(l[2]);
        this.speed = parseFloat(l[3]);
        this.duration = this.format_duration(l[4]);
        this.price = parseInt(l[5]);
    }

    get year() {
        return this.date.getFullYear();
    }
    get month() {
        return this.date.getMonth() + 1;
    }
    get day() {
        return this.date.getDate();
    }
    get weekday() {
        return (this.date.getDay() + 6) % 7;
    }
    get hour() {
        return this.date.getHours();
    }
    get minute() {
        return this.date.getMinutes();
    }
    get dur_mn() {
        return this.duration[0] * 60 + this.duration[1] + this.duration[2] / 60;
    }

    /**
     * Give the correct format to a duration string
     * @param {string} d - Duration with Velib format: 1h 54min 32sec
     */
    format_duration(d) {
        d = d.replace(/h /, "-").replace(/min /, "-").replace(/sec /, "").split("-")
        if (d.length == 1) return [0, 0, parseInt(d[0])];
        else if (d.length == 2) return [0, parseInt(d[0]), parseInt(d[1])];
        else return [parseInt(d[0]), parseInt(d[1]), parseInt(d[2])];
    }

    /**
     * Give the correct format to a date string
     * @param {string} d - Date with Velib format: 08/02/2022 - 19:47
     */
    format_date(d) {
        d = d.split("-");
        let day = d[0].split("/");
        return new Date(`${day[2]}/${day[1]}/${day[0]} ${d[1]}`);
        // let time = d[1].split(":");
        // return [parseInt(day[2]), parseInt(day[1]), parseInt(day[0]), parseInt(time[0]), parseInt(time[1])];
    }

    /**
     * Give the correct format to a velo string
     * @param {string} v - Velo with Velib format: vélo méca
     * @return {number} - 0 for a normal bike, 1 for electric
     */
    format_velo(v) {
        return v != "vélo méca";
    }
}
