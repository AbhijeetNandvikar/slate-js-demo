import React, { useState, useCallback, useEffect } from "react";
import { createEditor, Transforms, Editor } from "slate";
import { Slate, Editable, withReact } from "slate-react";

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
  {
    type: "heading-one",
    children: [{ text: "This is Heading 1." }],
  },
];

const HeadingOneDemo = () => {
  const [editor] = useState(() => withReact(createEditor()));

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "heading-one":
        return <h1 {...props.attributes}>{props.children}</h1>;
      default:
        return (
          <p {...props.attributes} style={{ fontSize: "20px" }}>
            {props.children}
          </p>
        );
    }
  }, []);

  const isHeading1BlockActive = (editor) => {
    const [match] = Editor.nodes(editor, {
      match: (n) => {
        return n.type === "heading-one";
      },
    });
    return !!match;
  };

  const toggleHeading1Block = () => {
    const isActive = isHeading1BlockActive(editor);
    Transforms.setNodes(editor, {
      type: isActive ? "paragraph" : "heading-one",
      match: (n) => Editor.isBlock(editor, n),
    });
  };

  return (
    <div
      style={{
        padding: "12px",
        background: "white",
        width: "100%",
        height: "100vh",
      }}
    >
      <button
        style={{
          padding: "4px",
          background: "white",
          border: "1px solid black",
          borderRadius: "4px",
        }}
        onClick={() => {
          toggleHeading1Block(editor);
        }}
      >
        H1
      </button>
      <Slate editor={editor} value={initialValue}>
        <Editable renderElement={renderElement} />
      </Slate>
    </div>
  );
};
export default HeadingOneDemo;
