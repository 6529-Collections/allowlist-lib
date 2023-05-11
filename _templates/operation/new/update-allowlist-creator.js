// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
const path = process.argv[2];
const operationPath = process.argv[3];
const operationName = process.argv[4];
const operationEnum = process.argv[5];

fs.readFile(path, 'utf8', (err, data) => {
  if (err) throw err;

  const importRegex =
    /\/\/ Placeholder for future imports \(please keep this comment here, it's used by the code generator\)/;

  const importAdded = data.replace(
    importRegex,
    `import { ${operationName}Operation } from './operations/${operationPath}/${operationPath}-operation';\n$&`,
  );

  const operationRegex =
    /\/\/ Placeholder for future operations \(please keep this comment here, it's used by the code generator\)/;
  const operationAdded = importAdded.replace(
    operationRegex,
    `${operationEnum}: new ${operationName}Operation(loggerFactoryImpl),\n      $&`,
  );

  fs.writeFile(path, operationAdded, 'utf8', (err) => {
    if (err) throw err;
  });
});
