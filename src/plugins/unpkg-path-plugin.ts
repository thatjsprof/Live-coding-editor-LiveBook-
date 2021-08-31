import * as esbuild from "esbuild-wasm";

export const unpkgPathPlugin = () => {
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
    },
  };
};
