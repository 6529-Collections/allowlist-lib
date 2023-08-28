const fs = require('fs');
const path = require('path');

const filePath = 'src/allowlist/allowlist-operation-code.ts';
const fileContent = fs.readFileSync(filePath, 'utf8');

const regex = /AllowlistOperationCode\s*{([\s\S]*?)}/;
const match = fileContent.match(regex);

let markdownOutput = '# Allowlist Operations\n\n';

if (match && match[1]) {
  const constants = match[1]
    .split(',')
    .filter(line => line.includes('='))
    .map(line => line.trim().split(' ')[0])
    .filter(Boolean);

  const operationsInfo = {};

  constants.forEach(constant => {
    const operationName = constant.toLowerCase().replace(/_/g, '-');
    const operationFilePath = path.join('./src', 'allowlist', 'operations', operationName, `${operationName}-operation.ts`);

    if (fs.existsSync(operationFilePath)) {
      const operationContent = fs.readFileSync(operationFilePath, 'utf8');

      // Extract the doc-string description
      const docStringRegex = /\/\*\*\s*\*\s*\*(?:\s*\n\s*\*)?\s*([^*]+)\s*\*\s*\*\//;
      const docStringMatch = operationContent.match(docStringRegex);
      const docString = docStringMatch ? docStringMatch[1].trim() : 'No description found.';

      const validationRegex = /validate\(\s*params: any\s*\):.*?{([\s\S]*?)return true;/;
      const validationMatch = operationContent.match(validationRegex);

      if (validationMatch && validationMatch[1]) {
        const rawValidations = validationMatch[1]
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.startsWith('if'))
          .map(line => {
            let paramName, type, description, requirements = [];

            if (line.includes('hasOwnProperty')) {
              const paramNameMatch = line.match(/'([^']+)'/);
              if (paramNameMatch) {
                paramName = paramNameMatch[1];
                description = `Parameter "${paramName}" is required.`;
                requirements.push('Must be provided.');
              }
            } else if (line.includes('typeof')) {
              const typeMatch = line.match(/params\.([^ ]+) !== '([^']+)'/);
              if (typeMatch) {
                paramName = typeMatch[1];
                type = typeMatch[2].charAt(0).toUpperCase() + typeMatch[2].slice(1); // Convert to title case
                requirements.push(`Must be of type "${type}".`);
              }
            } else if (line.includes('.length')) {
              const lengthMatch = line.match(/params\.([^ ]+).length/);
              if (lengthMatch) {
                paramName = lengthMatch[1];
                requirements.push('Must not be empty.');
              }
            } else if (line.includes('< 0')) {
              const paramNameMatch = line.match(/params\.([^ ]+)/);
              if (paramNameMatch) {
                paramName = paramNameMatch[1];
                requirements.push('Must be non-negative.');
              }
            } else if (line.includes('% 1 !== 0')) {
              const paramNameMatch = line.match(/params\.([^ ]+)/);
              if (paramNameMatch) {
                paramName = paramNameMatch[1];
                requirements.push('Must be an integer.');
              }
            } else {
              // Handle custom validation functions or other patterns
              const customValidationMatch = line.match(/!([^ ]+)\(params\.([^ ]+)\)/);
              if (customValidationMatch) {
                const validationFunction = customValidationMatch[1];
                paramName = customValidationMatch[2].replace(/[\)]/g, '');
                requirements.push(`Must satisfy the "${validationFunction}" condition.`);
              }
            }

            return {
              paramName: paramName,
              type: type,
              description: description || `Parameter "${paramName}"`,
              requirements: requirements
            };
          })
          .filter(Boolean);

        // Group requirements by parameter name
        const groupedValidations = rawValidations.reduce((acc, validation) => {
          if (!acc[validation.paramName]) {
            acc[validation.paramName] = {
              paramName: validation.paramName,
              type: validation.type,
              description: validation.description,
              requirements: []
            };
          }
          acc[validation.paramName].requirements.push(...validation.requirements);
          acc[validation.paramName].type = acc[validation.paramName].type || validation.type;
          return acc;
        }, {});

        const validations = Object.values(groupedValidations);

        operationsInfo[constant] = {
          description: docString,
          validations: validations
        };
      }
    }
  });

  // Convert operationsInfo to Markdown format
  for (const [operation, info] of Object.entries(operationsInfo)) {
    markdownOutput += `###### ${operation}\n\n`;
    markdownOutput += `The \`${operation}\` operation ${info.description.toLowerCase()}\n\n`;
    markdownOutput += `###### Parameters\n\n`;

    info.validations.forEach(validation => {
      markdownOutput += `- **${validation.paramName} (${validation.type})**:\n`;
      markdownOutput += `  - **Description**: ${validation.description}\n`;
      markdownOutput += `  - **Requirements**:\n`;
      validation.requirements.forEach(requirement => {
        markdownOutput += `    - ${requirement}\n`;
      });
      markdownOutput += '\n';
    });
  }

  // Write the Markdown output to a file or log it to the console
  fs.writeFileSync('./docs/allowlist-operations.md', markdownOutput);
  console.log('Markdown file generated: allowlist-operations.md');
} else {
  console.log('No constants found.');
}
