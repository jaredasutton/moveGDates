/**
 * Take a string that specifies the recurrence behavior for a
 * Google Calendar recurring event and convert it to an object
 * with the various recurrence rules delineated as key-value pairs.
 * @param {string} recurrence The recurrence string,
 *   e.g. "RRULE:FREQ=WEEKLY;WKST=MO;UNTIL=20191209T170000Z;BYDAY=SA,TH,TU"
 *         => {
 *              FREQ:"WEEKLY",
 *              WKST:"MO",
 *              UNTIL:"20191209T170000Z",
 *              BYDAY:["SA","TH","TU"]
 *            }
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
