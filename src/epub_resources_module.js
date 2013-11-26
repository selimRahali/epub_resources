define(['require', 'module', 'URIjs/URI', 'manager/resources_manager', 'factory/content_resolver_factory', 'resolver/opf_links_resolver', 'manager/resource_content_manager'],
function(require, module, URI,ResourcesManager, ContentResolverFactory,OpfLinksResolver,ResourceContentManager)
{
    /**
     *
     * @param {!string} packageDocumentPath the path of the package document
     * @param {!string} packageDocument the content of the package document.
     * @constructor
     */
    var EpubResourcesModule = function(packageDocumentPath, packageDocument)
    {

        /**
         *
         * @type {ResourcesManager}
         */
        var resourcesManager = null;
        /**
         *
         * @type {ResourceContentManager}
         */
        var resourceContentManager = null;

        /**
         *
         * @type {URI}
         */
        var absolutePackageDocumentPathUri = "";

        /**
         * @private
         */
        function initialize()
        {
            absolutePackageDocumentPathUri = new URI(packageDocumentPath);
            if(!absolutePackageDocumentPathUri.is('absolute'))
            {
                absolutePackageDocumentPathUri = absolutePackageDocumentPathUri.absoluteTo(window.location);
            }

            var linksResolver = new OpfLinksResolver(packageDocument,absolutePackageDocumentPathUri.toString());
            resourcesManager = new ResourcesManager(linksResolver);
            resourceContentManager  = new ResourceContentManager(new ContentResolverFactory());
        }

        /**
         * Find all resources that are associate to the publication's item or to the publication itself if the 'id' parameter is null.
         * This method return the number of resources that have been found and send each of them , asynchronously, by using the methods "onSuccess" or "onError"
         * These methods have only one parameter which the JSON structure is below :
         * {
         *  content: Node | null,       //The content of the resource.
         *                              //The value is null if :
         *                              //   - the resource isn't a normalized resource (http://www.idpf.org/epub/30/spec/epub30-publications.html#sec-link-rel-values)
         *                              //   - the parameter is used with the function "onError"
         *
         *  href : string,              //The absolute location of the resource.
         *
         *  itemFragment:string | null, //The fragment associate to the publication's item.
         *                              //The value is null if the publication's item has not any fragment or
         *                              //if the resource is associate to the publication
         *
         *  itemId : string | null,     //The id of the publication's item.
         *                              //The value is null if the resource is associate to the publication
         *
         *  itemSrc : string | null,    //The absolute location of the publication's item.
         *                              //The value is null if the resource is associate to the publication.
         *
         *  media_type : string,        //The media type [RFC2046] that specifies the type and format of the resource
         *  rel : string                //The type of resource :marc21xml-record, onix-record, etc.
         * }
         * @public
         * @param {?string} id The id of the publication's item.
         * @param {?function} onSuccess Called when a valid resource was found
         * @param {?function} onError Called when a resource was found but not valid
         * @returns {Number} The number of resource that have been found
         */
        function getResourcesByItemId(id, onSuccess, onError)
        {

            var resources = resourcesManager.getResourcesByItemId(id);
            sendResources(resources, onSuccess, onError);
            return resources.length;
        }

        /**
         * Find all resources that are associate to the publication's item or to the publication itself if the 'url' parameter is null.
         * This method return the number of resources that have been found and send each of them , asynchronously, by using the methods "onSuccess" or "onError"
         * These methods have only one parameter which the JSON structure is below :
         * {
         *  content: Node | null,       //The content of the resource.
         *                              //The value is null if :
         *                              //   - the resource isn't a normalized resource (http://www.idpf.org/epub/30/spec/epub30-publications.html#sec-link-rel-values)
         *                              //   - the parameter is used with the function "onError"
         *
         *  href : string,              //The absolute location of the resource.
         *
         *  itemFragment:string | null, //The fragment associate to the publication's item.
         *                              //The value is null if the publication's item has not any fragment or
         *                              //if the resource is associate to the publication
         *
         *  itemId : string | null,     //The id of the publication's item.
         *                              //The value is null if the resource is associate to the publication
         *
         *  itemSrc : string | null,    //The absolute location of the publication's item.
         *                              //The value is null if the resource is associate to the publication.
         *
         *  media_type : string,        //The media type [RFC2046] that specifies the type and format of the resource
         *  rel : string                //The type of resource :marc21xml-record, onix-record, etc.
         * }
         * @public
         * @param {?string} url The url of the publication's item
         * @param {?function} onSuccess Called when a valid resource was found.
         * @param {?function} onError Called when a resource was found but not valid
         * @returns {Number} The number of resource that have been found
         */
        function getResourcesByUrl(url, onSuccess, onError)
        {
            var uri = url?new URI(url):null;

            if(uri && !uri.is('absolute'))
                uri = uri.absoluteTo(absolutePackageDocumentPathUri);
            var resources = resourcesManager.getResourcesByUri(uri);
            sendResources(resources, onSuccess, onError);
            return resources.length;

        }

        /**
         * @private
         * @param {!Array<Resource>}resources
         * @param {?function}onSuccess
         * @param {?function}onError
         */
        function sendResources(resources, onSuccess, onError)
        {
            onSuccess = onSuccess || function(){};
            onError = onError || function(){};

            var onSuccessProxy = function(resource)
            {
                onSuccess(resource.toJSON());
            };
            var onErrorProxy = function(resource)
            {
                onError(resource.toJSON());
            };
            addContentToResources(resources, onSuccessProxy, onErrorProxy)
        }

        /**
         * @private
         * @param {!Array<Resource>}resources
         * @param {function}onSuccess
         * @param {function}onError
         */
        function addContentToResources(resources, onSuccess, onError)
        {
            for(var i=0; i<resources.length; ++i)
            {
                resourceContentManager.addContentToResource(resources[i], onSuccess, onError);
            }
        }
        initialize();
        this.getResourcesByItemId = getResourcesByItemId;
        this.getResourcesByUrl = getResourcesByUrl;
    };
    return EpubResourcesModule;
});



