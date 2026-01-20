try {
  module.exports = require('../../build/Release/tree_sitter_razor_binding');
} catch (e) {
  module.exports = require('../../build/Debug/tree_sitter_razor_binding');
}
