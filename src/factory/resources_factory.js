define(['require',
        'underscore',
        'URIjs/URI',
        'model/marc21_resource',
        'model/mods_resource',
        'model/onix_resource',
        'model/xml_signature_resource',
        'model/xmp_resource',
        'model/un_normalized_resource' ],
function (require,
          _ ,
          URI,
          Marc21Resource,
          ModsResource,
          OnixResource,
          XmlSignatureResource,
          XmpResource,
          UnNormalizedResource)
{
    /**
     *
     * @constructor
     */
    var ResourcesFactory = function()
    {


        /**
         *
         * @param {!Object}jsonLink
         * @returns {!Resource}
         * @throws Error
         */
        function makeResource(jsonLink, rel)
        {
            var resource = null;
            var attributes = {
                href:new URI(jsonLink.href),
                id:jsonLink.id,
                media_type:jsonLink.media_type,
                isInternalResource:jsonLink.isInternalResource,
                rel:rel
            };
            switch(rel)
            {
                case 'marc21xml-record':
                    resource = new Marc21Resource(attributes);
                    break;
                case 'mods-record':
                    resource = new  ModsResource(attributes);
                    break;
                case 'onix-record':
                    resource = new  OnixResource(attributes);
                    break;
                case 'xml-signature':
                    resource = new  XmlSignatureResource(attributes);
                    break;
                case 'xmp-record':
                    resource = new  XmpResource(attributes);
                    break;
                default:
                    resource = new  UnNormalizedResource(attributes);
            }


            return resource;
        }

        this.makeResource = makeResource;
    };
    return ResourcesFactory;
});



