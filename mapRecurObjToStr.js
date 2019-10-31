module.exports = recurObj => {
  return Object.entries(recurObj).reduce((acc, [k, v]) => {
    if (k === "BYDAY") v = v.join(",");
    return `${acc}${k}=${v};`;
  }, "RRULE:");
};
