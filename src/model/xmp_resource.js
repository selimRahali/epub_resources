define(['require','model/publication_resource'],function(require,PublicationResource)
{
    var XmpResource = PublicationResource.extend({
        /**
         * @returns {string}
         */
        getRelValue : function()
        {
            return "xmp-record";
        }
    });
    return XmpResource;
});