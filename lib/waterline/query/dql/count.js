/**
 * Module Dependencies
 */

var _ = require('lodash');
var usageError = require('../../utils/usageError');
var utils = require('../../utils/helpers');
var normalize = require('../../utils/normalize');
var Deferred = require('../deferred');

/**
 * Count of Records
 *
 * @param {Object} criteria
 * @param {Object} options
 * @param {Function} callback
 * @return Deferred object if no callback
 */

/** @diff-start sails-mysql-transactions */
module.exports = function(criteria, options, cb, _transactionId) {
/** @diff-end sails-mysql-transactions */
  var usage = utils.capitalize(this.identity) + '.count([criteria],[options],callback)';

  if(typeof criteria === 'function') {
    cb = criteria;
    criteria = null;
    options = null;
  }

  if(typeof options === 'function') {
    cb = options;
    options = null;
  }

  // Return Deferred or pass to adapter
  if(typeof cb !== 'function') {
    return new Deferred(this, this.count, (_transactionId && (criteria.transactionId = _transactionId), criteria));
  }

  // Cross-inject from criteria
  (!_transactionId && criteria && criteria.transactionId) && (_transactionId = criteria.transactionId);

  // Normalize criteria and fold in options
  criteria = normalize.criteria(criteria);

  if(_.isObject(options) && _.isObject(criteria)) {
    criteria = _.extend({}, criteria, options);
  }

  if(_.isFunction(criteria) || _.isFunction(options)) {
    return usageError('Invalid options specified!', usage, cb);
  }

  // Transform Search Criteria
  criteria = this._transformer.serialize(criteria);

  // re-inject into criteria
  _transactionId && (criteria.transactionId = _transactionId);

  this.adapter.count(criteria, cb);
};
