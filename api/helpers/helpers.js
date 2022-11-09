const addMinutes = (minutes, date = new Date()) => {
  return new Date(date.setMinutes(date.getMinutes() + minutes));
};
const createAndFormatDate = (date = new Date()) => {
  return new Date(date.toISOString()).toJSON().slice(0, 19).replace('T', ' ');
};

const createIsoDate = (date = new Date()) => {
  return new Date(date.toISOString());
};

module.exports = { addMinutes, createAndFormatDate, createIsoDate };
