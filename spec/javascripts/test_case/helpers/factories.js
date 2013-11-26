var test_factories = {};
describe("Factories loading",function()
{
    it("Factories loaded", test_utils.loadRequireResource(['jquery','URIjs/URI', 'model/resource', 'model/marc21_resource','model/xml_signature_resource', 'model/un_normalized_resource'], function($, URI, Resource, Marc21Resource, XmlSignatureResource, UnNormalizedResource)
    {
        test_factories.makeValidResource = function()
        {
            return new Resource({href:new URI('toto.com'), rel:'test'});
        };

        test_factories.makeUnNormalizedResource = function()
        {
            return new UnNormalizedResource({href:new URI('spec/fixtures/底本.xmp'), rel:'toto-record'});
        };
        test_factories.makeValidInternalResource = function()
        {
            return new Resource({href:new URI('toto.com'), rel:'test', isInternalResource:true});
        };

        test_factories.makeValidExternalResource = function()
        {
            return new Resource({href:new URI('toto.com'), rel:'test', isInternalResource:false});
        };

        test_factories.makeValidNormalizedResource = function()
        {
            return new Marc21Resource({href:new URI('spec/fixtures/底本.xmp'), rel:'marc21xml-record'});
        };

        test_factories.makeValidNotAccessibleNormalizedResource = function()
        {
            return new Marc21Resource({href:new URI('http://www.w3schools.com/xml/note.xml'), rel:'marc21xml-record'});
        };

        test_factories.makeValidNotExistingNormalizedResource = function()
        {
            return new Marc21Resource({href:new URI('spec/fixtures/sss底本.xmp'), rel:'marc21xml-record'});
        };

        test_factories.makeValidXmlSignatureResource = function()
        {
            return new XmlSignatureResource({href:new URI('spec/fixtures/signatures.xml#AsYouLikeItSignature'), rel:'xml-signature'});

        };

        test_factories.makeEmptyLinkResolver = function()
        {

            var EmptyLinkResolver = function()
            {
                function resolveLinks()
                {
                    return [];
                }
                this.resolveLinks = resolveLinks;

            };

            return new EmptyLinkResolver();
        };


        test_factories.makeSimpleContentResolverFactory = function(isForValidResource)
        {
            isForValidResource = isForValidResource || false;
            var factory = function()
            {

                function getResourceContent()
                {
                    if(!isForValidResource)
                        return undefined;
                    return $('<div></div>');

                }

                function makeContentResolver(resource)
                {
                    return {
                         resolveContent:function(resource, onSuccess, onError)
                         {
                             var callBack = isForValidResource?onSuccess:onError;

                             callBack(getResourceContent());
                         }
                    }
                }
                this.makeContentResolver = makeContentResolver;

            }
            return new factory();

        }



    }));
});




