const getCalendar = require("./getCalendar.js");
const moveDateNDays = require("./moveDateNDays.js");

module.exports = (options, movement) => {
  getCalendar.then(cal => {
    cal.events.list(options, (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const events = res.data.items;
      let eventsStr = "[";
      if (events.length) {
        console.log(`Upcoming ${events.length} events:`);
        events.forEach((event, i) => {
          if (event.start.dateTime) {
            const start = event.start.dateTime || event.start.date;
            const end = event.end.dateTime || event.end.date;
            console.log(`${start} - ${end} -- ${event.summary}`);
            eventsStr +=
              JSON.stringify(event) + (i === events.length - 1 ? "" : ",");
            if (movement) {
              let newStart = moveDateNDays(start, movement);
              let newEnd = moveDateNDays(end, movement);
              console.log(` -› moved to ${newStart} - ${newEnd}`);
              cal.events.patch(
                {
                  calendarId: options.calendarId,
                  eventId: event.id,
                  requestBody: {
                    start: { dateTime: newStart },
                    end: { dateTime: newEnd }
                  }
                },
                (err, res) => {
                  if (err)
                    console.log(`${event.summary} (${event.id}): ERROR`, err);
                  console.log(
                    `${event.summary} (${event.id}): ${res.status} (${res.statusText})`
                  );
                }
              );
            }
          }
        });
      } else {
        console.log("No upcoming events found.");
      }
      eventsStr += "]";
      fs.writeFile(path.resolve(__dirname, "./events.json"), eventsStr, err => {
        if (err) console.error(err);
      });
    });
  });
};
