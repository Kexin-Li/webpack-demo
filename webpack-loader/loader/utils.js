const fs = require('fs');
const path = require('path');

function resolveNodeModule(moduleName) {
  let ret = path.resolve(process.cwd(), 'node_modules', moduleName);
  if (fs.existsSync(ret)) {
    return ret;
  } else {
    ret = path.resolve(__dirname, '../../', moduleName);
    if (fs.existsSync(ret)) {
      return ret;
    }
  }
}

/**
 * 删除JS代码中的注释
 */
function removeComment(sourceCode) {
  return sourceCode.replace(/\/\/.*\n/g, '').replace(/\/\*(\s|.)*\*\//g, '');
}

/**
 * 检查文件是否存在于 node_modules 中
 */
function fileExistInNpm(moduleName, filePath) {
  const p = path.resolve(resolveNodeModule(moduleName), filePath);
  return fs.existsSync(p) || fs.existsSync(p + '.js');
}

/**
 * 从需要按需加载的npm包的根目录读取ui-component-loader.json文件作为该包的componentDirMap配置
 */
function getComponentDirMap(libName) {
  const modulePath = resolveNodeModule(libName);
  console.log('modulePath', modulePath);
  if (!modulePath) {
    return {};
  }
  const mapFilePath = path.resolve(modulePath, `ui-component-loader.json`);
  console.log('mapFilePath', mapFilePath);
  if (fs.existsSync(mapFilePath)) {
    return require(mapFilePath);
  }
  return {};
}

// 将 ComponentName 转换为 component-name | component_name
function tranCamel2(componentName, joinString) {
  if (typeof joinString === 'string') {
    return componentName
      .replace(/([a-z])([A-Z])/g, `$1${joinString}$2`)
      .toLowerCase();
  }
  return componentName;
}

module.exports = {
  removeComment,
  fileExistInNpm,
  getComponentDirMap,
  tranCamel2
};
