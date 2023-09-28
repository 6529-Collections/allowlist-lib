## Adding a New Operation

1. Run the following command in your terminal, <strong>replacing MyAwesomeItem</strong> with the desired name for your new operation. 
<br>
The name should be in <strong>PascalCase</strong> (also known as UpperCamelCase):
<br>
<code>yarn new-operation MyAwesomeItem</code>

This command will create a boilerplate folder and files in `src/allowlist/operations`. The generated files include:

    - A types file, which defines the types required for the new operation.
    - An operation file, which contains the implementation of the new operation.
    - A test file, which includes test cases for the new operation.

The script will automatically add the new operation to the `enum AllowlistOperationCode`.

The script will also add the new operation to the `class AllowlistCreator`.

After running the `yarn new-operation` command, you can start implementing your new operation by modifying the generated files. 
<br>
Make sure to write appropriate test cases in the test file to ensure the correct functioning of your operation.