sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"project1/test/integration/pages/FoerderprogrammeList",
	"project1/test/integration/pages/FoerderprogrammeObjectPage",
	"project1/test/integration/pages/FinanzpositionenObjectPage"
], function (JourneyRunner, FoerderprogrammeList, FoerderprogrammeObjectPage, FinanzpositionenObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('project1') + '/test/flp.html#app-preview',
        pages: {
			onTheFoerderprogrammeList: FoerderprogrammeList,
			onTheFoerderprogrammeObjectPage: FoerderprogrammeObjectPage,
			onTheFinanzpositionenObjectPage: FinanzpositionenObjectPage
        },
        async: true
    });

    return runner;
});

