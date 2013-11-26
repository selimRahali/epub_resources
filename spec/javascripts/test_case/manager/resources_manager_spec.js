describe("Class manager.ResourcesManager ", function()
{

    describe('Tests private methods', function()
    {
        var resourcesManager;
        beforeEach(test_utils.loadRequireResource(['manager/resources_manager'], function(ResourcesManager)
        {
            resourcesManager = new ResourcesManager(test_factories.makeEmptyLinkResolver());
            expect(resourcesManager._refinesCollection.length).toEqual(0);

        }));
        describe("Tests method 'addRefineToList'", function()
        {
            it('Test with generics data', function()
            {
                var refine = resourcesManager._addRefineToList({itemId:'MyId',itemSrc:"MySrc",itemFragment:"MyFragment"});
                expect(resourcesManager._refinesCollection.length).toEqual(1);
                expect(refine.get('itemId')).toEqual('MyId');
                expect(refine.get('itemSrc')).toEqual('MySrc');
                expect(refine.get('itemFragment')).toEqual('MyFragment');
            });

            it('Test with similar refine values', function()
            {
                var jsonRefine1 = {itemId:'MyId',itemSrc:"MySrc",itemFragment:"MyFragment"};
                var jsonRefine2 = {itemId:'MyId',itemSrc:"MySrc",itemFragment:"MyFragment"};

                var refine1 = resourcesManager._addRefineToList(jsonRefine1);
                var refine2 = resourcesManager._addRefineToList(jsonRefine2);
                expect(refine1 === refine2).toBe(true);
            });

            it('Test with similar values but not the same fragment', function()
            {
                var jsonRefine1 = {itemId:'MyId',itemSrc:"MySrc",itemFragment:"MyFragment1"};
                var jsonRefine2 = {itemId:'MyId',itemSrc:"MySrc",itemFragment:"MyFragment2"};

                var refine1 = resourcesManager._addRefineToList(jsonRefine1);
                var refine2 = resourcesManager._addRefineToList(jsonRefine2);

                expect(refine1 !== refine2).toBe(true);
                expect(resourcesManager._refinesCollection.length).toEqual(2);
            });

            it('Test with similar values but not the same id', function()
            {
                var jsonRefine1 = {itemId:'MyId1',itemSrc:"MySrc",itemFragment:"MyFragment"};
                var jsonRefine2 = {itemId:'MyId2',itemSrc:"MySrc",itemFragment:"MyFragment"};

                var refine1 = resourcesManager._addRefineToList(jsonRefine1);
                var refine2 = resourcesManager._addRefineToList(jsonRefine2);

                expect(refine1 !== refine2).toBe(true);
                expect(resourcesManager._refinesCollection.length).toEqual(2);
            });
        });

        describe("Test method 'parseLink'", function()
        {
            it('Test method parseLink with valid jsonLink', test_utils.loadRequireResource(['manager/resources_manager', 'model/refine'], function(ResourcesManager, Refine)
            {
                var jsonLink = {
                    href: "http://www.test.com/底本.xmp",
                    relList: ["cc:attributionBB","cc:attributionURL"],
                    id: "",
                    jsonRefines: {itemId:"id1", itemSrc:"toto.xml", itemFragment:"frag"},
                    media_type: "",
                    isInternalResource : false
                };
                resourcesManager._parseLink(jsonLink);
                expect(resourcesManager._refinesCollection.length).toEqual(1);

                var refine = resourcesManager._refinesCollection.at(0);

                expect(refine.equals(new Refine())).toBe(false);

                var resources = refine.get('resources');
                var resourcesCount = 0;
                for(var prop in resources)
                {
                    ++resourcesCount;
                }
                expect(resourcesCount).toEqual(jsonLink.relList.length);

                expect(!!resources['cc:attributionBB']).toBe(true);
                expect(!!resources['cc:attributionURL']).toBe(true);

                expect(resources['cc:attributionBB'].toJSON().href).toEqual(jsonLink.href);
                expect(resources['cc:attributionURL'].toJSON().href).toEqual(jsonLink.href);

                expect(resources['cc:attributionBB'].get('refine') === refine).toBe(true);
                expect(resources['cc:attributionURL'].get('refine') === refine).toBe(true);
            }));

            it('Test method parseLink with partial valid jsonLink', test_utils.loadRequireResource(['manager/resources_manager', 'model/refine'], function(ResourcesManager, Refine)
            {
                var jsonLink = {
                    href: "http://www.test.com/底本.xmp",
                    relList: ["marc21xml-record","cc:attributionURL"],
                    id: "",
                    jsonRefines: {itemId:"id1", itemSrc:"toto.xml", itemFragment:"frag"},
                    media_type: "",
                    isInternalResource : false
                };
                resourcesManager._parseLink(jsonLink);
                expect(resourcesManager._refinesCollection.length).toEqual(1);
                var refine = resourcesManager._refinesCollection.at(0);

                var resources = refine.get('resources');
                expect(!!resources['marc21xml-record']).toBe(false);
                expect(!!resources['cc:attributionURL']).toBe(true);
            }));
        });


    });


    describe('Tests public methods', function()
    {
        var packageDocumentFullPath = "spec/fixtures/opf_for_ResourcesManager_tests.opf";
        var packageDocument = null;
        var resourcesManager = null;

        beforeEach(test_utils.loadXmlResource(packageDocumentFullPath, function(xml)
        {
            packageDocument = xml;
        }));

        beforeEach(test_utils.loadRequireResource(['manager/resources_manager', 'resolver/opf_links_resolver'], function(ResourcesManager, LinkResolver)
        {
            resourcesManager = new ResourcesManager(new LinkResolver(packageDocument, packageDocumentFullPath));
        }));

        describe("Tests method 'getResourcesByItemId'", function()
        {
            it('Test for publication',test_utils.loadRequireResource(['model/xmp_resource'], function(XmpResource)
            {
                var resources = resourcesManager.getResourcesByItemId();
                expect(resources.length).toEqual(1);

                var xmpRecord = resources[0];
                expect(xmpRecord instanceof XmpResource).toBe(true);
                expect(xmpRecord.get('id')).toEqual("test0");
            }));


            it("Test for publication's element'",function()
            {
                var resources = resourcesManager.getResourcesByItemId('三');
                expect(resources.length).toEqual(3);

                var idsToFind = ['test1', 'test2', 'test3'];

                for(var i=0; i<idsToFind.length; ++i)
                {
                    var id = idsToFind[i];
                    var resource = _.find(resources, function(resource)
                    {
                        return resource.get('id') == id;
                    });
                    expect(!!resource).toBe(true);
                }
            });
        });

        describe("Tests method 'getResourcesByUri'", function()
        {
            it('test for publication',test_utils.loadRequireResource(['model/xmp_resource'], function(XmpResource)
            {
                var resources = resourcesManager.getResourcesByUri();
                expect(resources.length).toEqual(1);

                var xmpRecord = resources[0];
                expect(xmpRecord instanceof XmpResource).toBe(true);
                expect(xmpRecord.get('id')).toEqual("test0");
            }));

            it("test for publication's element",test_utils.loadRequireResource(['URIjs/URI','underscore'], function(URI, _)
            {
                var elementUri = new URI('spec/fixtures/xhtml/三.xhtml');
                var resources = resourcesManager.getResourcesByUri(elementUri);
                expect(resources.length).toEqual(3);
                var idsToFind = ['test1', 'test2', 'test3'];
                for(var i=0; i<idsToFind.length; ++i)
                {
                    var id = idsToFind[i];
                    var resource = _.find(resources, function(resource)
                    {
                        return resource.get('id') == id;
                    });
                    expect(!!resource).toBe(true);
                }
            }));
        });

    });
});