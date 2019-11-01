module.exports = function(calendarId, recurringEventId) {
  return new Promise((resolve, reject) => {
    this.events.get(
      {
        calendarId,
        eventId: recurringEventId
      },
      (err, { data }) => {
        // res.data
        if (err) return reject(console.error(err));
        // data is the recurring event
        resolve(data.recurrence);
      }
    );
  });
};
