const DirectoryManager = require('./DirectoryManager');
const Utils = require('./Utils');

try {
    const directoryManager = new DirectoryManager(Utils.loadFileFromArgs().split('\n'));
    const output = directoryManager.run();

    console.log(output);

} catch (error) {
    console.error(`Error running the program > ${error.message}`, error);
}