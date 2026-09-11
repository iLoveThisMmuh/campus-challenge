/* =====================================================
   ALUMINIUM FABRICATION BILLING
   ===================================================== */


/* =====================================================
   INITIAL SETUP
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("invoiceDate").valueAsDate =
        new Date();

    generateDocumentNumber();

    // Create the permanent first item row
    addItem(false);

    // Use the actual logo file
    document.getElementById("printLogo").src = "AD logo.png";

    calculateTotals();

});


/* =====================================================
   DOCUMENT NUMBER
   ===================================================== */

function generateDocumentNumber() {

    let number =
        parseInt(
            localStorage.getItem("invoiceNumber") || "1"
        );

    document.getElementById("documentNumber").value =
        "INV-" + String(number).padStart(4, "0");
}


/* =====================================================
   ADD ITEM
   ===================================================== */

function addItem(canRemove = true) {

    const tbody =
        document.getElementById("itemsBody");

    const row =
        document.createElement("tr");

    row.innerHTML = `

        <td>
            <input
                type="text"
                class="description"
                placeholder="Example: Sliding Window"
                oninput="calculateTotals()">
        </td>

        <td>
            <input
                type="number"
                class="qty"
                value="1"
                min="0"
                oninput="calculateTotals()">
        </td>

        <td>
            <select class="unit" onchange="calculateTotals()">
                <option value="Sq.ft">Sq.ft</option>
                <option value="Nos">Nos</option>
                <option value="Pcs">Pcs</option>
                <option value="Meter">Meter</option>
                <option value="Kg">Kg</option>
                <option value="Set">Set</option>
            </select>
        </td>

        <td>
            <input
                type="number"
                class="rate"
                value="0"
                min="0"
                oninput="calculateTotals()">
        </td>

        <td class="amount">
            0.00
        </td>

        <td>

            ${
                canRemove
                ?
                `
                <button
                    type="button"
                    class="btn btn-red"
                    onclick="removeItem(this)">
                    X
                </button>
                `
                :
                `
                <span style="
                    color:#888;
                    font-size:12px;">
                    Fixed
                </span>
                `
            }

        </td>
    `;

    tbody.appendChild(row);

    calculateTotals();
}


/* =====================================================
   REMOVE ITEM
   ===================================================== */

function removeItem(button) {

    const row =
        button.closest("tr");

    row.remove();

    calculateTotals();
}


/* =====================================================
   CHECK VALID ITEM
   ===================================================== */

function isValidItem(row) {

    const description =
        row.querySelector(".description").value.trim();

    return description !== "";
}


/* =====================================================
   CALCULATE TOTALS
   ===================================================== */

function calculateTotals() {

    let subtotal = 0;

    const rows =
        document.querySelectorAll("#itemsBody tr");

    rows.forEach(function (row) {

        const qty =
            parseFloat(
                row.querySelector(".qty").value
            ) || 0;

        const rate =
            parseFloat(
                row.querySelector(".rate").value
            ) || 0;

        const amount =
            qty * rate;

        row.querySelector(".amount").textContent =
            amount.toFixed(2);

        if (isValidItem(row)) {
            subtotal += amount;
        }
    });


    const discount =
        parseFloat(
            document.getElementById("discount").value
        ) || 0;

    const advance =
        parseFloat(
            document.getElementById("advance").value
        ) || 0;

    const grandTotal =
        Math.max(0, subtotal - discount);

    const balance =
        Math.max(0, grandTotal - advance);


    document.getElementById("subtotal").textContent =
        subtotal.toFixed(2);

    document.getElementById("grandTotal").textContent =
        grandTotal.toFixed(2);

    document.getElementById("balance").textContent =
        balance.toFixed(2);
}


/* =====================================================
   PRINT
   ===================================================== */

function printInvoice() {

    // Update the separate invoice first
    updatePrintInvoice();

    // Open a new print window
    const printWindow =
        window.open(
            "",
            "_blank",
            "width=900,height=1200"
        );

    if (!printWindow) {

        alert(
            "Print window was blocked by the browser.\n\n" +
            "Please allow pop-ups for this website."
        );

        return;
    }


    const printContent =
        document.getElementById(
            "printInvoice"
        ).innerHTML;


    printWindow.document.open();

    printWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <meta charset="UTF-8">

            <title>
                ${document.getElementById("documentNumber").value}
            </title>

            <style>

                @page {
                    size: A4 portrait;
                    margin: 0;
                }

                * {
                    box-sizing: border-box;
                }

                html,
                body {
                    margin: 0;
                    padding: 0;
                    background: white;
                    font-family: Arial, sans-serif;
                }

                .invoice-paper {

                    width: 210mm;
                    min-height: 297mm;

                    margin: 0 auto;

                    padding: 15mm;

                    background: white;
                }

                .invoice-header {

                    display: flex;

                    justify-content: space-between;

                    align-items: flex-start;

                    border-bottom: 2px solid #222;

                    padding-bottom: 12px;

                    margin-bottom: 15px;
                }

                .company-print {

                    display: flex;

                    gap: 15px;

                    align-items: flex-start;
                }

                .print-logo {

                    width: 80px;

                    height: 80px;

                    object-fit: contain;
                }

                .company-print h1 {

                    margin: 0 0 6px;

                    font-size: 24px;
                }

                .company-print p {

                    margin: 3px 0;

                    font-size: 12px;
                }

                .document-title {

                    text-align: right;
                }

                .document-title h2 {

                    margin: 0 0 10px;

                    font-size: 25px;
                }

                .document-info {

                    font-size: 12px;

                    line-height: 1.8;
                }

                .document-info span {

                    display: inline-block;

                    width: 45px;
                }

                .customer-box {

                    border: 1px solid #ccc;

                    padding: 10px;

                    font-size: 12px;

                    margin-bottom: 15px;
                }

                .customer-box h3 {

                    margin: 5px 0;
                }

                .customer-box p {

                    margin: 4px 0;
                }

                .job-info {

                    display: flex;

                    gap: 35px;

                    border-top: 1px solid #ddd;

                    margin-top: 8px;

                    padding-top: 5px;
                }

                .invoice-table {

                    width: 100%;

                    border-collapse: collapse;

                    font-size: 11px;
                }

                .invoice-table th,
                .invoice-table td {

                    border: 1px solid #999;

                    padding: 7px;
                }

                .invoice-table th {

                    background: #eeeeee;
                }

                .invoice-table th:first-child,
                .invoice-table td:first-child {

                    width: 30px;

                    text-align: center;
                }

                .invoice-bottom {

                    display: flex;

                    justify-content: space-between;

                    margin-top: 20px;
                }

                .notes {

                    width: 50%;

                    font-size: 12px;
                }

                .notes p {

                    color: #555;
                }

                .print-totals {

                    width: 42%;

                    font-size: 12px;
                }

                .print-totals > div {

                    display: flex;

                    justify-content: space-between;

                    padding: 5px 0;

                    border-bottom: 1px solid #ddd;
                }

                .total-line {

                    font-size: 16px;

                    font-weight: bold;

                    border-top: 2px solid #222 !important;

                    border-bottom: 2px solid #222 !important;

                    padding: 8px 0 !important;
                }

                .balance-line {

                    font-size: 15px;

                    font-weight: bold;
                }

                .signatures {

                    display: flex;

                    justify-content: space-between;

                    margin-top: 80px;

                    text-align: center;

                    font-size: 12px;
                }

                .signatures > div {

                    width: 180px;
                }

                .signature-line {

                    border-top: 1px solid #555;

                    margin-bottom: 7px;
                }

                .invoice-footer {

                    text-align: center;

                    margin-top: 35px;

                    font-size: 10px;

                    color: #666;
                }

            </style>

        </head>


        <body>

            ${printContent}


            <script>

                window.onload = function() {

                    setTimeout(function() {

                        window.focus();

                        window.print();

                    }, 300);

                };


                window.onafterprint = function() {

                    setTimeout(function() {

                        window.close();

                    }, 300);

                };

            <\/script>

        </body>

        </html>

    `);

    printWindow.document.close();
}


/* =====================================================
   UPDATE PRINT INVOICE
   ===================================================== */

function updatePrintInvoice() {

    /*
       COMPANY DETAILS

       These are now hard-coded in the HTML,
       so we don't look for removed input fields.
    */

    document.getElementById(
        "printCompanyName"
    ).textContent =
        "Alu Design Aluminium Fabrication Works";


    document.getElementById(
        "printCompanyAddress"
    ).textContent =
        "Mastikatte, Mangalore, Karnataka";


    document.getElementById(
        "printCompanyMobile"
    ).textContent =
        "+91 96635 94319";


    document.getElementById(
        "printCompanyGST"
    ).textContent =
        "-";


    // Logo
    document.getElementById(
        "printLogo"
    ).src =
        "AD logo.png";


    /* DOCUMENT */

    document.getElementById(
        "printDocumentType"
    ).textContent =
        document.getElementById(
            "documentType"
        ).value;


    document.getElementById(
        "printDocumentNumber"
    ).textContent =
        document.getElementById(
            "documentNumber"
        ).value;


    document.getElementById(
        "printDate"
    ).textContent =
        formatDate(
            document.getElementById(
                "invoiceDate"
            ).value
        );


    /* CUSTOMER */

    document.getElementById(
        "printCustomerName"
    ).textContent =
        document.getElementById(
            "customerName"
        ).value.trim() || "-";


    document.getElementById(
        "printCustomerAddress"
    ).textContent =
        document.getElementById(
            "customerAddress"
        ).value.trim() || "-";


    document.getElementById(
        "printCustomerMobile"
    ).textContent =
        document.getElementById(
            "customerMobile"
        ).value.trim() || "-";


    /*
       Your current HTML does NOT have a Work Order field.
       Therefore we use "-".
    */

    document.getElementById(
        "printWorkOrder"
    ).textContent = "-";


    document.getElementById(
        "printSiteName"
    ).textContent =
        document.getElementById(
            "siteName"
        ).value.trim() || "-";


    /* ITEMS */

    const printItems =
        document.getElementById(
            "printItems"
        );

    printItems.innerHTML = "";

    let itemNumber = 1;


    document.querySelectorAll(
        "#itemsBody tr"
    ).forEach(function (row) {

        // Ignore completely empty item rows
        if (!isValidItem(row)) {
            return;
        }


        const description =
            row.querySelector(
                ".description"
            ).value.trim();


        const qty =
            row.querySelector(
                ".qty"
            ).value;


        const unit =
            row.querySelector(
                ".unit"
            ).value;


        const rate =
            parseFloat(
                row.querySelector(
                    ".rate"
                ).value
            ) || 0;


        const amount =
            parseFloat(
                row.querySelector(
                    ".amount"
                ).textContent
            ) || 0;


        const printRow =
            document.createElement("tr");


        printRow.innerHTML = `

            <td>${itemNumber}</td>

            <td>
                ${escapeHTML(description)}
            </td>

            <td>${qty}</td>

            <td>${unit}</td>

            <td>
                ₹ ${formatMoney(rate)}
            </td>

            <td>
                ₹ ${formatMoney(amount)}
            </td>

        `;


        printItems.appendChild(printRow);

        itemNumber++;

    });


    /* TOTALS */

    const subtotal =
        document.getElementById(
            "subtotal"
        ).textContent;


    const discount =
        parseFloat(
            document.getElementById(
                "discount"
            ).value
        ) || 0;


    const grandTotal =
        document.getElementById(
            "grandTotal"
        ).textContent;


    const advance =
        parseFloat(
            document.getElementById(
                "advance"
            ).value
        ) || 0;


    const balance =
        document.getElementById(
            "balance"
        ).textContent;


    document.getElementById(
        "printSubtotal"
    ).textContent =
        formatMoney(subtotal);


    document.getElementById(
        "printDiscount"
    ).textContent =
        formatMoney(discount);


    document.getElementById(
        "printGrandTotal"
    ).textContent =
        formatMoney(grandTotal);


    document.getElementById(
        "printAdvance"
    ).textContent =
        formatMoney(advance);


    document.getElementById(
        "printBalance"
    ).textContent =
        formatMoney(balance);

}


/* =====================================================
   DATE
   ===================================================== */

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }

    const date =
        new Date(
            dateString + "T00:00:00"
        );

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );
}


/* =====================================================
   MONEY
   ===================================================== */

function formatMoney(value) {

    const number =
        parseFloat(value) || 0;

    return number.toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );
}


/* =====================================================
   HTML SAFETY
   ===================================================== */

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}


/* =====================================================
   EXPORT
   ===================================================== */

function exportCSV() {

    const rows = [];


    rows.push([
        "Document Type",
        document.getElementById(
            "documentType"
        ).value
    ]);


    rows.push([
        "Document Number",
        document.getElementById(
            "documentNumber"
        ).value
    ]);


    rows.push([
        "Date",
        document.getElementById(
            "invoiceDate"
        ).value
    ]);


    rows.push([
        "Customer",
        document.getElementById(
            "customerName"
        ).value
    ]);


    rows.push([]);


    rows.push([
        "Description",
        "Qty",
        "Unit",
        "Rate",
        "Amount"
    ]);


    document.querySelectorAll(
        "#itemsBody tr"
    ).forEach(function (row) {

        if (!isValidItem(row)) {
            return;
        }


        rows.push([

            row.querySelector(
                ".description"
            ).value,

            row.querySelector(
                ".qty"
            ).value,

            row.querySelector(
                ".unit"
            ).value,

            row.querySelector(
                ".rate"
            ).value,

            row.querySelector(
                ".amount"
            ).textContent

        ]);

    });


    rows.push([]);


    rows.push([
        "Subtotal",
        document.getElementById(
            "subtotal"
        ).textContent
    ]);


    rows.push([
        "Discount",
        document.getElementById(
            "discount"
        ).value
    ]);


    rows.push([
        "Total",
        document.getElementById(
            "grandTotal"
        ).textContent
    ]);


    rows.push([
        "Advance",
        document.getElementById(
            "advance"
        ).value
    ]);


    rows.push([
        "Balance",
        document.getElementById(
            "balance"
        ).textContent
    ]);


    const csv =
        rows.map(function (row) {

            return row.map(function (cell) {

                return `"${String(cell)
                    .replace(/"/g, '""')}"`;

            }).join(",");

        }).join("\n");


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const link =
        document.createElement("a");


    link.href =
        URL.createObjectURL(blob);


    link.download =
        document.getElementById(
            "documentNumber"
        ).value + ".csv";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

}


/* =====================================================
   RESET
   ===================================================== */

function resetInvoice() {

    const confirmed =
        confirm(
            "Reset this invoice?\n\n" +
            "All customer, item and payment " +
            "details will be cleared."
        );


    if (!confirmed) {
        return;
    }


    document.getElementById(
        "customerName"
    ).value = "";


    document.getElementById(
        "customerMobile"
    ).value = "";


    document.getElementById(
        "customerAddress"
    ).value = "";


    document.getElementById(
        "siteName"
    ).value = "";


    document.getElementById(
        "discount"
    ).value = "0";


    document.getElementById(
        "advance"
    ).value = "0";


    document.getElementById(
        "documentType"
    ).value = "INVOICE";


    document.getElementById(
        "invoiceDate"
    ).valueAsDate =
        new Date();


    document.getElementById(
        "itemsBody"
    ).innerHTML = "";


    addItem(false);


    increaseDocumentNumber();

    generateDocumentNumber();

    calculateTotals();

}


/* =====================================================
   INCREASE DOCUMENT NUMBER
   ===================================================== */

function increaseDocumentNumber() {

    let number =
        parseInt(
            localStorage.getItem(
                "invoiceNumber"
            ) || "1"
        );


    number++;


    localStorage.setItem(
        "invoiceNumber",
        number
    );

}
