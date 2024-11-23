export const convertISODateString = (ISODate) => {
  const date = new Date(ISODate);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};
