sap.ui.define([], () => {
    "use strict";

    return {
        downloadPDF: function (oBindingContext, aSelectedContexts) {
            try {
                const aContexts = aSelectedContexts || [];
                if (!aContexts.length) return sap.m.MessageToast.show("Bitte wählen Sie zuerst einen Eintrag aus.");

                aContexts.forEach(oContext => {
                    const sID = oContext.getProperty("ID");
                    if (sID) window.open(`/pdf/${encodeURIComponent(sID)}`, "_blank");
                });
            } catch (e) {
                sap.m.MessageToast.show(`PDF-Download fehlgeschlagen: ${e.message}`);
                console.error("PDF download error:", e);
            }
        }
    };
});
