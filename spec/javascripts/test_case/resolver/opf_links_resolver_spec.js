describe("Class resolver.OpfLinksResolver ", function()
{
    var opfLinksResolver = null;
    var packageDocumentFullPath = "spec/fixtures/opf_for_OpfLinksResolver_tests.opf";
    var packageDocument = null;

    beforeEach(test_utils.loadXmlResource(packageDocumentFullPath, function(xml)
    {
        packageDocument = xml
    }));

    beforeEach(test_utils.loadRequireResource(['resolver/opf_links_resolver'], function(OpfLinksResolver)
    {
        opfLinksResolver = new OpfLinksResolver(packageDocument,packageDocumentFullPath);
    }));

    describe("Tests private methods", function()
    {
        it("Test method 'toAbsoluteSrc'", test_utils.loadRequireResource(['URIjs/URI'], function(URI)
        {
            var srcDataList = [];
            srcDataList.push({src:null, expected:''});
            srcDataList.push({src:"", expected:''});
            srcDataList.push({src:undefined, expected:''});
            srcDataList.push({src:"xhtml/三 s.xhtml", expected:"spec/fixtures/xhtml/三 s.xhtml"});
            srcDataList.push({src:new URI("xhtml/三 s.xhtml"), expected:"spec/fixtures/xhtml/三 s.xhtml"});
            srcDataList.push({src:"../xhtml/三 s.xhtml", expected:"spec/xhtml/三 s.xhtml"});
            srcDataList.push({src:new URI("../xhtml/三 s.xhtml"), expected:"spec/xhtml/三 s.xhtml"});
            srcDataList.push({src:"../../xhtml/三 s.xhtml", expected:"xhtml/三 s.xhtml"});
            srcDataList.push({src:new URI("../../xhtml/三 s.xhtml"), expected:"xhtml/三 s.xhtml"});


            for(var i=0; i<srcDataList.length; ++i)
            {
                var srcData = srcDataList[i];
                expect(opfLinksResolver._toAbsoluteSrc(srcData.src)).toBe(srcData.expected);
            }
        }));
        it("Test method 'makeJsonRefine'", function()
        {
            var refinesDataList=
                [
                    {
                        refines:"xhtml/三.xhtml#solar-system-text",
                        expected:{itemId:'三', itemSrc:"spec/fixtures/xhtml/三.xhtml", itemFragment:"solar-system-text"}
                    },
                    {
                        refines:"xhtml/三.xhtml",
                        expected:{itemId:'三', itemSrc:"spec/fixtures/xhtml/三.xhtml", itemFragment:null}
                    },
                    {
                        refines:"#三",
                        expected:{itemId:'三', itemSrc:"spec/fixtures/xhtml/三.xhtml", itemFragment:null}
                    },
                    {
                        refines:undefined,
                        expected:{itemId:null, itemSrc:null, itemFragment:null}
                    },
                    {
                        refines:null,
                        expected:{itemId:null, itemSrc:null, itemFragment:null}
                    },
                    {
                        refines:'',
                        expected:{itemId:null, itemSrc:null, itemFragment:null}
                    }
                ];

            for(var i=0; i<refinesDataList.length; ++i)
            {
                var refinesData = refinesDataList[i];

                expect(opfLinksResolver._makeJsonRefine(refinesData.refines)).toEqual(refinesData.expected);

            }
        });

        it("Test method 'makeJsonLink'", function()
        {
            var validLinkDataList = [
                {
                    link:'<link rel="xmp-record" href="http://www.test.com/底本.xmp" id="toto"/>',
                    jsonLink :
                    {
                        href: "http://www.test.com/底本.xmp",
                        relList: ["xmp-record"],
                        id: "toto",
                        jsonRefines: {itemId:null, itemSrc:null, itemFragment:null},
                        media_type: "",
                        isInternalResource : false
                    }
                },
                {
                    link:'<link rel="xmp-record cc:attributionURL" href="http://www.test.com/底本.xmp" id=""/>',
                    jsonLink :
                    {
                        href: "http://www.test.com/底本.xmp",
                        relList: ["xmp-record","cc:attributionURL"],
                        id: "",
                        jsonRefines: {itemId:null, itemSrc:null, itemFragment:null},
                        media_type: "",
                        isInternalResource : false
                    }
                },
                {
                    link:'<link rel="marc21xml-record" refines="xhtml/三.xhtml#solar-system-text" href="pub/meta/nor-wood-marc21.xml" media-type="text/xml"/>',
                    jsonLink :
                    {
                        href: "spec/fixtures/pub/meta/nor-wood-marc21.xml",
                        relList: ["marc21xml-record"],
                        id: "",
                        jsonRefines: {itemId:'三', itemSrc:'spec/fixtures/xhtml/三.xhtml', itemFragment:"solar-system-text"},
                        media_type: "text/xml",
                        isInternalResource : true
                    }
                },
                {
                    link:'<link rel="marc21xml-record" refines="#三" href="pub/meta/nor-wood-marc21.xml" media-type="text/xml"/>',
                    jsonLink :
                    {
                        href: "spec/fixtures/pub/meta/nor-wood-marc21.xml",
                        relList: ["marc21xml-record"],
                        id: "",
                        jsonRefines: {itemId:'三', itemSrc:'spec/fixtures/xhtml/三.xhtml', itemFragment:null},
                        media_type: "text/xml",
                        isInternalResource : true
                    }
                }
            ];

            for(var i=0; i<validLinkDataList.length; ++i)
            {
                var linkData = validLinkDataList[i];
                expect(opfLinksResolver._makeJsonLink($(linkData.link))).toEqual(linkData.jsonLink);
            }
        });
        describe("Tests method 'checkLinkValidity'", function()
        {
            it("Test with invalid link's structure", function()
            {
                var invalidLinksElements = ['<link rel="xmp-record" href=""/>', '<link rel="" href="meta/底本.xmp"/>','<link rel="" href=""/>','<link rel="xmp-record"/>','<link href="meta/底本.xmp"/>','<link/>'];

                var getCallBack = function(index)
                {
                    return function()
                    {
                        var $linkElement = $(invalidLinksElements[index]);
                        opfLinksResolver._checkLinkValidity($linkElement)
                    };
                };

                for(var i=0; i<invalidLinksElements.length; ++i)
                {
                    expect(getCallBack(i)).toThrow();
                }
            });

            it("Test with valid link's structure", function()
            {
                var validLinksElements = ['<link rel="mods-record" href="meta/底本.xml"/>', '<link rel="xml-signature" refines="#meta-authority-01"  href="../META-INF/signatures.xml#MAI-Signature"/>'];

                var getCallBack = function(index)
                {
                    return function()
                    {
                        var $linkElement = $(validLinksElements[i]);
                        opfLinksResolver._checkLinkValidity($linkElement)
                    };
                };

                for(var i=0; i<validLinksElements.length; ++i)
                {
                    expect(getCallBack(i)).not.toThrow();
                }
            });
        });

        describe("Tests method 'findItemUri'", function()
        {
            it("Test with valid id", function()
            {
                var id = "夏目漱石";
                var uri = opfLinksResolver._findItemUri(id)
                expect(uri.toString()).toBe('images/夏目漱石.jpg');
            });

            it("Test with invalid id", function()
            {
                var id = "夏目漱石 ssssss";
                var callInvalidId = function()
                {
                    opfLinksResolver._findItemUri(id);
                }
                expect(callInvalidId).toThrow();
            });
        });

        describe("Tests method 'findItemId'", function()
        {
            it("Test with valid uri", test_utils.loadRequireResource(['URIjs/URI'], function(URI)
            {
                var srcList = ["xhtml/三.xhtml", "xhtml/三.xhtml#solar-system text"];
                for(var i=0; i<srcList.length; ++i)
                {
                    var id = opfLinksResolver._findItemId(new URI(srcList[i]));
                    expect(id).toBe('三');
                }
            }));

            it("Test with invalid uri", test_utils.loadRequireResource(['URIjs/URI'], function(URI)
            {
                var src = "xhtml/三 s.xhtml";
                var callMethod = function()
                {
                    opfLinksResolver._findItemId(new URI(src));
                }
                expect(callMethod).toThrow();
            }));
        });
    });

    it("Test method 'resolveLinks'", function()
    {

        var validLinks =
        [
             '<link rel="xmp-record" href="http://www.test.com/底本.xmp"/>',
             '<link rel="xmp-record" href="meta/底本.xmp"/>',
             '<link rel="mods-record" href="meta/底本.xml"/>',
             '<link rel="cc:attributionURL" refines="xhtml/三.xhtml#solar-system-text" href="http://en.wikibooks.org/wiki/Wikijunior_Solar_System/Solar_System"/>',
             '<link rel="cc:attributionURL" refines="xhtml/三.xhtml#solar-system-quiz" href="http://www.think-bank.com/quiz/science/KS37L/index.html"/>',
             '<link rel="cc:attributionURL" refines="xhtml/三.xhtml" href="http://www.w3schools.com/xml/note.xml"/>',
             '<link rel="cc:attributionURL" refines="#三" href="images/cover.jpg"/>',
             '<link rel="onix-record"  href="pub/meta/nor-wood-onix.xml"/>'
        ];
        var validJsonLinks = [];
        for(var i=0; i<validLinks.length; ++i)
        {
            validJsonLinks.push(opfLinksResolver._makeJsonLink($(validLinks[i])));
        }
        expect(validLinks.length).toEqual(validJsonLinks.length);

        var jsonLinks = opfLinksResolver.resolveLinks();
        expect(jsonLinks.length).toEqual(validJsonLinks.length);
        expect(jsonLinks).toEqual(validJsonLinks);
    });
});