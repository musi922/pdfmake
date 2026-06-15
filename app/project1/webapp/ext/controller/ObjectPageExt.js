sap.ui.define([], () => {
    "use strict";

    return {
        downloadPDF: function (oBindingContext) {
            try {
                const sID = oBindingContext?.getProperty("ID");
                if (!sID) return sap.m.MessageToast.show("Konnte die ID des Förderprogramms nicht ermitteln.");

                window.open(`/pdf/${encodeURIComponent(sID)}`, "_blank");
            } catch (e) {
                sap.m.MessageToast.show(`PDF-Download fehlgeschlagen: ${e.message}`);
                console.error("PDF download error:", e);
            }
        }
    };
});
