export type Item = {
    id: string;
    name: string;
    isFolder: boolean;
    items: Item[];
};

function useTraverseTree() {
    function insertNode(
        tree: Item,
        folderId: string,
        item: string,
        isFolder: boolean,
    ): Item {
        if (tree.id === folderId) {
            tree.items.unshift({
                id: new Date().getTime().toString(),
                name: item,
                isFolder,
                items: [],
            });
            return tree;
        }

        let latestNode: Item[] = [];
        latestNode = tree.items.map((obj) => {
            return insertNode(obj, folderId, item, isFolder);
        });

        return {
            ...tree,
            items: latestNode,
        };
    }

    function deleteNode(
        tree: Item,
        folderId: string,
        isFolder: boolean,
    ): Item | null  {



        if (tree.id === folderId) {
            return null;
        }


        let latestNode: Item[] = [];
        latestNode = tree.items.map((obj) => {
            return deleteNode(obj, folderId, isFolder);
        }).filter((arr)=>arr) as Item[]

        return {
            ...tree,
            items: latestNode,
        };
    }

    return {
        insertNode,
        deleteNode,
    };
}

export default useTraverseTree;
