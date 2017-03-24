var chai = require('chai');
var expect = require('chai').expect;
var spies = require('chai-spies');
chai.use(spies);
var jsdom = require('jsdom').jsdom;
var stub = require('sinon').stub;
var Ruby = require('../lib/RubyInBar.js')
var LanguagesView = require('../LanguagesBar.js');
var languagesView;

describe('LanguagesView', function(){

  beforeEach(function(){
    languagesView = new LanguagesView;
  });

  describe('#getLanguagesView', function(){
    it('Returns languages list of correct length', function(){
      var numberOfLanguages = (Object.keys(new LanguagesView())).length-1;
      expect(languagesView.getLanguagesView().length).to.equal(numberOfLanguages);
    });

    it("Returns languages list of languages with first Ruby", function(){
      var index = languagesView.getLanguagesView().indexOf("Ruby");
      expect(languagesView.getLanguagesView()[index]).to.equal("Ruby");
    });
  });

  describe('#getVersions', function(){
    it('Returns version list of correct length', function(){
      var numberOfLanguages = languagesView.getLanguagesView().length;
      expect(languagesView.getVersions().length).to.equal(numberOfLanguages);
    });

    it("Returns languages list of languages with first Ruby and relevant versions", function(){
      var index = languagesView.getLanguagesView().indexOf("Ruby");
      var version240 = languagesView.ruby.versions.indexOf("2.4.0");
      expect(languagesView.getVersions()[index][version240]).to.equal("2.4.0");
    });
  });

  describe('#getTopics', function(){
    it('Returns topics list of length 105 for Ruby ', function(){
      var index = languagesView.getLanguagesView().indexOf("Ruby");
      var numberRubyTopics = languagesView.ruby.topics.length;
      expect(languagesView.getTopics()[index].length).to.equal(numberRubyTopics);
    });

    it('Returns topics list with first entry ARGF for Ruby ', function(){
      var index = languagesView.getLanguagesView().indexOf("Ruby");
      var indexARGF = languagesView.ruby.topics.indexOf("ARGF");
      expect(languagesView.getTopics()[index][indexARGF]).to.equal("ARGF");
    });
  });

  describe('#createDummyOption', function(){
    var element;
    var dummyoption;
    var dummyoptionLanguage
    var ourDocument = jsdom ('<body>'+
                                  'Google Search:'+
                                    '<input type="text" id="lst-ib" value="ruby array">' +
                                '</body>');

    beforeEach(function(){
      element = ourDocument.createElement('div');
      dummyoption = languagesView.createDummyOption("Hello", element, ourDocument);
      dummyoptionLanguage = languagesView.createDummyOption("language", element, ourDocument);
    })

    it('assigns child node with given string to the div', function(){
      expect(element.childNodes[0].innerHTML).to.equal("Choose a Hello");
    });

    it('assigns child node with given string as value to the div', function(){
      expect(element.childNodes[0].value).to.equal("Choose a Hello");
    });

    it('has child node with selected returning boolean true by default', function(){
      expect(element.childNodes[0].selected).to.equal(true);
    });

    it('has child node with disabled returning boolean false, by default', function(){
      expect(element.childNodes[0].disabled).to.equal(false);
    });

    it('has child node with disabled returning boolean true, if language', function(){
      expect(element.childNodes[1].disabled).to.equal(true);
    });
  });
// getInfoFromSearchBar() cant document.getElementById("lst-ib").value in test

  describe('#createLanguageDropdown', function(){
    var doc;

    beforeEach(function(){
       doc = jsdom('<div id="lst-ib"></div>')
    })

    it('creates a html list with id languageDropdownList', function(){
      console.log(languagesView.createLanguageDropdown(doc).id);
      expect(languagesView.createLanguageDropdown(doc).id).to.equal("languageDropdownList")
    });

    it('creates a html list with onChange function', function(){
      expect(typeof(languagesView.createLanguageDropdown(doc).onchange)).to.equal("function")
    });

    it('creates a html list with 4 options as child nodes', function(){
      expect(languagesView.createLanguageDropdown(doc).childNodes.length).to.equal(12)
    });

    it('creates list with first option value Choose a Language', function(){
      expect(languagesView.createLanguageDropdown(doc).childNodes[0].value).to.equal("Choose a technology")
    });

    it('creates list with first option innerHTML Choose a Language', function(){
      expect(languagesView.createLanguageDropdown(doc).childNodes[0].innerHTML).to.equal("Choose a technology")
    });
  });

  // describe('#createVersionDropdown', function(){
  //   // var ourDocument;
  //   // var element;
  //   // beforeEach(function(){
  //   //   ourDocument = jsdom('<div id="lst-ib"><div id="elem"></div></div>');
  //   //   element = ourDocument.getElementById('elem')
  //   // });
  //
  //   it('returns a html element with id versionDropdownList', function(){
  //     var ourDocument = jsdom('<div id="lst-ib"><div id="elem"></div></div>');
  //     var element = ourDocument.getElementById('elem');
  //
  //     stub(ourDocument, 'createElement');
  //     ourDocument.createElement.withArgs('select').returns(element);
  //     expect(languagesView.createVersionDropdown("Ruby", ourDocument).id).to.equal("versionDropdownList")
  //   });
  //   //
    // it('returns a html element with id versionDropdownList', function(){
    //   expect(languagesView.createVersionDropdown("Ruby", ourDocument).id).to.equal("versionDropdownList")
    // });
    //
    // it('calls create dummy object with correct parameters', function(){
    //   var chai = require('chai');
    //   var spies = require('chai-spies');
    //
    //   chai.use(spies);
    //   var spy = chai.spy.on(languagesView, 'createDummyOption');
    //   languagesView.createVersionDropdown("Ruby", ourDocument)
    //   expect(spy).to.have.been.called();
    // });

  // });

  describe('generateVersionOptions', function(){
    var ourDocument;
    beforeEach(function(){
      ourDocument = jsdom('<div id="lst-ib" ><a id="list"></a></div>');
    })


    it('adds list of version options to the version dropdown with 2 choose a version options', function(){
      var dropdown = ourDocument.getElementById("list");
      languagesView.generateVersionOptions(dropdown, "Ruby", ourDocument);
      expect(dropdown.childNodes[0].value).to.equal("Choose a version");
    });
  });

  describe('#createTopicDropdown', function(){
    var ourDocument;

    beforeEach(function(){
       ourDocument = jsdom ('<body>'+
                                    'Google Search:'+
                                      '<input type="text" id="lst-ib" value="ruby array">' +
                                  '</body>');
    })

    it('returns a select element', function(){
      expect(languagesView.createTopicDropdown(ourDocument).tagName).to.equal("SELECT")
    });

    it('returns a select element with id topicDropdownList', function(){
      expect(languagesView.createTopicDropdown(ourDocument).id).to.equal("topicDropdownList")
    });

    it('calls create dummy object with correct parameters', function(){
      var chai = require('chai');
      var spies = require('chai-spies');
      chai.use(spies);
      var spy = chai.spy.on(languagesView, 'createDummyOption');
      languagesView.createTopicDropdown(ourDocument)
      expect(spy).to.have.been.called();
    });
  });

  describe('#generateTopicOptions', function(){
    var ourDocument = jsdom ('<body>'+
                                  'Google Search:'+
                                    '<input type="text" id="lst-ib" value="ruby array">' +
                                '</body>');
    it('adds list of topic options to the topic dropdown with 1 choose a version options', function(){
      var dropdown = languagesView.createTopicDropdown(ourDocument)
      languagesView.generateTopicOptions(dropdown, "Ruby", ourDocument)
      expect(dropdown.childNodes[0].value).to.equal("Choose a topic")
    });

    it('adds list of topic options to the topic dropdown with 2 choose a version options', function(){
      var dropdown = languagesView.createTopicDropdown(ourDocument)
      languagesView.generateTopicOptions(dropdown, "Ruby", ourDocument)
      expect(dropdown.childNodes[2].value).to.equal("ARGF")
    });
  });

  describe('#createSubmitSearchButton', function(){
    var ourDocument = jsdom ('<body>'+
                                  'Google Search:'+
                                    '<input type="text" id="lst-ib" value="ruby array">' +
                                '</body>');
    it('returns a html button element', function(){
      expect(languagesView.createSubmitSearchButton(ourDocument).tagName).to.equal("BUTTON")
    });

    it('returns a html button element with id submitSearchButton', function(){
      expect(languagesView.createSubmitSearchButton(ourDocument).id).to.equal("submitSearchButton")
    });

    it('returns a html button element with a function onclick', function(){
      expect(typeof(languagesView.createSubmitSearchButton(ourDocument).onclick)).to.equal("function")
    });

    it('returns a html button element with innerHTML search', function(){
      expect(languagesView.createSubmitSearchButton(ourDocument).innerHTML).to.equal("SEARCH")
    });
  });

  // describe('#createLanguageDiv', function(){
  //   it('returns a html element of type div', function(){
  //     var languagesView = new LanguagesView;
  //     expect(languagesView.createLanguageDiv().tagName).to.equal('DIV')
  //   });
  //
  //   it('returns a html element with id language', function(){
  //     var languagesView = new LanguagesView;
  //     expect(languagesView.createLanguageDiv().id).to.equal('language')
  //   });
  //
  //   it('returns a html element with four child nodes', function(){
  //     var languagesView = new LanguagesView;
  //     expect(languagesView.createLanguageDiv().childNodes.length).to.equal(4)
  //   });
  //
  //   it('returns a html element with first child node a language dropdown', function(){
  //     var languagesView = new LanguagesView;
  //     expect(languagesView.createLanguageDiv().childNodes[0].id).to.equal("languageDropdownList")
  //   });
  //
  //   it('returns a html element with second child node a version dropdown', function(){
  //     var languagesView = new LanguagesView;
  //     expect(languagesView.createLanguageDiv().childNodes[1].id).to.equal("versionDropdownList")
  //   });
  //
  //   it('returns a html element with third child node a topic dropdown', function(){
  //     var languagesView = new LanguagesView;
  //     expect(languagesView.createLanguageDiv().childNodes[2].id).to.equal("topicDropdownList")
  //   });
  //
  //   it('returns a html element with fourth child node a search button', function(){
  //     var languagesView = new LanguagesView;
  //     expect(languagesView.createLanguageDiv().childNodes[3].id).to.equal("submitSearchButton")
  //   });
  // });


  describe('#addLinktoTag', function(){
    var ourDocument = jsdom ('<body>'+
                                  'Google Search:'+
                                    '<input type="text" id="lst-ib" value="ruby array">' +
                                    '<h1 id="link"></h1>' +
                                '</body>');
    it('adds a href as matches the link fed', function(){
      var link = ourDocument.getElementById('link');
      var officialDocLink = "http://www.google.co.uk";
      languagesView.addLinktoTag(officialDocLink, "Ruby", "2.4.0", "array", "Ruby-doc", ourDocument);
      expect(link.href).to.equal("http://www.google.co.uk");
    });
  });

  // describe('#topicDropdownChangeEvent', function(){
  //   var ourDocument = jsdom ('<body>'+
  //                                 'Google Search:'+
  //                                   '<input type="text" id="lst-ib" value="ruby array">' +
  //                               '</body>');
  //   it('calls generateTopicOptions with correct arguments', function(){
  //     var topiclist = ourDocument.createElement('option')
  //     ourDocument.getElementById.withArgs('topicDropdownList').returns(topiclist)
  //     var langoption = ourDocument.createElement('option')
  //     stub(ourDocument, 'querySelector');
  //     ourDocument.querySelector.withArgs('#languageDropdownList').returns(langoption)
  //     ourDocument.querySelector("#languageDropdownList").value="thelanguage"
  //
  //     stub(LanguagesView.prototype, 'generateTopicOptions');
  //     var spy = chai.spy.on(LanguagesView.prototype, 'generateTopicOptions');
  //     languagesView.topicDropdownChangeEvent();
  //     expect(spy).to.have.been.called.with(topiclist, "thelanguage");
  //   });
  // });

  // describe('#versionDropdownChangeEvent', function(){
  //   it('calls generateTopicOptions', function(){
  //     var versionlist = document.createElement('option')
  //     document.getElementById.withArgs('versionDropdownList').returns(versionlist)
  //     var langoption = document.createElement('option')
  //     document.querySelector.withArgs('#languageDropdownList').returns(langoption)
  //     document.querySelector("#languageDropdownList").value="thelanguage"
  //     stub(LanguagesView.prototype, 'generateVersionOptions');
  //     var spy = chai.spy.on(LanguagesView.prototype, 'generateVersionOptions');
  //     languagesView.versionDropdownChangeEvent()
  //     expect(spy).to.have.been.called.with(versionlist, "thelanguage");
  //   });
  // });

  describe('#createDropdownDiv', function(){
    var ourDocument = jsdom ('<body>'+
                                  'Google Search:'+
                                    '<input type="text" id="lst-ib" value="ruby array">' +
                                '</body>');

    it('returns a div element', function(){
      expect(languagesView.createDropdownDiv(ourDocument).tagName).to.equal('DIV')
    })

    it('returns a div element with 4 child nodes', function(){
      expect(languagesView.createDropdownDiv(ourDocument).childNodes.length).to.equal(4)
    })

    it('returns a div element with 4 child nodes with one language dropdow', function(){
      expect(languagesView.createDropdownDiv(ourDocument).childNodes[0].id).to.equal("languageDropdownList")
    })

    it('returns a div element with 4 child nodes with one version dropdown', function(){
      expect(languagesView.createDropdownDiv(ourDocument).childNodes[1].id).to.equal("versionDropdownList")
    })

    it('returns a div element with 4 child nodes with one topic dropdown', function(){
      expect(languagesView.createDropdownDiv(ourDocument).childNodes[2].id).to.equal("topicDropdownList")
    })

    it('returns a div element with 4 child nodes with one submit search button', function(){
      expect(languagesView.createDropdownDiv(ourDocument).childNodes[3].id).to.equal("submitSearchButton")
    })


  })


  // describe('#submitSearchButton', function(){
  //   it('calls language#generateOfficialDocsURL with correct arguments', function(){
  //     var langoption = document.createElement('option')
  //     var versionoption = document.createElement('option')
  //     var topicoption = document.createElement('option')
  //     document.querySelector.withArgs('#languageDropdownList').returns(langoption)
  //     document.querySelector("#languageDropdownList").value="ruby"
  //     document.querySelector.withArgs('#versionDropdownList').returns(versionoption)
  //     document.querySelector("#versionDropdownList").value="aversion"
  //     document.querySelector.withArgs('#topicDropdownList').returns(topicoption)
  //     document.querySelector("#topicDropdownList").value="atopic"
  //
  //     var spy = chai.spy.on(Ruby.prototype, 'generateOfficialDocsURL');
  //     languagesView.submitSearchButtonEvent();
  //
  //     expect(spy).to.have.been.called.with("aversion", "atopic");
  //   });
  //
  //   it('calls addLinktoTag with correct arguments', function(){
  //     var langoption = document.createElement('option')
  //     var versionoption = document.createElement('option')
  //     var topicoption = document.createElement('option')
  //     document.querySelector.withArgs('#languageDropdownList').returns(langoption)
  //     document.querySelector("#languageDropdownList").value="ruby"
  //     document.querySelector.withArgs('#versionDropdownList').returns(versionoption)
  //     document.querySelector("#versionDropdownList").value="aversion"
  //     document.querySelector.withArgs('#topicDropdownList').returns(topicoption)
  //     document.querySelector("#topicDropdownList").value="atopic"
  //
  //     var lang = new Ruby();
  //     var url = lang.generateOfficialDocsURL('aversion', 'atopic');
  //
  //     stub(this, 'addLinktoTag')
  //     var spy = require('sinon').spy(addLinktoTag);
  //     submitSearchButtonEvent();
  //     addLinktoTag()
  //
  //     expect(spy).to.be.called();
  //   });
  // });

  describe('fillInVersion', function(){
    it('fills in the given version', function(){
        var aDoc = jsdom('<div id="languageDropdownList"><div id="versionDropdownList"></div><></div>');
        aDoc.getElementById('languageDropdownList').value = "Ruby"
        aDoc.getElementById('versionDropdownList').value = "Choose a version"
        languagesView.fillInVersion(aDoc);
        expect(aDoc.getElementById('versionDropdownList').value).to.equal("2.4.0")
    });
  });

  describe('languagesDiv', function(){
    it('calls functions as expected', function(){
      stub(LanguagesView.prototype, 'createLanguagesDiv');
      stub(LanguagesView.prototype, 'createLanguagesTitle');
      var divspy = chai.spy.on(LanguagesView.prototype, 'createLanguagesDiv');
      var titlespy = chai.spy.on(LanguagesView.prototype, 'createLanguagesTitle');
      var aDoc = jsdom('<div id="languageDropdownList"><div id="versionDropdownList"></div><></div>');
      var div = aDoc.getElementById('languageDropdownList');
      languagesView.languagesDiv(div, aDoc);
      expect(divspy).to.have.been.called();
      expect(titlespy).to.have.been.called();
    });
  });

  describe('insertDropdownIntoLanguages', function(){
    it('inserts a div into languages', function(){
      var aDoc = jsdom('<div id="languageDropdownList"><div id="versionDropdownList"></div><></div>');
      var langdiv = aDoc.getElementById('languageDropdownList')
      stub(LanguagesView.prototype, 'createDropdownDiv');
      var anotherdiv = aDoc.createElement('div')
      stub(HTMLDivElement.prototype, 'insertAdjacentElement')
      // languagesView.insertDropdownIntoLanguages(langdiv, aDoc);
    });
  });
});
