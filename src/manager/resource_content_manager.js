define(['require', 'model/resource_status'],function(require, ResourceStatus)
{
    /**
     *
     * @param {!ContentResolverFactory}resourceValidatorResolver
     * @constructor
     */
    var ResourceContentManager= function(contentResolverFactory)
    {
        /**
         * @private
         * @param {!Resource}resource
         * @param {function}onSuccess
         * @param {function}onError
         */
        function addContentToResource(resource, onSuccess, onError)
        {
            onSuccess = onSuccess || function(){};
            onError = onError || function(){};
            var url = resource.get('href').toString();
            var status = resource.get('status');

            if(status == ResourceStatus.LOADED)
                onSuccess(resource);
            else if(status == ResourceStatus.INVALID)
                onError(resource);
            else
            {
                resolveContent(resource, onSuccess, onError)
            }
        }

        /**
         * @private
         * @param {!Resource}resource
         * @param {function}onSuccess
         * @param {function}onError
         */
        function resolveContent(resource, onSuccess, onError)
        {

            var onSuccessProxy = function($element)
            {
                resource.set("content", $element);
                resource.set('status', ResourceStatus.LOADED);
                onSuccess(resource);
            };

            var onErrorProxy = function()
            {
                resource.set('status', ResourceStatus.INVALID);
                onError(resource);
            };

            var contentResolver = contentResolverFactory.makeContentResolver(resource);
            contentResolver.resolveContent(resource,onSuccessProxy,onErrorProxy);
        }

        this.addContentToResource = addContentToResource;
        //>>excludeStart("privateMethods", true);
        //For unit tests
        this._resolveContent = resolveContent;
        //>>excludeEnd("privateMethods");
    };
    return ResourceContentManager;
});