sap.ui.define([], function () {
    "use strict";

    return {
        downloadPDF: function (oBindingContext, aSelectedContexts) {
            try {
                var aContexts = aSelectedContexts || [];

                if (!Array.isArray(aContexts) || aContexts.length === 0) {
                    sap.m.MessageToast.show("Bitte wählen Sie zuerst einen Eintrag aus.");
                    return;
                }

                aContexts.forEach(function (oContext) {
                    var sID = oContext.getProperty("ID");
                    if (sID) {
                        window.open("/pdf/" + encodeURIComponent(sID), "_blank");
                    }
                });

            } catch (e) {
                sap.m.MessageToast.show("PDF-Download fehlgeschlagen: " + e.message);
                console.error("PDF download error:", e);
            }
        }
    };
});
