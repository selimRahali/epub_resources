describe("Class EpubResourcesModule ", function()
{

    var packageDocumentWithUnNormalizedResourcesFullPath = "spec/fixtures/opf_for_module_tests_with_un_normalized_resources.opf";
    var packageDocumentWithUnNormalizedResources = null;

    var packageDocumentWithNormalizedResourcesFullPath = "spec/fixtures/opf_for_module_tests_with_normalized_resources.opf";
    var packageDocumentWithNormalizedResources = null;

    it("OPF 1/2 Loaded", test_utils.loadXmlResource(packageDocumentWithUnNormalizedResourcesFullPath, function(xml)
    {
        packageDocumentWithUnNormalizedResources = xml;
    }));

    it("OPF 2/2 Loaded", test_utils.loadXmlResource(packageDocumentWithNormalizedResourcesFullPath, function(xml)
    {
        packageDocumentWithNormalizedResources = xml;
    }));

    function findResources(epubResourcesModule, findMethod, id, whenDoneCallBack)
    {
        var validResources = [];
        var invalidResources = [];
        var done = false;
        var resourcesCount = 0;
        var processedResourcesCount = 0;
        runs(function()
        {
            var onSuccess = function(resource)
            {
                ++processedResourcesCount;
                validResources.push(resource);

            };
            var onError = function(resource)
            {
                ++processedResourcesCount;
                invalidResources.push(resource);
            };
            resourcesCount = epubResourcesModule[findMethod](id, onSuccess, onError);
        });

        waitsFor(function()
        {
            return resourcesCount == processedResourcesCount;
        }, "Resources should be found", 750);
        runs(function()
        {
            whenDoneCallBack(validResources, invalidResources);
        });

    }

    describe('Tests method getResourcesByItemId for resources of publication', function()
    {
        it('Test with unnormalized resource', test_utils.loadRequireResource(['epub_resources_module'],function(EpubResourcesModule)
        {
            var epubResourcesModule = new EpubResourcesModule(packageDocumentWithUnNormalizedResourcesFullPath, packageDocumentWithUnNormalizedResources);
            var expectedResult = {
                content: null,
                href: "http://creativecommons.org/licenses/by-sa/3.0/",
                itemFragment: null,
                itemId: null,
                itemSrc: null,
                media_type: "",
                rel: "cc:license"
            };

            findResources(epubResourcesModule, 'getResourcesByItemId', null, function(validResources, invalidResources)
            {
                expect(validResources.length).toBe(1);
                expect(invalidResources.length).toBe(0);
                expect(validResources[0]).toEqual(expectedResult);
            });

        }));
        it('Test with normalized resource)', test_utils.loadRequireResource(['epub_resources_module'],function(EpubResourcesModule)
        {
            var epubResourcesModule = new EpubResourcesModule(packageDocumentWithNormalizedResourcesFullPath, packageDocumentWithNormalizedResources);

            findResources(epubResourcesModule, 'getResourcesByItemId', null, function(validResources, invalidResources)
            {
                expect(validResources.length).toBe(1);
                expect(invalidResources.length).toBe(0);
                var resource = validResources[0];
                expect(resource.href).toEqual("http://localhost:8888/spec/fixtures/底本.xmp");
                expect(resource.itemFragment).toEqual(null);
                expect(resource.itemId).toEqual(null);
                expect(resource.itemSrc).toEqual(null);
                expect(resource.media_type).toEqual("text/xml");
                expect(resource.rel).toEqual('xmp-record');
                expect(resource.content instanceof Node).toBe(true);
            });

        }));
    });

    describe('Tests method getResourcesByUrl for resources of publication', function()
    {
        it('Test with unnormalized resource', test_utils.loadRequireResource(['epub_resources_module'],function(EpubResourcesModule)
        {
            var epubResourcesModule = new EpubResourcesModule(packageDocumentWithUnNormalizedResourcesFullPath, packageDocumentWithUnNormalizedResources);
            var expectedResult = {
                content: null,
                href: "http://creativecommons.org/licenses/by-sa/3.0/",
                itemFragment: null,
                itemId: null,
                itemSrc: null,
                media_type: "",
                rel: "cc:license"
            };



            findResources(epubResourcesModule, 'getResourcesByUrl', null, function(validResources, invalidResources)
            {
                expect(validResources.length).toBe(1);
                expect(invalidResources.length).toBe(0);
                expect(validResources[0]).toEqual(expectedResult);
            });
        }));



        it('Test with normalized resource)', test_utils.loadRequireResource(['epub_resources_module'],function(EpubResourcesModule)
        {
            var epubResourcesModule = new EpubResourcesModule(packageDocumentWithNormalizedResourcesFullPath, packageDocumentWithNormalizedResources);

            findResources(epubResourcesModule, 'getResourcesByUrl', null, function(validResources, invalidResources)
            {
                expect(validResources.length).toBe(1);
                expect(invalidResources.length).toBe(0);
                var resource = validResources[0];
                expect(resource.href).toEqual("http://localhost:8888/spec/fixtures/底本.xmp");
                expect(resource.itemFragment).toEqual(null);
                expect(resource.itemId).toEqual(null);
                expect(resource.itemSrc).toEqual(null);
                expect(resource.media_type).toEqual("text/xml");
                expect(resource.rel).toEqual('xmp-record');
                expect(resource.content instanceof Node).toBe(true);
            });

        }));

    });

    describe("Tests method getResourcesByItemId for resources of publication' item", function()
    {
        it("Test with unnormalized resource", test_utils.loadRequireResource(['epub_resources_module'],function(EpubResourcesModule)
        {
            var epubResourcesModule = new EpubResourcesModule(packageDocumentWithUnNormalizedResourcesFullPath, packageDocumentWithUnNormalizedResources);
            var expectedResult = {
                content: null,
                href: "http://www.flickr.com/photos/smithsonian/2941526052" ,
                itemFragment: null,
                itemId: "cover",
                itemSrc: 'http://localhost:8888/spec/fixtures/images/cover.jpg',
                media_type: "",
                rel: "cc:attributionURL"
            };

            findResources(epubResourcesModule, 'getResourcesByItemId', 'cover', function(validResources, invalidResources)
            {
                expect(validResources.length).toBe(1);
                expect(invalidResources.length).toBe(0);
                expect(validResources[0]).toEqual(expectedResult);
            });

        }));

        it("Test with normalized resource", test_utils.loadRequireResource(['epub_resources_module'],function(EpubResourcesModule)
        {
            var epubResourcesModule = new EpubResourcesModule(packageDocumentWithNormalizedResourcesFullPath, packageDocumentWithNormalizedResources);
            findResources(epubResourcesModule, 'getResourcesByItemId', '四', function(validResources, invalidResources)
            {
                expect(validResources.length).toBe(1);
                expect(invalidResources.length).toBe(0);
                var resource = validResources[0];
                expect(resource.href).toEqual("http://localhost:8888/spec/fixtures/signatures.xml#AsYouLikeItSignature");
                expect(resource.itemFragment).toEqual(null);
                expect(resource.itemId).toEqual("四");
                expect(resource.itemSrc).toEqual('http://localhost:8888/spec/fixtures/xhtml/四.xhtml');
                expect(resource.media_type).toEqual("text/xml");
                expect(resource.rel).toEqual('xml-signature');
                expect(resource.content instanceof Node).toBe(true);
            });

        }));
    });

    describe("Tests method getResourcesByUrl for resources of publication' item", function()
    {
        it("Test with unnormalized resource", test_utils.loadRequireResource(['epub_resources_module'],function(EpubResourcesModule)
        {
            var epubResourcesModule = new EpubResourcesModule(packageDocumentWithUnNormalizedResourcesFullPath, packageDocumentWithUnNormalizedResources);
            var expectedResult = {
                content: null,
                href: "http://www.flickr.com/photos/smithsonian/2941526052" ,
                itemFragment: null,
                itemId: "cover",
                itemSrc: 'http://localhost:8888/spec/fixtures/images/cover.jpg',
                media_type: "",
                rel: "cc:attributionURL"
            };
            var urls = ['images/cover.jpg', 'http://localhost:8888/spec/fixtures/images/cover.jpg'];
            for(var i=0; i<urls.length; ++i)
            {
                findResources(epubResourcesModule, 'getResourcesByUrl', urls[i], function(validResources, invalidResources)
                {
                    expect(validResources.length).toBe(1);
                    expect(invalidResources.length).toBe(0);
                    expect(validResources[0]).toEqual(expectedResult);
                });
            }


        }));

        it("Test with normalized resource", test_utils.loadRequireResource(['epub_resources_module'],function(EpubResourcesModule)
        {
            var epubResourcesModule = new EpubResourcesModule(packageDocumentWithNormalizedResourcesFullPath, packageDocumentWithNormalizedResources);


            var urls = ['xhtml/四.xhtml', 'http://localhost:8888/spec/fixtures/xhtml/四.xhtml'];
            for(var i=0; i<urls.length; ++i)
            {
                findResources(epubResourcesModule, 'getResourcesByUrl', urls[i], function(validResources, invalidResources)
                {
                    expect(validResources.length).toBe(1);
                    expect(invalidResources.length).toBe(0);
                    var resource = validResources[0];
                    expect(resource.href).toEqual("http://localhost:8888/spec/fixtures/signatures.xml#AsYouLikeItSignature");
                    expect(resource.itemFragment).toEqual(null);
                    expect(resource.itemId).toEqual("四");
                    expect(resource.itemSrc).toEqual('http://localhost:8888/spec/fixtures/xhtml/四.xhtml');
                    expect(resource.media_type).toEqual("text/xml");
                    expect(resource.rel).toEqual('xml-signature');
                    expect(resource.content instanceof Node).toBe(true);
                });
            }


        }));
    });
});