var test_utils = {};
/**
 *
 * @param {!Array}resources
 * @param {?Function}onSuccess
 * @returns {Function}
 */
test_utils.loadRequireResource = function(resources, onSuccess)
{

    return function()
    {
        var loaded = false;
        onSuccess = onSuccess || function(){};
        runs(function()
        {
            require(resources, function()
            {
                loaded = true;
            });
        });
        waitsFor(function()
        {
            return loaded;
        }, "All Resources should be initialized", 1000);

        runs(function()
        {
            expect(loaded).toBe(true);
            var parameters = [];
            for(var i=0; i<resources.length; ++i)
            {
                parameters.push(require(resources[i]));
            }
            onSuccess.apply(null, parameters);
        });
    };


};
/**
 *
 * @param {String}href
 * @param {Function}onSuccess
 * @returns {Function}
 */
test_utils.loadXmlResource = function(href, onSuccess)
{
    return function()
    {
        var AjaxProxy = require('utils/ajax_proxy');
        var URI = require('URIjs/URI');

        var loaded = false;
        var content = null;

        runs(function()
        {
            var ajaxProxy = new AjaxProxy(new URI(href), 'GET', "text/xml");

            ajaxProxy.onSuccess = function(request)
            {
                if(request.responseXML)
                    content = request.responseXML;
                loaded = true;
            };

            ajaxProxy.onError = function()
            {
                loaded = true;
            };
            ajaxProxy.send();
        });

        waitsFor(function()
        {
            return loaded;
        }, "XML should be loaded", 750);

        runs(function()
        {
            expect(content).not.toBe(null);
            onSuccess(content);

        });

    };

};