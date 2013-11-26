define(['require', 'jquery','URIjs/URI'],function(require, $,URI)
{
    var OpfLinksResolver = function(packageDocument, packageDocumentPath)
    {

        var $packageDocument = null;

        /**
         * @private
         */
        function initialize()
        {
            $packageDocument = $(packageDocument);
        }

        /**
         * @public
         * @returns {Array<Object>}
         */
        function resolveLinks()
        {
            var $links = $("link", $packageDocument);
            var jsonLinks = [];
            $.each($links, function (linkElementIndex, currLinkElement)
            {
                try
                {
                    var $currLinkElement = $(currLinkElement);
                    checkLinkValidity($currLinkElement);
                    var jsonLink = makeJsonLink($currLinkElement);
                    jsonLinks.push(jsonLink);
                }
                catch(ex)
                {}
            });
            return jsonLinks;
        }

        /**
         * @private
         * @param {!$}$linkElement
         * @returns {boolean}
         */
        function checkLinkValidity($linkElement)
        {
            var href = $linkElement.attr("href") ? $linkElement.attr("href") : "";
            var rel = $linkElement.attr("rel") ? $linkElement.attr("rel") : "";
            if(href != "" && rel != "")
                return;
            throw new Error('The link element is invalid');

        }

        /**
         * @private
         * @param {!$}$linkElement
         * @throws Error
         */
        function makeJsonLink($linkElement)
        {
            var jsonRefine = makeJsonRefine($linkElement.attr("refines"));
            var hrefUri = new URI($linkElement.attr("href"));

            var jsonLink =
            {
                href: toAbsoluteSrc(hrefUri),
                relList: $linkElement.attr("rel").split(" "),
                id: $linkElement.attr("id") ? $linkElement.attr("id") : "",
                jsonRefines: jsonRefine,
                media_type: $linkElement.attr("media-type")? $linkElement.attr("media-type") : "",
                isInternalResource : !hrefUri.is("absolute")
            };
            return jsonLink;
        }

        /**
         * @private
         * @param {string}refineValue
         * @returns {Refine}
         * @throws Error
         */
        function makeJsonRefine(refineValue)
        {
            var refineJson = {itemId:null, itemSrc:null, itemFragment:null};
            if(!refineValue)
                return refineJson;

            var uri = new URI(refineValue);

            if(uri.pathname() == "/")
            {
                refineJson.itemId =  uri.fragment() || null;
                refineJson.itemSrc= !refineJson.itemId ?null:toAbsoluteSrc(findItemUri(refineJson.itemId ));
            }
            else
            {
                refineJson.itemId =  findItemId(uri);
                refineJson.itemFragment =  uri.fragment() || null;
                uri = uri.fragment("");
                refineJson.itemSrc= toAbsoluteSrc(uri);
            }

            return refineJson;
        }



        /**
         * @private
         * @param {String|URI}href
         * @return {String}
         */
        function toAbsoluteSrc(href)
        {
            if(!href)
                return '';
            if(!(href instanceof URI))
                href = new URI(href);
            if(!href.is('absolute'))
                href = href.absoluteTo(packageDocumentPath);
            return href.readable();
        }

        /**
         * @private
         * @param {!string}itemId
         * @returns {URI}
         * @throws Error
         */
        function findItemUri(itemId)
        {
            var $items = $('item#'+itemId, $packageDocument);
            //console.debug(itemId);
            var src = null;
            $.each($items, function (itemIndex, currItemElement)
            {

                var $currItemElement = $(currItemElement);
                src = $currItemElement.attr("href") ? $currItemElement.attr("href") : null;
                return false;
            });
            if(!src)
                throw new Error('Unable to retrieve item from id');

            return new URI(src);
        }

        /**
         * @private
         * @param {!URI}itemUri
         * @returns {string}
         * @throws Error
         */
        function findItemId(itemUri)
        {

            var itemSrc = itemUri.pathname();

            var $items = $('item[href="'+itemSrc+'"]', $packageDocument);
            var id = null;
            $.each($items, function (itemIndex, currItemElement)
            {

                var $currItemElement = $(currItemElement);
                id = $currItemElement.attr("id") ? $currItemElement.attr("id") : null;
                return false;
            });

            if(!id)
                throw new Error('Unable to retrieve item from src');

            return id;
        }

        initialize();
        this.resolveLinks = resolveLinks;


        //>>excludeStart("privateMethods", true);
        //For unit tests
        this._makeJsonLink = makeJsonLink;
        this._checkLinkValidity = checkLinkValidity;
        this._makeJsonRefine = makeJsonRefine;
        this._toAbsoluteSrc = toAbsoluteSrc;
        this._findItemUri = findItemUri;
        this._findItemId = findItemId;
        //>>excludeEnd("privateMethods");
    };
    return OpfLinksResolver;
});
