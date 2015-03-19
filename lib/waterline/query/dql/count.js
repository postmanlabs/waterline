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
module.exports = function(criteria, options, cb, _transactionID) {
/** @diff-end sails-mysql-transactions */
  var usage = utils.capitalize(this.identity) + '.count([criteria],[options],callback)';

  if(typeof criteria === 'function') {
    cb = criteria;
    /** @diff-start sails-mysql-transactions */
    (!_transactionID && typeof options === 'string') && (_transactionID = options);
    /** @diff-end sails-mysql-transactions */

    criteria = null;
    options = null;
  }

  if(typeof options === 'function') {
    /** @diff-start sails-mysql-transactions */
    (!_transactionID && typeof cb === 'string') && (_transactionID = cb);
    /** @diff-end sails-mysql-transactions */

    cb = options;
    options = null;
  }

  // Return Deferred or pass to adapter
  if(typeof cb !== 'function') {
    /** @diff-start sails-mysql-transactions */
    (!_transactionID && typeof cb === 'string') && (_transactionID = cb);
    return new Deferred(this, this.count, criteria, _transactionID);
    /** @diff-end sails-mysql-transactions */
  }
  /** @diff-start sails-mysql-transactions */
  // cross-inject from criteria
  (!_transactionID && criteria && criteria.transactionID) && (_transactionID = criteria.transactionID);
  /** @diff-end sails-mysql-transactions */

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

  /** @diff-start sails-mysql-transactions */
  // re-inject into criteria
  _transactionID && (criteria.transactionID = _transactionID);
  /** @diff-end sails-mysql-transactions */

  this.adapter.count(criteria, cb);
};
