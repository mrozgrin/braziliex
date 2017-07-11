module.exports = (function() {
    'use strict';

    // Module dependencies
    var crypto  = require('crypto'),
        request = require('request'),
        nonce   = require('nonce')();

    // Constants
    var version         = '0.1',
        PUBLIC_API_URL  = 'https://braziliex.com/api/v1/public',
        PRIVATE_API_URL = 'https://braziliex.com/api/v1/private',
        USER_AGENT      = 'braziliex.js ' + version;


    // Constructor
    function Braziliex(key, secret) {
        // Generate headers signed by this user's key and secret.
        // The secret is encapsulated and never exposed
        this._getPrivateHeaders = function(parameters) {
            var paramString, signature;

            if (!key || !secret) {
                throw 'Error: API key and secret required';
            }

            // Convert to `arg1=foo&arg2=bar`
            paramString = Object.keys(parameters).map(function(param) {
                return encodeURIComponent(param) + '=' + encodeURIComponent(parameters[param]);
            }).join('&');

            signature = crypto.createHmac('sha512', secret).update(paramString).digest('hex');

            return {
                Key: key,
                Sign: signature
            };
        };
    }

    // Currently, this fails with `Error: CERT_UNTRUSTED`
    // Braziliex.STRICT_SSL can be set to `false` to avoid this. Use with caution.
    // Will be removed in future, once this is resolved.

    Braziliex.STRICT_SSL = true;

    Braziliex.USER_AGENT = USER_AGENT;

    Braziliex.prototype = {
        constructor: Braziliex,

        // Make an API request
        _request: function(options, callback) {
            if (!('headers' in options)) {
                options.headers = {};
            }

            options.json = true;
            options.headers['User-Agent'] = Braziliex.USER_AGENT;
            options.strictSSL = Braziliex.STRICT_SSL;

            request(options, function(err, response, body) {
		    // Empty response
		    if (!err && (typeof body === 'undefined' || body === null)){  err = 'Empty response';    }

		    callback(err, body);
		});

            return this;
        },

        // Make a public API request
        _public: function(command, parameters, callback) {
            var options;

            if (typeof parameters === 'function') {
                callback = parameters;
                parameters = {};
            }

            parameters || (parameters = {});
            parameters.command = command;
            options = {
                method: 'GET',
                url: PUBLIC_API_URL+'/'+command
            };

            //options.qs.command = command;
            return this._request(options, callback);
        },

        // Make a private API request
        _private: function(command, parameters, callback) {
            var options;

            if (typeof parameters === 'function') {
                callback = parameters;
                parameters = {};
            }

            parameters || (parameters = {});
            parameters.command = command;
            parameters.nonce = nonce();

            options = {
                method: 'POST',
                url: PRIVATE_API_URL,
                form: parameters,
                headers: this._getPrivateHeaders(parameters)
            };

            return this._request(options, callback);
        },

        // PUBLIC METHODS

        ticker: function(callback) {
            return this._public('ticker', callback);
        },


        orderBook: function(market1, callback) {
            return this._public('orderbook/'+market1, parameters, callback);
        },


        currencies: function(callback) {
            return this._public('currencies', callback);
        },

        // PRIVATE METHODS

        balance: function(callback) {
            return this._private('balance', {}, callback);
        },

	    completeBalance: function(callback) {
            return this._private('complete_balance', {}, callback);
        },

        depositAddress: function(currency1, callback) {
            var parameters = {   currency: currency1   };

            return this._private('deposit_address', parameters, callback);
        },


        openOrders: function(mkt, callback) {
          var parameters = {
		      market: mkt
	       };

            return this._private('open_orders', parameters, callback);
        },

        tradeHistory: function(market1, callback) {
            var parameters = {
		      market: market1
	       };

            return this._private('trade_history', parameters, callback);
        },


        buy: function(market1, price1, amount, callback) {
            var parameters = {
		      market: market1,
		      price: price1,
		      amount: amount
	       };

            return this._private('buy', parameters, callback);
        },

        sell: function(market1, price1,  amount, callback) {
            var parameters = {
              market: market1,
              price: price1,
              amount: amount
           };

            return this._private('sell', parameters, callback);
        },

        cancelOrder: function(market1, orderNumber, callback) {
            var parameters = {
              market: market1,
              order_number: orderNumber
           };

            return this._private('cancel_order', parameters, callback);
        }
      
    };
    return Braziliex;
})();
