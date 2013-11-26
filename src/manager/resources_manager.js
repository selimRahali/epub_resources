define(['require', 'underscore', 'URIjs/URI', 'model/refines_collection', 'factory/resources_factory', 'model/refine'],
function(require, _,URI, RefinesCollection, ResourcesFactory,Refine)
{
    var ResourcesManager = function(linksResolver)
    {

        var refinesCollection = null;
        var resourcesFactory = null;
        /**
         * @private
         */
        function initialize()
        {
            refinesCollection = new RefinesCollection();
            resourcesFactory = new ResourcesFactory();
            var jsonLinks = linksResolver.resolveLinks();
            for(var i = 0, count=jsonLinks.length; i<count; ++i)
            {
                parseLink(jsonLinks[i]);
            }

        }

        /**
         * @private
         * @param {Array<Object>}jsonLink
         */
        function parseLink(jsonLink)
        {

            for(var i=0; i<jsonLink.relList.length; ++i)
            {
                try
                {
                    var relItem = jsonLink.relList[i];
                    var resource = resourcesFactory.makeResource(jsonLink,relItem);
                    var refineObj = addRefineToList(jsonLink.jsonRefines);
                    refineObj.addResource(resource);
                }
                catch (ex){}
            }

        }

        /**
         * @private
         * @param {Object}jsonRefine
         * @returns {Refine}
         */
        function addRefineToList(jsonRefine)
        {
            var refineToAdd = new Refine(jsonRefine);

            var found = refinesCollection.find(function(refine)
            {
                return refine.get("itemId") === refineToAdd.get("itemId")  && refine.get("itemFragment") === refineToAdd.get("itemFragment");
            });

            if(found === undefined)
            {
                refinesCollection.add(refineToAdd);
                found = refineToAdd;
            }
            return found;
        }

        /**
         * @public
         * @param {?String}itemId
         * @returns {Array<Resource>}
         */
        function getResourcesByItemId(itemId)
        {
            var refineFilter = function(element)
            {
               return element.get('itemId') == itemId;
            };
            return findResources(refineFilter);

        }
        /**
         * @public
         * @param {?URI}itemUri
         * @returns {Array<Resource>}
         */
        function getResourcesByUri(itemUri)
        {
            itemUri = itemUri || new URI("");
            var refineFilter = function(element)
            {
                return itemUri.equals(new URI(element.get('itemSrc') || ""));
            };
            return findResources(refineFilter);
        }

        /**
         * @private
         * @param filter
         * @returns {Array}
         */
        function findResources(refineFilter)
        {
            var refines  = refinesCollection.filter( refineFilter);
            var resources= [];
            _.each(refines, function(refine)
            {
                resources = _.union(resources, _.values(refine.get('resources')) );
            });
            return resources;
        }



        initialize();
        this.getResourcesByItemId = getResourcesByItemId;
        this.getResourcesByUri = getResourcesByUri;
        //>>excludeStart("privateMethods", true);
        //For unit tests
        this._parseLink = parseLink;
        this._addRefineToList = addRefineToList;
        this._refinesCollection = refinesCollection;
        //>>excludeEnd("privateMethods");
    };
    return ResourcesManager;
});