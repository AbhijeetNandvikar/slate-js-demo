// Import React dependencies.
import React, { useEffect, useRef, useState } from "react";

import ReactDOM from "react-dom";
// Import the Slate editor factory.
import { createEditor, Editor, Node, Transforms } from "slate";

// Import the Slate components and React plugin.
import { Slate, Editable, withReact, ReactEditor } from "slate-react";

const commandOptions = [
  "icd-codes",
  "heading-one",
  "heading-two",
  "heading-three",
];

const IcdCodeInput = (props, editor) => {
  const [value, setValue] = useState("");
  const [IcdCodes, setIcdCodes] = useState([]);
  useEffect(() => {
    Transforms.setNodes(editor, { type: "code", data: [...IcdCodes] });
  }, [IcdCodes, editor]);

  return (
    <div {...props.attributes}>
      <div
        style={{
          background: "#1e1e1ed6",
          padding: "12px",
          borderRadius: "8px",
        }}
        contentEditable={false}
      >
        <h2 style={{ color: "white", margin: "0px" }}>Enter ICD Codes: </h2>
        <input
          type="text"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
          style={{
            border: "1px solid black",
            borderRadius: "5px",
          }}
        />{" "}
        <button
          onClick={() => {
            setIcdCodes([...IcdCodes, value]);
            setValue("");
          }}
        >
          Add ICD codes
        </button>
        {IcdCodes.map((code, index) => {
          return (
            <div
              key={index}
              style={{ color: "white" }}
              onClick={() => {
                setIcdCodes(IcdCodes.filter((c) => c !== code));
              }}
            >
              {code}
            </div>
          );
        })}
      </div>
      {props.children}
    </div>
  );
};

const HeadingOneBlock = ({ attributes, children }) => {
  return <h1 {...attributes}>{children}</h1>;
};

const HeadingTwoBlock = ({ attributes, children }) => {
  return <h2 {...attributes}>{children}</h2>;
};

const HeadingThreeBlock = ({ attributes, children }) => {
  return <h3 {...attributes}>{children}</h3>;
};

export const Portal = ({ children }) => {
  return typeof document === "object"
    ? ReactDOM.createPortal(children, document.body)
    : null;
};

const ClinicalCodesExample = () => {
  const ref = useRef();
  const [target, setTarget] = useState();
  const [commandIndex, setCommandIndex] = useState(0);
  const [commandSearch, setCommandSearch] = useState("");
  const [showCommandMenu, setShowcommandMenu] = useState(false);

  const [editor] = useState(() => withReact(createEditor()));
  const [commandList, setCommandList] = useState([]);

  const [commandMode, setCommandMode] = useState(false);

  const initialValue = [
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }],
    },
  ];

  useEffect(() => {
    if (target && commandList.length > 0) {
      const el = ref.current;
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      el.style.top = `${rect.top + 24}px`;
      el.style.left = `${rect.left}px`;
    }
  }, [commandList.length, editor, commandIndex, commandSearch, target]);

  useEffect(() => {
    const newCommandList = commandOptions.filter((command) => {
      return command.toLowerCase().includes(commandSearch.toLowerCase());
    });
    setCommandList(newCommandList);
  }, [commandSearch]);

  const editorChangeHandler = (value) => {
    const { selection, children } = editor;
    if (commandMode) {
      const currentNode = Node.get(editor, selection.anchor.path);
      setTarget(selection);
      const currentText = currentNode.text;
      const searchText = currentText.split("/")[1];
      setCommandSearch(searchText ?? "");
    }
  };

  const renderElement = (props) => {
    switch (props.element.type) {
      case "icd-codes":
        return <IcdCodeInput {...props} editor={editor} />;
      case "heading-one":
        return <HeadingOneBlock {...props} />;
      case "heading-two":
        return <HeadingTwoBlock {...props} />;
      case "heading-three":
        return <HeadingThreeBlock {...props} />;
      default:
        return <p {...props.attributes}>{props.children}</p>;
    }
  };

  const executeCommand = (event) => {
    switch (commandOptions[commandIndex]) {
      case "icd-codes": {
        Editor.deleteBackward(editor, { unit: "character" });
        Transforms.setNodes(editor, {
          type: "icd-codes",
          children: [{ text: "" }],
          at: editor.selection,
        });

        break;
      }
      case "heading-one": {
        Editor.deleteBackward(editor, { unit: "character" });
        Transforms.setNodes(editor, {
          type: "heading-one",
          children: [{ text: "" }],
          at: editor.selection,
        });
        break;
      }
      case "heading-two": {
        Editor.deleteBackward(editor, { unit: "character" });
        Transforms.setNodes(editor, {
          type: "heading-two",
          children: [{ text: "" }],
          at: editor.selection,
        });
        break;
      }
      case "heading-three": {
        Editor.deleteBackward(editor, { unit: "character" });
        Transforms.setNodes(editor, {
          type: "heading-three",
          children: [{ text: "" }],
          at: editor.selection,
        });
        break;
      }
      default: {
        event.preventDefault();
      }
    }
  };

  const onKeyDownHandler = (event) => {
    if (event.key === "/") {
      setShowcommandMenu(true);
      setCommandMode(true);
      setCommandList(commandOptions);
    } else if (event.key === "Escape") {
      setShowcommandMenu(false);
      setCommandMode(false);
      setCommandList([]);
      setTarget();
    } else if (commandMode && event.key === "ArrowDown") {
      event.preventDefault();
      setCommandIndex(commandIndex + 1);
    } else if (commandMode && event.key === "ArrowUp") {
      event.preventDefault();
      setCommandIndex(commandIndex - 1);
    } else if (
      commandMode &&
      event.key.length === 1 &&
      /[a-z]/.test(event.key)
    ) {
      if (commandList.length === 0) {
        setShowcommandMenu(false);
        setCommandMode(false);
        setTarget();
      }
    } else if (commandMode && event.key === "Enter") {
      event.preventDefault();
      setShowcommandMenu(false);
      setCommandMode(false);
      setTarget();
      executeCommand(event);
    } else if (event.key === "Enter") {
      event.preventDefault();
      Editor.insertNode(editor, {
        type: "paragraph",
        children: [{ text: "" }],
      });
    }
  };

  return (
    <div style={{ background: "white", padding: 12 }}>
      <Slate
        editor={editor}
        value={initialValue}
        onChange={editorChangeHandler}
      >
        <Editable renderElement={renderElement} onKeyDown={onKeyDownHandler} />
        {showCommandMenu && (
          <Portal>
            <div
              style={{
                position: "absolute",
                zIndex: 1,
                padding: "3px",
                background: "white",
                borderRadius: "4px",
                boxShadow: "0 1px 5px rgba(0,0,0,.2)",
              }}
              ref={ref}
            >
              {commandList.map((command, i) => {
                return (
                  <div
                    key={i}
                    style={
                      i === commandIndex
                        ? { background: "blue", color: "white" }
                        : {}
                    }
                    onClick={() => {
                      Transforms.setNodes(editor, { type: command });
                    }}
                  >
                    {command}
                  </div>
                );
              })}
            </div>
          </Portal>
        )}
      </Slate>
    </div>
  );
};

export default ClinicalCodesExample;
