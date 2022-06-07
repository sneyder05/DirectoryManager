const fs = require('fs');

/**
 * Loads the file contents given a path file in the incoming arguments,
 * otherwise throws an exception if there is not an argument or the given path is invalid
 * @returns The file contents
 */
 const loadFileFromArgs = () => {
    const [ ,, commandsFilePath, ] = process.argv;

    // Validate if the file path is present
    if (!commandsFilePath) {
        throw new Error('A commands file argument is required, try running "node index.js path/to/the/file".');
    }

    // Validate if the given path exists
    if (!fs.existsSync(commandsFilePath)) {
        throw new Error(`File '${commandsFilePath}' does not exist.`)
    }

    return fs.readFileSync(commandsFilePath, 'utf-8').trim();
}

module.exports = {
    loadFileFromArgs,
}