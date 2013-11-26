define(['require','model/publication_resource'],function(require,PublicationResource)
{
    var OnixResource = PublicationResource.extend({
        /**
         * @returns {string}
         */
        getRelValue : function()
        {
            return "onix-record";
        }
    });
    return OnixResource;
});
