function parseDurasi(durasi) {
  /*
    "2 Jam" -> 2
    "10 Jam" -> 10
  */

  const jam = parseInt(durasi);

  return isNaN(jam) ? 1 : jam;
}

function timeToMinutes(time) {
  const [hour, minute] = time.split(":").map(Number);

  return hour * 60 + minute;
}

function minutesToTime(minutes) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
}

module.exports = {
  parseDurasi,
  timeToMinutes,
  minutesToTime,
};
