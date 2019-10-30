module.exports = function(calendarId, recurringEventId) {
  return new Promise((resolve, reject) => {
    this.events.get(
      {
        calendarId,
        eventId: recurringEventId
      },
      (err, res) => {
        if (err) return reject(console.error(err));
        let recurrence = res.data.recurrence[0];
        resolve(recurrence);
      }
    );
  });
};
