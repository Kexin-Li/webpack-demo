const loaderUtils = require('loader-utils');
const path = require('path');
const {
  removeComment,
  fileExistInNpm,
  getComponentDirMap,
  tranCamel2
} = require('./utils');

// 用于匹配 import { Button } from 'antd';
const IMPORT_REG = /import\s+{\s*([A-Za-z0-9,\n/\\* ]+)\s*}\s+from\s+['"](\S+)['"];?/g;

// 根据用户传入的 options 对象，匹配出 libName
function getOptionForLib(libName, options) {
  if (!libName || !options) return;
  if (options.lib === libName) {
    return options;
  }
}

function replaceImport(source, options = {}) {
  const newSource = source.replace(IMPORT_REG, function(
    org,
    importComponents,
    importFrom
  ) {
    const option = getOptionForLib(importFrom, options);
    // 如果没有配置，不做转换处理。
    if (!option) return org;

    // import { Button, Alert, Card } from 'antd';
    console.log(org);
    // Button, Alert, Card
    console.log(importComponents);
    // antd
    console.log(importFrom);
    // {lib: 'antd'}
    console.log(option);

    const {
      lib,
      libDir = 'lib', // lib dir in npm
      camel2,
      existCheck = fileExistInNpm,
      componentDirMap = getComponentDirMap(lib)
    } = option;
    // 需要导入的组件列表
    //['Button', 'Alert', 'Card']
    importComponents = removeComment(importComponents).split(',');

    console.log(importComponents);

    let ret = '';
    importComponents.map(function(componentName, index) {
      // 如果组件名称为空就直接忽略
      componentName = componentName.trim();
      if (componentName.length === 0) return;

      // 组件的入口目录路径
      let componentDirPath;
      if (typeof componentDirMap[componentName] === 'string') {
        // 如果在 map 配置了针对这个组件名称的入口目录映射，就优先采用映射
        componentDirPath = path.join(libDir, componentDirMap[componentName]);
      } else {
        componentDirPath = path.join(libDir, tranCamel2(componentName, camel2));
      }

      console.log('componentDirPath', componentDirPath);

      function injectComponent(importFrom) {
        // 当文件存在时才导入
        // 导入组件入口 JS 文件
        ret += `import ${componentName} from '${path.join(
          importFrom,
          componentDirPath
        )}';`;
      }

      if (existCheck(importFrom, componentDirPath)) {
        injectComponent(importFrom);
      }
    });

    console.log('ret', ret);
    return ret;
  });
  console.log(newSource);
  return newSource;
}

module.exports = function(source) {
  const options = loaderUtils.getOptions(this);
  return replaceImport(source, options);
};
