sap.ui.define([], function () {
    "use strict";

    return {
        downloadPDF: function (oBindingContext, aSelectedContexts) {
            try {
                var sID = null;

                if (oBindingContext && oBindingContext.getProperty) {
                    sID = oBindingContext.getProperty("ID");
                }

                if (!sID && Array.isArray(aSelectedContexts) && aSelectedContexts.length > 0) {
                    sID = aSelectedContexts[0].getProperty("ID");
                }

                if (!sID) {
                    sap.m.MessageToast.show("Konnte die ID des Förderprogramms nicht ermitteln.");
                    return;
                }

                window.open("/pdf/" + encodeURIComponent(sID), "_blank");

            } catch (e) {
                sap.m.MessageToast.show("PDF-Download fehlgeschlagen: " + e.message);
                console.error("PDF download error:", e);
            }
        }
    };
});
