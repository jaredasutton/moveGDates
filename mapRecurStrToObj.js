module.exports = recurrence => {
  let rules = recurrence.split(":")[1].split(";");
  return rules.reduce((acc, curr) => {
    let [key, value] = curr.split("=");
    if (key === "BYDAY") {
      value = value.split(",");
    }
    acc[key] = value;
    return acc;
  }, {});
};
