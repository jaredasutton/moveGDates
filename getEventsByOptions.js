module.exports = function(options) {
  return new Promise((resolve, reject) => {
    this.events.list(options, (err, { data }) => {
      if (err) return reject(console.log("The API returned an error: " + err));
      resolve(data.items);
    });
  });
};
