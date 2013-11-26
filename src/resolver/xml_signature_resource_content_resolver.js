define(['require','jquery', 'resolver/normalized_resource_content_resolver', 'model/xml_signature_resource'], function(require,$,NormalizedResourceContentResolver, XmlSignatureResource)
{
    /**
     *
     * @param {!NormalizedResourceContentResolver} normalizedResourceContentResolver
     * @constructor
     */
    var XmlSignatureResourceContentResolver = function(normalizedResourceContentResolver)
    {
        /**
         * @public
         * @param {!Resource}resource
         * @param {Function(?Node)}onSuccess
         * @param {Function}onError
         */
        function resolveContent(resource, onSuccess, onError)
        {
            if(!(resource instanceof XmlSignatureResource))
                throw new Error('Invalid resource type.');

            onSuccess = onSuccess||function(){};
            onError = onError||function(){};

            normalizedResourceContentResolver.resolveContent(resource, function(node)
            {
                try
                {
                    var fragment = resource.get('href').fragment();

                    var $signature =$('Signature[Id='+fragment+']', node);

                    if($signature.length == 0)
                        throw new Error('Unable to retrieve signature.');
                    onSuccess($signature[0]);
                }
                catch(ex)
                {
                    onError();
                }
            }, onError)
        }

        this.resolveContent = resolveContent;
    };
    return XmlSignatureResourceContentResolver;
});