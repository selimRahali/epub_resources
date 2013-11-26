define(['require', 'utils/ajax_proxy', 'model/un_normalized_resource'], function(require, AjaxProxy, UnNormalizedResource)
{
    /**
     *
     * @constructor
     */
    var UnNormalizedContentResolver = function()
    {
        /**
         * @public
         * @param {!Resource}resource
         * @param {Function(?Node)}onSuccess
         * @param {Function}onError
         */
        function resolveContent(resource, onSuccess, onError)
        {
            if(!(resource instanceof UnNormalizedResource))
                throw new Error('Invalid resource type.');

            onSuccess = onSuccess||function(){};

            onSuccess(null);

        }
        this.resolveContent = resolveContent;

    };
    return UnNormalizedContentResolver;
});
