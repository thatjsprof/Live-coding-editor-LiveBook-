import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localForage from "localforage";

const fileCache = localForage.createInstance({
  name: "livebookCache",
});

export const unpkgPathPlugin = (input: string) => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      // Handle root index.js file
      build.onResolve({ filter: /(^index\.js$)/ }, async (args: any) => {
        return { path: "index.js", namespace: "a" };
      });

      //   Handle relative file imports
      build.onResolve({ filter: /^\.+\// }, async (args: any) => {
        return {
          namespace: "a",
          path: new URL(`${args.path}`, `https://unpkg.com/${args.resolveDir}/`)
            .href,
        };
      });

      //   Handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          namespace: "a",
          path: `https://unpkg.com/${args.path}`,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log("onLoad", args);

        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: `
              ${input}
            `,
          };
        } else {
          // Check if we have already cached the package

          const npmPackage = await fileCache.getItem<esbuild.OnLoadResult>(
            args.path
          );

          if (npmPackage) return npmPackage;

          const { data, request } = await axios.get(args.path);

          const returnedPackage: esbuild.OnLoadResult = {
            loader: "jsx",
            contents: data,
            resolveDir: new URL("./", request.responseURL).pathname,
          };

          await fileCache.setItem(args.path, returnedPackage);

          return returnedPackage;
        }
      });
    },
  };
};
