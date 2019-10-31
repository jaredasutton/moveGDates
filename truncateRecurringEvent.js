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
