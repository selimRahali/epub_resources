define(['require','model/publication_resource'],function(require,PublicationResource)
{
    var ModsResource = PublicationResource.extend({
        /**
         * @returns {string}
         */
        getRelValue : function()
        {
            return "mods-record";
        }
    });
    return ModsResource;
});

