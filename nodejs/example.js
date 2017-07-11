var Braziliex = require('./lib/braziliex'),
    // When using as an NPM module, use `require('braziliex.js')`

    // Create a new instance, with optional API key and secret
    braziliex = new Braziliex(
         'key',
         'secret'
    );

// Do not include the line below once the issue is resolved.
Braziliex.STRICT_SSL = false;


// Public call
/*
braziliex.currencies(function(err, data){
    if (err){
        console.log('ERROR', err);
        return;
    }

    console.log(data);
});
*/
/*

braziliex.orderBook('btc_brl', function(err, data){
    if (err){    console.log('ERROR', err);  return;   }
    console.log(data);
});
*/
/*
// private funcions funcionando 

braziliex.completeBalance(function(err, data){
    if (err){
        console.log('ERROR', err);
        return;
    }

    console.log(data);
});
*/
/*
braziliex.openOrders('xmr_brl', function(err, data){
    if (err){    console.log('ERROR', err);    return;  }
    console.log(data);
});



braziliex.sell('eth_brl', 100000, 0.001, function(err, data){
    if (err){    console.log('ERROR', err);    return;  }
    console.log(data);
});
*/
/*
braziliex.cancelOrder('xmr_brl', '5963e653249b066b97335ef0', function(err, data){
    if (err){    console.log('ERROR', err);    return;  }
    console.log(data);
});
*/
/*
braziliex.tradeHistory('eth_brl', function(err, data){
    if (err){    console.log('ERROR', err);    return;  }
    console.log(data);
});

*/


braziliex.depositAddress('btc', function(err, data){
    if (err){    console.log('ERROR', err);    return;  }
    console.log(data);
});








