module.exports = until =>
  new Date(until)
    .toISOString()
    .split("-")
    .join("")
    .split(":")
    .join("")
    .slice(0, 15) + "Z";
