/**
 * Take a string that specifies the recurrence behavior for a
 * Google Calendar recurring event and converts it to an object
 * with the various recurrence rules delineated as key-value pairs.
 * @param {string} recurrence The recurrence string.
 */
module.exports = recurrence => {
  let rules = recurrence.split(":")[1].split(";");
  return rules.reduce((acc, curr) => {
    let [key, value] = curr.split("=");
    if (key === "BYDAY") {
      value = value.split(",");
    }
    acc[key] = value;
    return acc;
  }, {});
};
