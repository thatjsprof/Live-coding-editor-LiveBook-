import * as esBuild from "esbuild-wasm";
import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetchPlugin";

const App = () => {
  const Ref = useRef<any>();
  const IframeRef = useRef<any>("");
  const [input, setInput] = useState("");

  const onClick = async () => {
    if (!Ref.current) return;
    const result = await Ref.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
    });

    IframeRef.current.srcdoc = html

    IframeRef.current.contentWindow.postMessage(
      result.outputFiles[0].text,
      "*"
    );
  };

  const html = `
  <html>
    <head></head>
    <body>
      <div id="root"></div>
      <script>
        window.addEventListener('message', (event) => {
          try {
            eval(event.data)
          } catch (err) {
            document.querySelector('#root').innerHTML = '<div style="color: red;"><h4>Runtime Error:</h4>' + err + '</div>';
            console.err(err);
          }
        }, false)
       </script>
    </body>
  </html>
  `;

  const startService = async () => {
    Ref.current = await esBuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
  };

  useEffect(() => {
    startService();
  }, []);

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <iframe title="preview" ref={IframeRef} srcDoc={html} sandbox="allow-scripts"></iframe>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
