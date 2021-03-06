"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = _interopRequireDefault(require("path"));

var _rss = _interopRequireDefault(require("rss"));

var _lodash = _interopRequireDefault(require("lodash.merge"));

var _internals = require("./internals");

var _pluginOptions = _interopRequireDefault(require("./plugin-options"));

function _createForOfIteratorHelperLoose(o) { var i = 0; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } i = o[Symbol.iterator](); return i.next.bind(i); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var publicPath = "./public";

var warnMessage = function warnMessage(error, behavior) {
  return "\n  gatsby-plugin-feed was initialized in gatsby-config.js without a " + error + ".\n  This means that the plugin will use " + behavior + ", which may not match your use case.\n  This behavior will be removed in the next major release of gatsby-plugin-feed.\n  For more info, check out: https://gatsby.dev/adding-rss-feed\n";
}; // TODO: remove in the next major release
// A default function to transform query data into feed entries.


var serialize = function serialize(_ref) {
  var _ref$query = _ref.query,
      site = _ref$query.site,
      allMarkdownRemark = _ref$query.allMarkdownRemark;
  return allMarkdownRemark.edges.map(function (edge) {
    return (0, _extends2.default)({}, edge.node.frontmatter, {
      description: edge.node.excerpt,
      url: site.siteMetadata.siteUrl + edge.node.fields.slug,
      guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
      custom_elements: [{
        "content:encoded": edge.node.html
      }]
    });
  });
};

exports.onPreBootstrap = /*#__PURE__*/function () {
  var _onPreBootstrap = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(_ref2, pluginOptions) {
    var reporter, normalized;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            reporter = _ref2.reporter;
            delete pluginOptions.plugins;
            _context.prev = 2;
            _context.next = 5;
            return _pluginOptions.default.validate(pluginOptions);

          case 5:
            normalized = _context.sent;

            // TODO: remove these checks in the next major release
            if (!normalized.feeds) {
              reporter.warn(reporter.stripIndent(warnMessage("feeds option", "the internal RSS feed creation")));
            } else if (normalized.feeds.some(function (feed) {
              return typeof feed.title !== "string";
            })) {
              reporter.warn(reporter.stripIndent(warnMessage("title in a feed", "the default feed title")));
            } else if (normalized.feeds.some(function (feed) {
              return typeof feed.serialize !== "function";
            })) {
              reporter.warn(reporter.stripIndent(warnMessage("serialize function in a feed", "the internal serialize function")));
            }

            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](2);
            throw new Error(_context.t0.details.map(function (detail) {
              return "[Config Validation]: " + detail.message;
            }).join("\n"));

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 9]]);
  }));

  function onPreBootstrap(_x, _x2) {
    return _onPreBootstrap.apply(this, arguments);
  }

  return onPreBootstrap;
}();

exports.onPostBuild = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(_ref3, pluginOptions) {
    var graphql, options, baseQuery, _iterator, _step, _ref6, feed, _options$feed, setup, locals, serializer, rssFeed, outputPath, outputDir;

    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            graphql = _ref3.graphql;

            /*
             * Run the site settings query to gather context, then
             * then run the corresponding feed for each query.
             */
            options = (0, _extends2.default)({}, _internals.defaultOptions, {}, pluginOptions);
            _context2.next = 4;
            return (0, _internals.runQuery)(graphql, options.query);

          case 4:
            baseQuery = _context2.sent;
            _iterator = _createForOfIteratorHelperLoose(options.feeds);

          case 6:
            if ((_step = _iterator()).done) {
              _context2.next = 33;
              break;
            }

            _ref6 = _step.value;
            feed = (0, _extends2.default)({}, _ref6);

            if (!(feed.customQuery && typeof feed.customQuery === 'function')) {
              _context2.next = 15;
              break;
            }

            _context2.next = 12;
            return feed.customQuery({
              runQuery: _internals.runQuery.bind(null, graphql)
            }).then(function (result) {
              return (0, _lodash.default)({}, baseQuery, result);
            });

          case 12:
            feed.query = _context2.sent;
            _context2.next = 19;
            break;

          case 15:
            if (!feed.query) {
              _context2.next = 19;
              break;
            }

            _context2.next = 18;
            return (0, _internals.runQuery)(graphql, feed.query).then(function (result) {
              return (0, _lodash.default)({}, baseQuery, result);
            });

          case 18:
            feed.query = _context2.sent;

          case 19:
            _options$feed = (0, _extends2.default)({}, options, {}, feed), setup = _options$feed.setup, locals = (0, _objectWithoutPropertiesLoose2.default)(_options$feed, ["setup"]);
            serializer = feed.serialize && typeof feed.serialize === "function" ? feed.serialize : serialize;
            rssFeed = serializer(locals).reduce(function (merged, item) {
              merged.item(item);
              return merged;
            }, new _rss.default(setup(locals)));
            outputPath = _path.default.join(publicPath, feed.output);
            outputDir = _path.default.dirname(outputPath);
            _context2.next = 26;
            return _fsExtra.default.exists(outputDir);

          case 26:
            if (_context2.sent) {
              _context2.next = 29;
              break;
            }

            _context2.next = 29;
            return _fsExtra.default.mkdirp(outputDir);

          case 29:
            _context2.next = 31;
            return _fsExtra.default.writeFile(outputPath, rssFeed.xml());

          case 31:
            _context2.next = 6;
            break;

          case 33:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4) {
    return _ref4.apply(this, arguments);
  };
}();