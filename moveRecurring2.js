const getCalendar = require("./getCalendar.js");
const moveDateNDays = require("./moveDateNDays.js");
let getEventRecurrenceByREId = require("./getEventRecurrenceByREId.js");
let truncateRecurringEvent = require("./truncateRecurringEvent.js");
let createNewRecurringEvent = require("./createNewRecurringEvent.js");
let getEventsByOptions = require("./getEventsByOptions.js");
const convertDateToRFC5545String = require("./convertDateToRFC5545String.js");

module.exports = (options, movement) => {
  let { calendarId } = options;
  let recurringRoster = {};
  let recurringEvents = [];
  getCalendar().then(cal => {
    getEventRecurrenceByREId = getEventRecurrenceByREId.bind(cal, calendarId);
    truncateRecurringEvent = truncateRecurringEvent.bind(cal, calendarId);
    createNewRecurringEvent = createNewRecurringEvent.bind(cal, calendarId);
    getEventsByOptions = getEventsByOptions.bind(cal);

    getEventsByOptions(options).then(events => {
      if (events.length < 1) {
        return console.log("No upcoming events found.");
      }
      events.forEach(event => {
        if (
          event.start &&
          event.start.dateTime &&
          event.recurringEventId &&
          !recurringRoster[event.recurringEventId]
        ) {
          recurringEvents.push(event);
          const start = event.start.dateTime;
          const end = event.end.dateTime || event.end.date;
          const recurringEventId = event.recurringEventId;

          recurringRoster[recurringEventId] = true;
          let gotEventRecurrence = getEventRecurrenceByREId(recurringEventId);

          if (movement) {
            let newStart = moveDateNDays(start, movement);
            let newEnd = moveDateNDays(end, movement);
            let until = moveDateNDays(start, -1);
            let newUntil = convertDateToRFC5545String(until);

            gotEventRecurrence
              .then(truncateRecurringEvent(recurringEventId, newUntil, summary))
              .then(createNewRecurringEvent(summary, newStart, newEnd));
          } else {
            gotEventRecurrence.then(console.log);
          }
        }
      });

      let fileContents = `{
        "options": ${JSON.stringify(options)},
        "date": ${JSON.stringify(new Date())},
        "events": ${JSON.stringify(recurringEvents)}
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
