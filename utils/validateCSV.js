const validateCSVRow = (row) => {
  return (
    row.Name &&
    row.Email &&
    row.Source &&
    row.Date &&
    row.Location &&
    row.Language
  );
};

module.exports = { validateCSVRow };
