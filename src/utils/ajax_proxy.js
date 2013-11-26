define(['require', 'URIjs/URI'], function(require, URI)
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