Date.prototype.toIsoString = function() {
  let tzo = -this.getTimezoneOffset();
  let dif = tzo >= 0 ? "+" : "-";
  let pad = function(num) {
    let norm = Math.floor(Math.abs(num));
    return (norm < 10 ? "0" : "") + norm;
  };
  return (
    this.getFullYear() +
    "-" +
    pad(this.getMonth() + 1) +
    "-" +
    pad(this.getDate()) +
    "T" +
    pad(this.getHours()) +
    ":" +
    pad(this.getMinutes()) +
    ":" +
    pad(this.getSeconds()) +
    dif +
    pad(tzo / 60) +
    ":" +
    pad(tzo % 60)
  );
};

module.exports = (dateString, { minutes = 0, hours = 0, days = 0 }) => {
  let date = new Date(dateString);

  date.setMinutes(date.getMinutes() + minutes);
  date.setHours(date.getHours() + hours);
  date.setDate(date.getDate() + days);
  return date.toIsoString();
};
