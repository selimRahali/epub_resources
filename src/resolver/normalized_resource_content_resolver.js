/**
 * @return {NormalizedResourceValidator}
 */
define(['require', 'utils/ajax_proxy', 'model/normalized_resource'], function(require, AjaxProxy, NormalizedResource)
{
    var NormalizedResourceContentResolver = function()
    {
        /**
         * @public
         * @param {!Resource}resource
         * @param {Function(?Node)}onSuccess
         * @param {Function}onError
         */
        function resolveContent(resource, onSuccess, onError)
        {
            if(!(resource instanceof NormalizedResource))
                throw new Error('Invalid resource type.');

            onSuccess = onSuccess||function(){};
            onError = onError||function(){};


            var ajaxProxy = new AjaxProxy(resource.get('href'),'get', resource.get('media_type'));

            ajaxProxy.onSuccess = function(request)
            {
                if(!request.responseXML)
                    onError();
                else
                    onSuccess(request.responseXML);
            };
            ajaxProxy.onError = function()
            {
                onError();
            };
            ajaxProxy.send();
        }

        this.resolveContent = resolveContent;
    };
   return NormalizedResourceContentResolver;
});