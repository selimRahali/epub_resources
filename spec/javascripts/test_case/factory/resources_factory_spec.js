describe("Class factory.ResourcesFactory", function()
{
    var resourcesFactory = null;

    beforeEach(test_utils.loadRequireResource(['factory/resources_factory'],function(ResourcesFactory)
    {
        resourcesFactory = new ResourcesFactory();
    }));

    it("test method 'makeResource'", function()
    {
        var jsonLink = {
            href: "http://www.test.com/底本.html",
            relList: ["toto"],
            id: "id_toto",
            jsonRefines: {itemId:null, itemSrc:null, itemFragment:null},
            media_type: "text/html",
            isInternalResource : false
        };

        var resource = resourcesFactory.makeResource(jsonLink, "toto");

        expect(resource.get('href').toString()).toEqual(jsonLink.href);
        expect(resource.get('id')).toEqual(jsonLink.id);
        expect(resource.get('media_type')).toEqual(jsonLink.media_type);
        expect(resource.get('isInternalResource')).toEqual(jsonLink.isInternalResource);
        expect(resource.get('rel')).toEqual("toto");
    });
    it("test creation of Marc21Resource", function()
    {
        var Marc21Resource = require('model/marc21_resource');
        var jsonLink  = {
            href: "http://www.test.com/底本.xml",
            relList: ["marc21xml-record"]
        };

        var resource = resourcesFactory.makeResource(jsonLink, "marc21xml-record");

        expect(resource instanceof Marc21Resource).toBe(true);
    });
    it("test creation of ModsResource", function()
    {
        var ModsResource = require('model/mods_resource');
        var jsonLink  = {
            href: "http://www.test.com/底本.xml",
            relList: ["mods-record"]
        };

        var resource = resourcesFactory.makeResource(jsonLink, "mods-record");

        expect(resource instanceof ModsResource).toBe(true);
    });
    it("test creation of OnixResource", function()
    {
        var OnixResource = require('model/onix_resource');
        var jsonLink  = {
            href: "http://www.test.com/底本.xml",
            relList: ["onix-record"]
        };

        var resource = resourcesFactory.makeResource(jsonLink, "onix-record");

        expect(resource instanceof OnixResource).toBe(true);
    });
    it("test creation of XmlSignatureResource", function()
    {
        var XmlSignatureResource = require('model/xml_signature_resource');
        var jsonLink  = {
            href: "http://www.test.com/signatures.xml#toto",
            relList: ["xml-signature"]
        };

        var resource = resourcesFactory.makeResource(jsonLink, "xml-signature");

        expect(resource instanceof XmlSignatureResource).toBe(true);
    });
    it("test creation of XmpResource", function()
    {
        var XmpResource = require('model/xmp_resource');
        var jsonLink  = {
            href: "http://www.test.com/底本.xmp",
            relList: ["xmp-record"]
        };

        var resource = resourcesFactory.makeResource(jsonLink, "xmp-record");

        expect(resource instanceof XmpResource).toBe(true);
    });
    it("test creation of UnNormalizedResource", function()
    {
        var UnNormalizedResource = require('model/un_normalized_resource');
        var jsonLink  = {
            href: "http://www.test.com/底本.xmp",
            relList: ["cc:toto"]
        };

        var resource = resourcesFactory.makeResource(jsonLink, "cc:toto");

        expect(resource instanceof UnNormalizedResource).toBe(true);
    });

});

