import React, { useState, useCallback, useEffect } from "react";
import { createEditor, Transforms, Editor } from "slate";
import { Slate, Editable, withReact } from "slate-react";

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "Our editor is ready." }],
  },
  {
    type: "paragraph",
    children: [{ text: "Start typing..." }],
  },
];

const BasicDemo = () => {
  const [editor] = useState(() => withReact(createEditor()));

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      default:
        return (
          <p {...props.attributes} style={{ fontSize: "20px" }}>
            {props.children}
          </p>
        );
    }
  }, []);

  return (
    <div
      style={{
        padding: "12px",
        background: "white",
        width: "100%",
        height: "100vh",
      }}
    >
      <Slate editor={editor} value={initialValue}>
        <Editable renderElement={renderElement} />
      </Slate>
    </div>
  );
};
export default BasicDemo;
