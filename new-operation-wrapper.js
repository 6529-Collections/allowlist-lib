/* eslint-disable @typescript-eslint/no-var-requires */
const { exec } = require('child_process');
const fs = require('fs');
const changeCase = require('change-case');

const operationName = process.argv[2];

if (!operationName) {
  console.error('Please provide an operation name.');
  process.exit(1);
}

const operationNameConstantCase = changeCase.constantCase(operationName);

const hygenCommand = `hygen operation new --operationName ${operationName}`;

const data = fs.readFileSync(
  'src/allowlist/allowlist-operation-code.ts',
  'utf8',
);

const isOperationNameUsed = data.includes(operationNameConstantCase);
if (isOperationNameUsed) {
  console.log(`The operation name "${operationName}" is already used.`);
  process.exit(1);
}

console.log(`Executing hygen command: ${hygenCommand}`);

exec(hygenCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing hygen command: ${error.message}`);
    console.error(`Error details: ${error}`);
    return;
  }

  if (stderr) {
    console.error(`Error: ${stderr}`);
    return;
  }

  console.log(`Output: ${stdout}`);
});
