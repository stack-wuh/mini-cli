module.exports = {
  "root": true, // 找到这后，不再向上级目录寻找
  "env": {
    "node": true,
    "browser": true,
    "es2021": false
  },
  // 解析选项
  "parserOptions": {
      "ecmaVersion": 6, //  指定你想要使用的 ECMAScript 版本 3/5/6/7/8/9
      "sourceType": "common", // 'script'(default) or 'module'，标明你的代码是模块还是script
      "ecmaFeatures": { // 是否支持某些feature，默认均为false
          "globalReturn": true, //是否允许全局return
          'impliedStrict': true, //是否为全局严格模式
          "jsx": true
      }
  }
}