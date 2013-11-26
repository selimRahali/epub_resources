define(['require','model/publication_resource'],function(require,PublicationResource)
{
    var Marc21Resource = PublicationResource.extend({
        /**
         * @returns {string}
         */
        getRelValue : function()
        {
            return "marc21xml-record";
        }
    });
    return Marc21Resource;
});
