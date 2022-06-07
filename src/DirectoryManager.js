const DirectoryNode = require("./DirectoryNode");

class DirectoryManager {
    AVAILABLE_COMMANDS = {
        Create: 'CREATE',
        List: 'LIST',
        Move: 'MOVE',
        Delete: 'DELETE',
    };

    AVAILABLE_COMMAND_NAMES = Object.values(this.AVAILABLE_COMMANDS);

    constructor (commands = []) {
        this._commands = this.getRunnableCommands(commands);
        this._directoryTree = {};
        this._rootDirectory = new DirectoryNode('/');
    }

    /**
     * Filters the given commands to grab just the allowed them.
     * @param {Array} commands List of full commands to be executed
     * @returns An allowed list of available full commands
     */
    getRunnableCommands(commands = []) {
        return commands.filter(commandLine => {
            // Extract the command key word from the entire command
            const [ command, ] = commandLine.trim().split(' ');

            return this.AVAILABLE_COMMAND_NAMES.includes(command) && command[0] !== '#';
        });
    }

    /**
     * Iterates the commands and trigger their execution
     * @returns The output from each executed command concatenated into a single string
     */
    run() {
        if (this._commands.length) {
            return this._commands.map(commandLine => {
                const [ command, directoryPath = null, targetPath = null, ] = commandLine.trim().split(' ');
                return this.exec(command, directoryPath, targetPath);
            }).join('\n');
        }

        return 'No commands to run, bye...';
    }

    /**
     * Executes a given command and passes the needed arguments to its function.
     * @param {string} command The command to execute
     * @param {string|null} directoryPath The initial directories path where the command will be executed on
     * @param {string|null} targetPath The final directories path where the command will be executed on
     * @returns The output from the execute command. Commands "LIST" and "DELETE" may return extra information.
     */
    exec(command, directoryPath = null, targetPath = null) {
        switch (command) {
            case this.AVAILABLE_COMMANDS.Create:
                return this.create(directoryPath);
            case this.AVAILABLE_COMMANDS.Move:
                return this.move(directoryPath, targetPath);
            case this.AVAILABLE_COMMANDS.Delete:
                return this.delete(directoryPath);
            case this.AVAILABLE_COMMANDS.List:
            default:
                return this.list();
        }
    }

    /**
     * Creates a new directory entry
     * @param {string} directoryPath The directory to create
     * @returns The result of the executed command following the template 'CREATE {dir}'
     */
    create(directoryPath) {
        const directories = directoryPath.split('/');

        if (directories.length === 1) {
            this._rootDirectory.add(directoryPath, directories[0]);
        } else {
            directories.reduce((parent, newDir) => {
                return parent?.add(directoryPath, newDir, parent);
            }, this._rootDirectory);
        }

        return `${this.AVAILABLE_COMMANDS.Create} ${directoryPath}`;
    }


    /**
     * Goes through all directories and their children to get the folder structure
     * @returns All directories sorted by name, e.g.
     * foods
     *   grains
     *     peas
     *     beans
     *   fruits
     *     apples
     *     mangoes
     * recipes
     *   vegetarian
     * drinks
     */
    list() {
        return `${this.AVAILABLE_COMMANDS.List}\n${this.toString()}`;
    }

    /**
     * Moves a directory to another directory
     * @param {string} sourcePath Source path
     * @param {string} destPath Destination path
     * @returns The result of the executed command following the template 'MOVE {source} {destination}'
     */
    move(sourcePath, destPath) {
        const lookupDir = (dirSet = []) => {
            return dirSet.length === 1 ?
                this._rootDirectory.lookup(dirSet[0])?.node :
                dirSet.reduce((parent, dir) => {
                    return parent?.lookup(dir)?.node;
                }, this._rootDirectory)
        }

        const sourceDir = lookupDir(sourcePath.split('/'));
        const destDir = lookupDir(destPath.split('/'));

        sourceDir.move(destDir);

        return `${this.AVAILABLE_COMMANDS.Move} ${sourcePath} ${destPath}`;
    }

    /**
     * Removes a given directory
     * @param {string} directoryPath Directory to remove
     * @returns The result of the executed command following the template 'MOVE {source} {destination}'
     */
    delete(directoryPath) {
        const directories = directoryPath.split('/');
        let parent = this._rootDirectory;
        let currentLookupDir;
        let targetDir;

        for (let i = 0; i < directories.length; i++) {
            currentLookupDir = directories[i];

            const lookupNode = parent.lookup(currentLookupDir);

            if (lookupNode) {
                parent = lookupNode.node;
                targetDir = lookupNode.node;
            } else {
                targetDir = null;

                break;
            }
        }

        let output = `${this.AVAILABLE_COMMANDS.Delete} ${directoryPath}`;

        if (targetDir) {
            targetDir.delete();
        } else {
            output += `\nCannot delete ${directoryPath} - ${currentLookupDir} does not exist`;
        }

        return output;
    }

    toString() {
        return this._rootDirectory.toString().trim();
    }
}

module.exports = DirectoryManager;