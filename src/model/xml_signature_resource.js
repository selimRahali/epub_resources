define(['require','model/normalized_resource'],function(require,NormalizedResource)
{
    var XmlSignatureResource = NormalizedResource.extend({
        validate: function( attributes ){

            var error = NormalizedResource.prototype.validate.apply(this,[attributes]);
            if(error)
                return error;
            if(attributes.href === undefined)
                return;

            var href = attributes.href;
            if(href.filename() != "signatures.xml")
                return "Invalid Xml signature file name.";
            if(!attributes.isInternalResource)
                return "The Xml file must be into epub";
            if(!href.fragment())
                return "Signature node not defined";
        },
        /**
         * @returns {string}
         */
        getRelValue : function()
        {
            return "xml-signature";
        }
    });
    return XmlSignatureResource;
});