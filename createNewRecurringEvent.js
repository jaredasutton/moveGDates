module.exports = function(calendarId, summary, newStart, newEnd) {
  return recurrence =>
    new Promise((resolve, reject) => {
      this.events.insert(
        {
          calendarId,
          requestBody: {
            summary,
            start: {
              dateTime: newStart,
              timeZone: "America/New_York"
            },
            end: {
              dateTime: newEnd,
              timeZone: "America/New_York"
            },
            recurrence
          }
        },
        (err, res) => {
          if (err) return reject(console.log(err));
          resolve(res);
        }
      );
    });
};
