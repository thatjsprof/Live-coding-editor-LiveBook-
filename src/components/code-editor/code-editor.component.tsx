import React from "react";
import MonacoEditor from "@monaco-editor/react";

type WithChildren<T = {}> = T & { children?: React.ReactNode };

type CodeEditorProps = WithChildren<{
  initialValue: string;
  onChange: (value: string) => void;
}>;

const CodeEditor = ({ initialValue }: CodeEditorProps) => {
  return (
    <MonacoEditor
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
    ></MonacoEditor>
  );
};

export default CodeEditor;
