// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
const path = process.argv[2];
const operationName = process.argv[3];

fs.readFile(path, 'utf8', (err, data) => {
  if (err) throw err;
  const regex =
    /\/\/ Placeholder for future operations \(please keep this comment here, it's used by the code generator\)/;
  const newData = data.replace(
    regex,
    `${operationName} = '${operationName}',\n  $&`,
  );
  fs.writeFile(path, newData, 'utf8', (err) => {
    if (err) throw err;
  });
});
