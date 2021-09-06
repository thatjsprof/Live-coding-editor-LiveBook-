import React, { useRef } from "react";
import MonacoEditor, { OnMount } from "@monaco-editor/react";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import "./code-editor.styles.css";

type WithChildren<T = {}> = T & { children?: React.ReactNode };

type CodeEditorProps = WithChildren<{
  initialValue: string;
  onChange: (value: string) => void;
}>;

const CodeEditor = ({ initialValue, onChange }: CodeEditorProps) => {
  const EditorRef = useRef<any>();

  const onEditorDidMount: OnMount = (editor, monaco) => {
    EditorRef.current = editor;
    editor.onDidChangeModelContent(() => {
      onChange(editor.getValue());
    });
    editor.getModel()?.updateOptions({ tabSize: 2 });
  };

  const formatCode = () => {
    const unformatted = EditorRef.current.getModel().getValue();
    const formatted = prettier
      .format(unformatted, {
        parser: "babel",
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, "");
    EditorRef.current.setValue(formatted);
  };

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={formatCode}
      >
        Format Code
      </button>
      <MonacoEditor
        onMount={onEditorDidMount}
        value={initialValue}
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
        theme="vs-dark"
        height="500px"
        language="javascript"
      />
    </div>
  );
};

export default CodeEditor;
