const DirectoryNode = require("../src/DirectoryNode");

describe('DirectoryNode Test Suite', () => {
    let rootDir = new DirectoryNode('/');

    beforeEach(() => {
        rootDir = new DirectoryNode('/');
    });

    it('Add directory', () => {
        // Arrange
        const spyFnAdd = jest.spyOn(rootDir, 'add');

        // Act
        rootDir.add('users');

        // Assert
        expect(rootDir.hasChildren).toEqual(true);
        expect(spyFnAdd).toHaveBeenCalledTimes(1);
    });

    it('Lookup directory', () => {
        // Arrange
        rootDir.add('users');

        // Act
        const usersNode = rootDir.lookup('users');

        // Expect
        expect(usersNode).toBeTruthy();
        expect(usersNode.node.name).toEqual('users');
        expect(usersNode.parent.name).toEqual('/');
    });

    it('Move directory', () => {
        // Arrange
        const carsNode = rootDir.add('cars');
        const motorbikesNode = rootDir.add('motorbikes');
        const vehiclesNode = rootDir.add('vehicles');

        // Act
        carsNode.move(vehiclesNode);
        motorbikesNode.move(vehiclesNode);

        // Assert
        expect(rootDir.hasChildren).toEqual(true);
        expect(vehiclesNode.children.length).toEqual(2);
    });

    it('Delete directory', () => {
        // Arrange
        const usersNode = rootDir.add('users');
        const userJonNode = usersNode.add('users/jon', 'jon');
        usersNode.add('users/jane', 'jane');
        usersNode.add('users/dave', 'dave');

        // Act
        userJonNode.delete();

        // Assert
        expect(rootDir.hasChildren).toEqual(true);
        expect(usersNode.children.length).toEqual(2);
    });

    it('Sorted directories', () => {
        // Arrange
        rootDir.add('jon');
        rootDir.add('dave');
        rootDir.add('jane');

        // Act
        const sortedElements = rootDir.sortedChildren;
        const sortedElementNames = sortedElements.map(dir => dir.name);

        // Expect
        expect(sortedElementNames).toStrictEqual([ 'dave', 'jane', 'jon', ]);
    });

    it('Folder structure outpur', () => {
        // Arrange
        const expectedOutput = [
            'lib',
            'src',
            '  config',
            '    k8s',
            'test',
        ].join('\n');

        // Act
        const srcNode = rootDir.add('src');
        rootDir.add('test');
        rootDir.add('lib');
        const configNode = srcNode.add('src/config', 'config');
        configNode.add('src/config/k8s', 'k8s');

        // Assert
        expect(expectedOutput).toStrictEqual(rootDir.toString().trim());
    });

    it('No duplicated directories', () => {
        // Act
        rootDir.add('cars');
        rootDir.add('cars');

        // Expect
        expect(rootDir.hasChildren).toEqual(true);
        expect(rootDir.children.length).toEqual(1);
    })
});