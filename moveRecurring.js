const getCalendar = require("./getCalendar.js");
const moveDateNDays = require("./moveDateNDays.js");

module.exports = (options, movement) => {
  //console.log(options);
  let recurringRoster = {};
  getCalendar().then(cal => {
    cal.events.list(options, (err, { data }) => {
      if (err) return console.log("The API returned an error: " + err);
      const events = data.items;
      let eventsStr = "[";
      if (events.length) {
        events.forEach((event, i) => {
          if (
            event.start &&
            event.start.dateTime &&
            event.recurringEventId &&
            !recurringRoster[event.recurringEventId]
          ) {
            const start = event.start.dateTime;
            const end = event.end.dateTime || event.end.date;
            //console.log(`${start} - ${end} -- ${event.summary}`);
            eventsStr +=
              JSON.stringify(event) + (i === events.length - 1 ? "\n" : ",\n");
            if (movement) {
              let newStart = moveDateNDays(start, movement);
              let newEnd = moveDateNDays(end, movement);
              let until = moveDateNDays(start, -1);
              let newUntil =
                new Date(until)
                  .toISOString()
                  .split("-")
                  .join("")
                  .split(":")
                  .join("")
                  .slice(0, 15) + "Z";
              //console.log(event);
              //console.log(` -› moved to ${newStart} - ${newEnd}`);
              //console.log(`newUntil: ${newUntil}`);
              //console.log("recurringEventId: " + event.recurringEventId);
              recurringRoster[event.recurringEventId] = true;
              cal.events.get(
                {
                  calendarId: options.calendarId,
                  eventId: event.recurringEventId
                },
                (err, res) => {
                  if (err) return console.error(err);
                  let recurrence = res.data.recurrence[0];
                  cal.events.patch(
                    {
                      calendarId: options.calendarId,
                      eventId: event.recurringEventId,
                      requestBody: {
                        recurrence: [recurrence + `;UNTIL=${newUntil}`]
                      }
                    },
                    (err, res) => {
                      if (err)
                        return console.log(
                          `${event.summary} (${event.id}): ERROR`,
                          err
                        );
                      console.log(
                        `old recurring event: ${event.summary} (${event.id}): ${res.status} (${res.statusText}) - ${recurrence}`
                      );
                      cal.events.insert(
                        {
                          calendarId: options.calendarId,
                          requestBody: {
                            summary: event.summary,
                            start: {
                              dateTime: newStart,
                              timeZone: "America/New_York"
                            },
                            end: {
                              dateTime: newEnd,
                              timeZone: "America/New_York"
                            },
                            recurrence: [recurrence]
                          }
                        },
                        (err, res) => {
                          if (err) console.log(err);
                          else console.log(res);
                        }
                      );
                    }
                  );
                }
              );
            } else {
              console.log("recurringEventId: " + event.recurringEventId);
              cal.events.get(
                {
                  calendarId: options.calendarId,
                  eventId: event.recurringEventId
                },
                (err, res) => {
                  if (err) return console.error(err);
                  console.log(res.data);
                }
              );
            }
          }
        });
      } else {
        console.log("No upcoming events found.");
      }
      eventsStr += "]";
      let fileContents = `{
        "options": ${JSON.stringify(options)},
        "date": ${JSON.stringify(new Date())},
        "events": ${eventsStr}
      }`;
      fs.writeFile(
        path.resolve(__dirname, "./logs/recurringEvents.json"),
        fileContents,
        err => {
          if (err) console.error(err);
        }
      );
    });
  });
};
