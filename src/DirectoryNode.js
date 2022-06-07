class DirectoryNode {
    constructor(name) {
        this._name = name;
        this._path = name;
        this._children = {};
        this._parent = null;
    }

    get name() {
        return this._name;
    }

    get hasChildren() {
        return Object.keys(this._children).length > 0;
    }

    get children() {
        return Object.values(this._children);
    }

    /**
     * Sorts the directory children by name
     */
    get sortedChildren() {
        return Object.values(
            Object.fromEntries(
                Object.entries(this._children).sort(([a] = x, [b] = y) => {
                    if (a > b) {
                        return 1;
                    }
                    if (b > a) {
                        return -1;
                    }
                    return 0;
                })
            )
        )
    }

    /**
     * Creates a new directory
     * @param {string} fullName Directory full path
     * @param {string} name Directory name
     * @param {DirectoryNode} parent Parent directory
     * @returns A directory node that represents the directory
     */
    add(fullName, name = fullName, parent = this) {
        const nodeLookup = parent.lookup(name);
        let node = nodeLookup?.node;

        if (!nodeLookup || (nodeLookup && !nodeLookup.node)) {
            const newDir = new DirectoryNode(name);
            newDir._parent = parent;
            newDir._path = fullName;

            this._children[fullName] = newDir;

            node = newDir;
        }

        return node;
    }

    /**
     * Look for a directory based on its parent
     * @param {string} name Directory name
     * @param {DirectoryNode} node Node where to find
     * @returns An object with the DirectoryNode and its parent
     * {
     *      node: DirectoryNode,
     *      parent: DirectoryNode,
     * }
     */
    lookup(name, node = this) {
        for (let child of node.children) {
            if (child.name === name) {
                return  { node: child, parent: child._parent, };
            }
        }

        return null;
    }

    /**
     * Moves a directory to another directory
     * @param {DirectoryNode} targetNode Destination directory
     */
    move(targetNode) {
        const originalParent = this._parent;

        delete originalParent._children[this._path]

        this._parent = targetNode;
        targetNode._children[this._path] = this;
    }

    /**
     * Removes the directory
     */
    delete() {
        const parent = this._parent;

        delete parent._children[this._path];
    }

    /**
     * Goes through the directories and their children to print the folder structure
     * @param {DirectoryNode} node Node to iterate with its children
     * @param {string} outputStr Output string to concatenate the nested elements
     * @param {number} level Depth level to perform the indentation
     * @returns A formatted string with the folder structure, e.g.
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
    toString(node = this, outputStr = '', level = 0) {
        const children = node.sortedChildren;

        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const padding = level ? ' '.padStart(level * 2) : '';

            outputStr += `${padding}${child.name}\n`;

            if (child.hasChildren) {
                outputStr = child.toString(child, outputStr, level + 1);
            }
        }

        return outputStr;
    }
}

module.exports = DirectoryNode;