module.exports = function(calendarId, recurringEventId, newUntil, summary) {
  return recurrence =>
    new Promise((resolve, reject) => {
      this.events.patch(
        {
          calendarId,
          eventId: recurringEventId,
          requestBody: {
            recurrence: [recurrence + `;UNTIL=${newUntil}`]
          }
        },
        (err, res) => {
          if (err)
            return reject(
              console.log(`${summary} (${recurringEventId}): ERROR`, err)
            );
          console.log(
            `old recurring event: ${summary} (${recurringEventId}): ${res.status} (${res.statusText}) - ${recurrence}`
          );
          resolve(recurrence);
        }
      );
    });
};
