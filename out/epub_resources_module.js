
define('model/resource_status',['require'],function (require)
{
    var ResourceStatus = {};
    ResourceStatus.NOT_LOADED = 1;
    ResourceStatus.LOADED=2;
    ResourceStatus.INVALID=3;

    return ResourceStatus;

});
define('model/resource',['require', 'underscore', 'backbone', 'URIjs/URI', 'model/resource_status'],function (require, _ ,Backbone, URI, ResourceStatus)
{



    var Resource = Backbone.Model.extend({
        defaults :
        {
            href:null,
            id:"",
            media_type:"",
            content:null,
            isInternalResource:true,
            refine:null,
            rel:"",
            status:ResourceStatus.NOT_LOADED
        },
        constructor: function()
        {
            Backbone.Model.apply(this,arguments);
            this.bind("invalid", function(model, error){
                throw new Error(error);
            });

            if(!this.isValid())
                throw new Error(this.validationError);
            this.initialized = true;
        },
        set:function (key, val, options)
        {
            if(!this.initialized)
            {
                Backbone.Model.prototype.set.apply(this, [key, val, options]);
                return;
            }
            if(typeof key === 'object')
            {
                val = val||{};
                val.validate = true;
            }
            else
            {
                options = options || {};
               options.validate = true;
            }
            Backbone.Model.prototype.set.apply(this, [key, val, options]);
        },
        validate: function( attributes )
        {

            if(attributes.href !== undefined && (!(attributes.href instanceof URI) || attributes.href.toString() == ""))
                return "Invalid href value.";

            if(attributes.rel !== undefined && !attributes.rel.trim())
                return "Invalid rel parent.";

        },
        toJSON:function()
        {
            var json = _.clone(this.attributes);

            json.itemId=this.get('refine').get('itemId');
            json.itemSrc=this.get('refine').get('itemSrc');
            json.itemFragment=this.get('refine').get('itemFragment');
            json.href =json.href.toString();
            delete json.isInternalResource;
            delete json.refine;
            delete json.id;
            delete json.status;
            return json;
        }

    });

    return Resource;
});
define('model/refine',['require', 'underscore', 'backbone', 'model/resource'],function (require, _ ,Backbone, Resource)
{
    var Refine = Backbone.Model.extend({
        defaults :
        {
            itemId:null,
            itemSrc:null,
            itemFragment:null,
            resources:{}
        },
        initialize : function Refine()
        {
            this.set('resources', {});
        },
        addResource:function(resource)
        {
            if(!(resource instanceof Resource))
                throw new Error('invalid resource');

            var resources = this.get('resources');
            var relProperty = resource.get("rel");


            if(resources[relProperty] !== undefined && (!!resources[relProperty].get('isInternalResource') || !resource.get('isInternalResource')))
                return false;

            resource.set("refine", this);
            resources[relProperty] = resource;

            return true;
        },
        getResource:function(rel)
        {
            return this.get('resources')[rel];
        },
        equals:function(other)
        {
            return this.get('itemId') == other.get('itemId') && this.get('itemSrc') == other.get('itemSrc') && this.get('itemFragment') == other.get('itemFragment')
        }
    });


    return Refine;
});

define('model/refines_collection',['require', 'underscore', 'backbone', 'model/refine'],function (require, _ ,Backbone,Refine)
{
    var RefinesCollection = Backbone.Collection.extend({
        model: Refine
    });
    return RefinesCollection;
});

define('model/normalized_resource',['require','model/resource'],function(require,Resource)
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



define('model/publication_resource',['require','model/normalized_resource', 'model/refine'],function(require,NormalizedResource,Refine)
{
    var PublicationResource = NormalizedResource.extend({

        validate: function( attributes )
        {
            var error = NormalizedResource.prototype.validate.apply(this,[attributes]);
            if(error)
                return error;
            if(attributes.refine && !attributes.refine.equals(new Refine()))
                return "Invalid refine value";
        }
    });
    return PublicationResource;
});

define('model/marc21_resource',['require','model/publication_resource'],function(require,PublicationResource)
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

define('model/mods_resource',['require','model/publication_resource'],function(require,PublicationResource)
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


define('model/onix_resource',['require','model/publication_resource'],function(require,PublicationResource)
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

define('model/xml_signature_resource',['require','model/normalized_resource'],function(require,NormalizedResource)
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
define('model/xmp_resource',['require','model/publication_resource'],function(require,PublicationResource)
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
define('model/un_normalized_resource',['require','model/resource'],function(require,Resource)
{
    var UnNormalizedResource = Resource.extend({

    });
    return UnNormalizedResource;
});

define('factory/resources_factory',['require',
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




define('manager/resources_manager',['require', 'underscore', 'URIjs/URI', 'model/refines_collection', 'factory/resources_factory', 'model/refine'],
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
            };
    return ResourcesManager;
});
define('utils/ajax_proxy',['require', 'URIjs/URI'], function(require, URI)
{
    /**
     *
     * @param {!URI} uri
     * @param {?string}method
     * @param {?string}responseMimeType
     * @constructor
     */
    var AjaxProxy = function(uri, method, responseMimeType)
    {
        /**
         * Privates fields
         */
        var pr = {uri:"", method:"GET", responseMimeType:"", async:true};
        var API = this;
        /**
         * @private
         */
        function initialize()
        {
            pr.uri = uri;
            pr.method = method || pr.method;
            pr.responseMimeType = responseMimeType || pr.responseMimeType;
        }


        function setAsync(isAcync)
        {
            pr.async = isAcync;
        }

        /**
         * @public
         */
        function send()
        {
            try
            {
                if(isAcceptCrossDomain())
                    sendByXmlHttpRequestV2();
                else if(isSameOrigin())
                    sendByXmlHttpRequestV1();
                else
                    API.onError(null);

            }
            catch(ex)
            {
                API.onError(null);
            }
        }

        /**
         * @private
         * @returns {boolean}
         */
        function isAcceptCrossDomain()
        {
            return !!window.XDomainRequest || (!!window.XMLHttpRequest && !!window.ProgressEvent && !!window.FormData);
        }

        /**
         * @private
         * @returns {boolean}
         */
        function isSameOrigin()
        {
            var locationUri = new URI(window.location);
            if(pr.uri.host() != locationUri.host())
                return false;
            if(pr.uri.protocol() != locationUri.protocol())
                return false;
            if(pr.uri.port() != locationUri.port())
                return false;
            return true;
        }

        /**
         * @private
         */
        function sendByXmlHttpRequestV1()
        {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function()
            {
                if(request.readyState != 4)
                    return;

                if( request.status == 200)
                    API.onSuccess(request);
                else
                    API.onError(request);
            };

            request.open(pr.method,pr.uri.toString(), pr.async);
            if(request.overrideMimeType && pr.responseMimeType){
                request.overrideMimeType(pr.responseMimeType);
            }
            request.send();

        }
        /**
         * @private
         */
        function sendByXmlHttpRequestV2()
        {
            var request = new (window.XDomainRequest || window.XMLHttpRequest);

            request.onerror = API.onError;
            request.onabort = API.onError;
            request.onload = function()
            {
                if(request.status != 200)
                    API.onError(request);
                else
                    API.onSuccess(request);
            };
            request.open(pr.method, pr.uri.toString() , pr.async);
            request.overrideMimeType(pr.responseMimeType);
            request.send();

        }


        initialize();
        /**
         * @public
         * @param {!(XMLHttpRequest|XDomainRequest)}request
         */
        this.onSuccess = function(request){};
        /**
         * @public
         * @param {?(XMLHttpRequest|XDomainRequest)}request
         */
        this.onError = function(request){};
        this.send = send;
        this.setAsync = setAsync;


    };
    return AjaxProxy;
});
/**
 * @return {NormalizedResourceValidator}
 */
define('resolver/normalized_resource_content_resolver',['require', 'utils/ajax_proxy', 'model/normalized_resource'], function(require, AjaxProxy, NormalizedResource)
{
    var NormalizedResourceContentResolver = function()
    {
        /**
         * @public
         * @param {!Resource}resource
         * @param {Function(?Node)}onSuccess
         * @param {Function}onError
         */
        function resolveContent(resource, onSuccess, onError)
        {
            if(!(resource instanceof NormalizedResource))
                throw new Error('Invalid resource type.');

            onSuccess = onSuccess||function(){};
            onError = onError||function(){};


            var ajaxProxy = new AjaxProxy(resource.get('href'),'get', resource.get('media_type'));

            ajaxProxy.onSuccess = function(request)
            {
                if(!request.responseXML)
                    onError();
                else
                    onSuccess(request.responseXML);
            };
            ajaxProxy.onError = function()
            {
                onError();
            };
            ajaxProxy.send();
        }

        this.resolveContent = resolveContent;
    };
   return NormalizedResourceContentResolver;
});
define('resolver/xml_signature_resource_content_resolver',['require','jquery', 'resolver/normalized_resource_content_resolver', 'model/xml_signature_resource'], function(require,$,NormalizedResourceContentResolver, XmlSignatureResource)
{
    /**
     *
     * @param {!NormalizedResourceContentResolver} normalizedResourceContentResolver
     * @constructor
     */
    var XmlSignatureResourceContentResolver = function(normalizedResourceContentResolver)
    {
        /**
         * @public
         * @param {!Resource}resource
         * @param {Function(?Node)}onSuccess
         * @param {Function}onError
         */
        function resolveContent(resource, onSuccess, onError)
        {
            if(!(resource instanceof XmlSignatureResource))
                throw new Error('Invalid resource type.');

            onSuccess = onSuccess||function(){};
            onError = onError||function(){};

            normalizedResourceContentResolver.resolveContent(resource, function(node)
            {
                try
                {
                    var fragment = resource.get('href').fragment();

                    var $signature =$('Signature[Id='+fragment+']', node);

                    if($signature.length == 0)
                        throw new Error('Unable to retrieve signature.');
                    onSuccess($signature[0]);
                }
                catch(ex)
                {
                    onError();
                }
            }, onError)
        }

        this.resolveContent = resolveContent;
    };
    return XmlSignatureResourceContentResolver;
});
define('resolver/un_normalized_resource_content_resolver',['require', 'utils/ajax_proxy', 'model/un_normalized_resource'], function(require, AjaxProxy, UnNormalizedResource)
{
    /**
     *
     * @constructor
     */
    var UnNormalizedContentResolver = function()
    {
        /**
         * @public
         * @param {!Resource}resource
         * @param {Function(?Node)}onSuccess
         * @param {Function}onError
         */
        function resolveContent(resource, onSuccess, onError)
        {
            if(!(resource instanceof UnNormalizedResource))
                throw new Error('Invalid resource type.');

            onSuccess = onSuccess||function(){};

            onSuccess(null);

        }
        this.resolveContent = resolveContent;

    };
    return UnNormalizedContentResolver;
});

define('factory/content_resolver_factory',['require',
        'model/resource',
        'model/xml_signature_resource',
        'model/normalized_resource',
        'model/un_normalized_resource',
        'resolver/xml_signature_resource_content_resolver',
        'resolver/normalized_resource_content_resolver',
        'resolver/un_normalized_resource_content_resolver'],
        function(require,
                 Resource,
                 XmlSignatureResource,
                 NormalizedResource,
                 UnNormalizedResource,
                 XmlSignatureResourceContentResolver,
                 NormalizedResourceContentResolver,
                 UnNormalizedContentResolver )
        {
            /**
             * @constructor
             */
            var ContentResolverFactory = function()
            {
                var normalizedResourceContentResolver = null;
                var unNormalizedContentResolver = null;
                var xmlSignatureResourceContentResolver = null;
                /**
                 * @public
                 * @param {!Resource}resource
                 * @throw Error
                 * @returns the instance of content resolver
                 */
                function makeContentResolver(resource)
                {
                    if(!(resource instanceof Resource))
                        throw new Error('Invalid argument.');

                    if(resource instanceof XmlSignatureResource)
                        return getXmlSignatureResourceContentResolver();
                    else if(resource instanceof  NormalizedResource)
                        return getNormalizedResourceContentResolver();
                    else if(resource instanceof UnNormalizedResource)
                        return getUnNormalizedContentResolver();
                    throw new Error('Type of resource is not yet supported');
                }

                /**
                 * @private
                 * @returns {!NormalizedResourceContentResolver}
                 */
                function getNormalizedResourceContentResolver()
                {
                    if(!normalizedResourceContentResolver)
                    {
                        normalizedResourceContentResolver = new NormalizedResourceContentResolver();
                    }
                    return normalizedResourceContentResolver;
                }

                /**
                 * @private
                 * @returns {!UnNormalizedContentResolver}
                 */
                function getUnNormalizedContentResolver()
                {
                    if(!unNormalizedContentResolver)
                    {
                        unNormalizedContentResolver = new UnNormalizedContentResolver();
                    }
                    return unNormalizedContentResolver;


                }
                /**
                 * @private
                 * @returns {!XmlSignatureResourceContentResolver}
                 */
                function getXmlSignatureResourceContentResolver()
                {
                    if(!xmlSignatureResourceContentResolver)
                    {
                        xmlSignatureResourceContentResolver = new XmlSignatureResourceContentResolver(getNormalizedResourceContentResolver());
                    }
                    return xmlSignatureResourceContentResolver;
                }

                this.makeContentResolver = makeContentResolver;

                            };
            return ContentResolverFactory;
        });
define('resolver/opf_links_resolver',['require', 'jquery','URIjs/URI'],function(require, $,URI)
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


            };
    return OpfLinksResolver;
});

define('manager/resource_content_manager',['require', 'model/resource_status'],function(require, ResourceStatus)
{
    /**
     *
     * @param {!ContentResolverFactory}resourceValidatorResolver
     * @constructor
     */
    var ResourceContentManager= function(contentResolverFactory)
    {
        /**
         * @private
         * @param {!Resource}resource
         * @param {function}onSuccess
         * @param {function}onError
         */
        function addContentToResource(resource, onSuccess, onError)
        {
            onSuccess = onSuccess || function(){};
            onError = onError || function(){};
            var url = resource.get('href').toString();
            var status = resource.get('status');

            if(status == ResourceStatus.LOADED)
                onSuccess(resource);
            else if(status == ResourceStatus.INVALID)
                onError(resource);
            else
            {
                resolveContent(resource, onSuccess, onError)
            }
        }

        /**
         * @private
         * @param {!Resource}resource
         * @param {function}onSuccess
         * @param {function}onError
         */
        function resolveContent(resource, onSuccess, onError)
        {

            var onSuccessProxy = function($element)
            {
                resource.set("content", $element);
                resource.set('status', ResourceStatus.LOADED);
                onSuccess(resource);
            };

            var onErrorProxy = function()
            {
                resource.set('status', ResourceStatus.INVALID);
                onError(resource);
            };

            var contentResolver = contentResolverFactory.makeContentResolver(resource);
            contentResolver.resolveContent(resource,onSuccessProxy,onErrorProxy);
        }

        this.addContentToResource = addContentToResource;
            };
    return ResourceContentManager;
});
define('epub_resources_module',['require', 'module', 'URIjs/URI', 'manager/resources_manager', 'factory/content_resolver_factory', 'resolver/opf_links_resolver', 'manager/resource_content_manager'],
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



