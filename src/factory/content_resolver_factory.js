define(['require',
        'model/resource',
        'model/xml_signature_resource',
        'model/normalized_resource',
        'model/un_normalized_resource',
        'resolver/xml_signature_resource_content_resolver',
        'resolver/normalized_resource_content_resolver',
        'resolver/un_normalized_resource_content_resolver'],
        function(require,
                 Resource,
                 XmlSignatureResource,
                 NormalizedResource,
                 UnNormalizedResource,
                 XmlSignatureResourceContentResolver,
                 NormalizedResourceContentResolver,
                 UnNormalizedContentResolver )
        {
            /**
             * @constructor
             */
            var ContentResolverFactory = function()
            {
                var normalizedResourceContentResolver = null;
                var unNormalizedContentResolver = null;
                var xmlSignatureResourceContentResolver = null;
                /**
                 * @public
                 * @param {!Resource}resource
                 * @throw Error
                 * @returns the instance of content resolver
                 */
                function makeContentResolver(resource)
                {
                    if(!(resource instanceof Resource))
                        throw new Error('Invalid argument.');

                    if(resource instanceof XmlSignatureResource)
                        return getXmlSignatureResourceContentResolver();
                    else if(resource instanceof  NormalizedResource)
                        return getNormalizedResourceContentResolver();
                    else if(resource instanceof UnNormalizedResource)
                        return getUnNormalizedContentResolver();
                    throw new Error('Type of resource is not yet supported');
                }

                /**
                 * @private
                 * @returns {!NormalizedResourceContentResolver}
                 */
                function getNormalizedResourceContentResolver()
                {
                    if(!normalizedResourceContentResolver)
                    {
                        normalizedResourceContentResolver = new NormalizedResourceContentResolver();
                    }
                    return normalizedResourceContentResolver;
                }

                /**
                 * @private
                 * @returns {!UnNormalizedContentResolver}
                 */
                function getUnNormalizedContentResolver()
                {
                    if(!unNormalizedContentResolver)
                    {
                        unNormalizedContentResolver = new UnNormalizedContentResolver();
                    }
                    return unNormalizedContentResolver;


                }
                /**
                 * @private
                 * @returns {!XmlSignatureResourceContentResolver}
                 */
                function getXmlSignatureResourceContentResolver()
                {
                    if(!xmlSignatureResourceContentResolver)
                    {
                        xmlSignatureResourceContentResolver = new XmlSignatureResourceContentResolver(getNormalizedResourceContentResolver());
                    }
                    return xmlSignatureResourceContentResolver;
                }

                this.makeContentResolver = makeContentResolver;

                //>>excludeStart("privateMethods", true);
                //For unit tests
                this._getNormalizedResourceContentResolver = getNormalizedResourceContentResolver;
                this._getUnNormalizedContentResolver = getUnNormalizedContentResolver;
                this._getXmlSignatureResourceContentResolver = getXmlSignatureResourceContentResolver;
                //>>excludeEnd("privateMethods");
            };
            return ContentResolverFactory;
        });