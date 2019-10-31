module.exports = function(calendarId, recurringEventId) {
  return new Promise((resolve, reject) => {
    this.events.get(
      {
        calendarId,
        eventId: recurringEventId
      },
      (err, res) => {
        if (err) return reject(console.error(err));
        let recurringEvent = res.data;
        resolve(recurringEvent.recurrence);
      }
    );
  });
};
