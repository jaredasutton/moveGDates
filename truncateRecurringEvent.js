/**
 * Take a calendar ID, event ID and summary for a Google Calendar
 * recurring event and return a function.
 *
 * The returned function takes an object with the desired new
 * recurrence behavior and previous recurrence behavior as
 * values and returns a Promise that makes a PATCH request
 * to the Google Calendar API to change the recurring event's
 * recurrence behavior to the desired new behavior. If the
 * request is successful, the Promise resolves with the previous
 * recurrence behavior.
 *
 * @param {string} calendarId The Google Calendar calendar ID.
 * @param {string} recurrentEventId The Google Calendar event ID.
 * @param {string} summary The Google Calendar event's summary (title).
 *
 * @param {array} newRecur The recurring event's desired new
 *   recurrence behavior.
 * @param {array} prvRecur The recurring event's previous
 *   recurrence behavior.
 *
 */

module.exports = function(calendarId, recurringEventId, summary) {
  return ({ newRecur, prvRecur }) =>
    new Promise((resolve, reject) => {
      this.events.patch(
        {
          calendarId,
          eventId: recurringEventId,
          requestBody: {
            recurrence: newRecur
          }
        },
        (err, res) => {
          if (err)
            return reject(
              console.log(`${summary} (${recurringEventId}): ERROR`, err)
            );
          console.log(
            `old recurring event: ${summary} (${recurringEventId}): ${res.status} (${res.statusText}) - ${prvRecur} --> ${newRecur} `
          );
          resolve(prvRecur);
        }
      );
    });
};
