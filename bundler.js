const fs = require('fs');
const path = require('path');
const babylon = require('babylon');
const babel = require('babel-core');
const traverse = require('babel-traverse').default;
const entryFile = process.argv[2];

let ID = 0;

function createAsset(fileName) {
  const content = fs.readFileSync(fileName, 'utf-8');
  const ast = babylon.parse(content, {
    sourceType: 'module'
  });

  const dependencies = [];

  traverse(ast, {
    ImportDeclaration: ({node}) => {
      dependencies.push(node.source.value);
    }
  });

  const id = ID++;

  const {code} = babel.transformFromAst(ast, [], {
    presets: ['env']
  });

  return {
    id,
    fileName,
    dependencies,
    code
  };
}

function createGraph(entry) {
  const mainAsset = createAsset(entry);

  const queue = [mainAsset];

  for (const asset of queue) {
    asset.mapping = {};

    const dirname = path.dirname(asset.fileName);

    asset.dependencies.forEach(relativePath => {
      const absolutePath = path.join(dirname, relativePath);
      const child = createAsset(absolutePath);
      asset.mapping[relativePath] = child.id;

      queue.push(child);
    });
  }

  return queue;
}

function bundle(graph) {
  let modules = '';

  graph.forEach(module => {
    modules += `${module.id}: [
      function (require, module, exports) { ${module.code} },
      ${JSON.stringify(module.mapping)}
    ],`;
  });

  const result = `
    (function(modules) {
      function require(id) {
        const [fn, mapping] = modules[id];

        function localRequire(relativePath) {
          return require(mapping[relativePath]);
        }

        const module = { exports: {} };

        fn(localRequire, module, module.exports);

        return module.exports;
      }

      require(0);
    })({${modules}})
  `;

  return result;
}

function createResultedFile(fileContent) {
  process.chdir('./app');
  fs.writeFile('bundle.js', fileContent, onError);
}

function onError(err) {
  if (err) {
    throw err;
  }
}

const graph = createGraph(entryFile);
const result = bundle(graph);
createResultedFile(result);
