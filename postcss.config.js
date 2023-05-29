import postcssImport from "postcss-import";
import postcssMixins from "postcss-mixins";
import postcssNested from "postcss-nested";

export default (ctx) => ({
  plugins: [postcssImport, postcssMixins, postcssNested],
});
