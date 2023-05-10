import { useState } from "react";
import explorer from "./data/folderData";
import type { Item } from "./hooks/use-travarese-tree";
import useTraverseTree from "./hooks/use-travarese-tree";

function App() {
    const [exporerData, setExplorerData] = useState<Item>(explorer);
    const { insertNode, deleteNode } = useTraverseTree();

    function handleInsertNode(folderId: string, item: string, isFolder: boolean) {
        console.log("currentTree", exporerData);
        const finalTree = insertNode(exporerData, folderId, item, isFolder);
        console.log(finalTree);
        setExplorerData(finalTree);
    }

    function handleDeleteNode(folderId: string, isFolder: boolean) {
        console.log("currentTree:", exporerData);
        const finalTree = deleteNode(exporerData, folderId,isFolder);
        console.log("finalTree:",finalTree);
        if(!finalTree) return alert('Cannot delete root folder')
        setExplorerData(finalTree);
    }

    return (
        <main className="outline m-5 ">
            <Explorer
                explorer={exporerData}
                handleDeleteNode={handleDeleteNode}
                handleInsertNode={handleInsertNode}
            />
        </main>
    );
}

export default App;

const Explorer = ({ explorer, handleInsertNode, handleDeleteNode }: {
    explorer: Item;
    handleInsertNode: (folderId: string, item: string, isFolder: boolean) => void;
    handleDeleteNode: (folderId: string,  isFolder: boolean) => void;
}) => {
    const [isFolderExpanded, setIsFolderExpanded] = useState(false);
    const [showInput, setShowInput] = useState({
        isVisible: false,
        isFolder: false,
    });

    const handleAddFolderOrFile = (
        e: React.MouseEvent<HTMLButtonElement>,
        isFolder: boolean,
    ) => {
        e.stopPropagation();
        setShowInput({
            isVisible: true,
            isFolder,
        });
    };
    const handleDeleteFolderOrFile = (
        e: React.MouseEvent<HTMLButtonElement>,
        isFolder: boolean,
    ) => {
        e.stopPropagation();
        handleDeleteNode(explorer.id,  isFolder);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            console.log(e.currentTarget.value);
            handleInsertNode(explorer.id, e.currentTarget.value, showInput.isFolder);
            setShowInput({
                isVisible: false,
                isFolder: false,
            });
        }
        if (e.key === "Escape") {
            setShowInput({
                isVisible: false,
                isFolder: false,
            });
        }
        if (e.key === "Backspace" && e.currentTarget.value === "") {
            setShowInput({
                isVisible: false,
                isFolder: false,
            });
        }
    };

    if (explorer.isFolder) {
        return (
            <div className="border-l mt-1  ml-2.5">
                <div
                    onClick={() => setIsFolderExpanded(!isFolderExpanded)}
                    className="my-0.5 pr-2 border bg-gray-50 items-center inline-flex gap-10"
                >
                    <span className="p-1   ">
                        📁 {explorer.name}
                    </span>
                    <span className="space-x-2">
                        <button
                            onClick={(e) => handleAddFolderOrFile(e, true)}
                            className="border bg-white px-1 "
                        >
                            folder+
                        </button>
                        <button
                            onClick={(e) => handleAddFolderOrFile(e, false)}
                            className="border bg-white px-1  outline-none focus:ring-0 focus: focus:outline-none"
                        >
                            file+
                        </button>
                        <button
                            onClick={(e) => handleDeleteFolderOrFile(e, false)}
                            className="border bg-white px-1  outline-none focus:ring-0 focus: focus:outline-none"
                        >
                            X
                        </button>
                    </span>
                </div>

                {showInput.isVisible && (
                    <div>
                        <input
                            autoFocus
                            onBlur={() =>
                                setShowInput({
                                    isVisible: false,
                                    isFolder: false,
                                })}
                            onKeyDown={handleKeyDown}
                            type="text"
                            className="border px-1 "
                        />
                    </div>
                )}

                {isFolderExpanded &&
                    (
                        <div>
                            {explorer.items.map((exp) => {
                                return (
                                    <Explorer
                                        handleDeleteNode={handleDeleteNode}
                                        key={exp.id}
                                        handleInsertNode={handleInsertNode}
                                        explorer={exp}
                                    />
                                );
                            })}
                        </div>
                    )}
            </div>
        );
    } else {
        return (
            <div className="ml-5">
                <span className="p-1">
                    📄 {explorer.name}
                </span>
            </div>
        );
    }
};
