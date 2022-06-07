const DirectoryManager = require("../src/DirectoryManager");

describe.only('DirectoryManager Test Suite', () => {
    it('Exclude invalid commands', () => {
        // Arrange
        const expectedValidCmds = [
            'CREATE folder1',
            'LIST',
        ];

        // Act
        const manager = new DirectoryManager([
            ...expectedValidCmds,
            'COPY folder1 folder2'
        ]);

        // Assert
        expect(manager._commands.length).toEqual(2);
        expect(manager._commands).toStrictEqual(expectedValidCmds);
    });

    it('Exclude commented commands', () => {
        // Arrange
        const expectedCmds = [
            'CREATE folder1',
            'CREATE folder2',
            'LIST'
        ];

        const commandsWithComments = [ ...expectedCmds, ];
        commandsWithComments.splice(1, 0, '#LIST');

        // Act
        const manager = new DirectoryManager(commandsWithComments);

        // Assert
        expect(manager._commands.length).toEqual(3);
        expect(manager._commands).toStrictEqual(expectedCmds);
    });

    it('No commands to run', () => {
        // Arrange
        const NoCommandsToRunMsg = 'No commands to run, bye...';
        const manager = new DirectoryManager();

        // Act
        const output = manager.run();

        // Assert
        expect(output).toEqual(NoCommandsToRunMsg);
    });

    it('Run CREATE', () => {
        // Arrange
        const commands = [
            'CREATE src',
            'CREATE src/app',
            'LIST'
        ];
        const manager = new DirectoryManager(commands);
        const expectedOutput = [
            ...commands,
            'src',
            '  app',
        ].join('\n');

        // Act
        const output = manager.run();

        // Assert
        expect(output).toStrictEqual(expectedOutput);
    });

    it('Run MOVE', () => {
        // Arrange
        const commands = [
            'CREATE src',
            'CREATE app',
            'CREATE modules',
            'MOVE app src',
            'MOVE modules src/app',
            'LIST'
        ];
        const manager = new DirectoryManager(commands);
        const expectedOutput = [
            ...commands,
            'src',
            '  app',
            '    modules'
        ].join('\n');

        // Act
        const output = manager.run();

        // Assert
        expect(output).toStrictEqual(expectedOutput);
    });

    it('Run DELETE', () => {
        // Arrange
        const commands = [
            'CREATE src',
            'CREATE coverage',
            'CREATE lib',
            'CREATE lib/modules',
            'DELETE coverage',
            'DELETE lib/modules',
            'LIST'
        ];
        const manager = new DirectoryManager(commands);
        const expectedOutput = [
            ...commands,
            'lib',
            'src',
        ].join('\n');

        // Act
        const output = manager.run();

        // Assert
        expect(output).toStrictEqual(expectedOutput);
    });

    it('Run DELETE on a non-existent directory', () => {
        // Arrange
        const commands = [
            'CREATE src',
            'CREATE lib',
            'DELETE tests',
        ];
        const manager = new DirectoryManager(commands);
        const expectedOutput = [
            ...commands,
            'Cannot delete tests - tests does not exist',
        ].join('\n');

        // Act
        const output = manager.run();

        // Assert
        expect(output).toStrictEqual(expectedOutput);
    });
});