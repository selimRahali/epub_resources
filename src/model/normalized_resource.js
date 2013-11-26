define(['require','model/resource'],function(require,Resource)
{

    var NormalizedResource = Resource.extend({

        validate: function(attributes)
        {

            var error = Resource.prototype.validate.apply(this,[attributes]);
            if(error)
                return error;
            attributes.media_type = "text/xml";

            var rel = this.getRelValue();
            if(rel && attributes.rel && attributes.rel != rel)
            {
                return "Invalid rel value";
            }

        },
        /**
         * @returns {string}
         */
        getRelValue : function()
        {
            return "";
        }
    });
    return NormalizedResource;
});


