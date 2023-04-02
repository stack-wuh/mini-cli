// index.js
const vueTemplateCompiler = require("vue-template-compiler");
const fs = require("fs");

// 定义 Vue 文件路径
const vueFilePath = "./demo.vue";

// 读取 Vue 文件内容
const vueFileData = fs.readFileSync(vueFilePath, "utf8");

// 编译 Vue 文件
const vueFileCompilerResult = vueTemplateCompiler.compile(vueFileData, {
  modules: [
    // 定义插件
    {
      preTransformNode: function (el, options) {
        if (el.tag === "h1") {
          // 为 h1 标签添加自定义属性
          el.attrsList.push({ name: "test", value: "Hello, World!" });
        }
      }
    }
  ]
});

// 输出编译结果，并查看 h1 标签是否添加了自定义属性
console.log(vueFileCompilerResult);
