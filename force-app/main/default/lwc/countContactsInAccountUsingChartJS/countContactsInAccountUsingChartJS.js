import { LightningElement, api, track, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountRelatedContactApex.getAccounts';
import pdflib from "@salesforce/resourceUrl/pdflib";
import { loadScript } from "lightning/platformResourceLoader";

export default class CountContactsInAccountUsingChartJS extends LightningElement {

    chartConfiguration;
    s1 = ['gg', 'gg', 'hh', 'hh'];

    renderedCallback() {
    loadScript(this, pdflib).then(() => {});
  }

    connectedCallback() {
        console.log('>s1', this.s1.length);
    }


    @wire(getAccounts) wiredAccounts({ data, error }) {
        if (error) {
            this.error = error;
            this.chartConfiguration = undefined;
        } else if (data) {
            let chartContacts = [];
            let chartLabel = [];
            var count = 0;
            const fillPattern = [];
            const fillBorder = [];
            
            console.log('>>>>>>>', data);

            for (let key in data) {
                chartLabel.push(key);
                chartContacts.push(data[key]);
                count = count + 1;
                
            }
            console.log('value of chartlabel', chartLabel);
            console.log('value of chartContacts', chartContacts);

            for(var i=0; i<(count/6); i++){
                fillPattern.push(   "rgba(255, 99, 132, 0.2)",
                                    "rgba(54, 162, 235, 0.2)",
                                    "rgba(255, 206, 86, 0.2)",
                                    "rgba(75, 192, 192, 0.2)",
                                    "rgba(153, 102, 255, 0.2)",
                                    "rgba(255, 159, 64, 0.2)");
            }

            for(var i=0; i<(count/6); i++){
                fillBorder.push(    "rgba(255, 99, 132, 1)",
                                    "rgba(54, 162, 235, 1)",
                                    "rgba(255, 206, 86, 1)",
                                    "rgba(75, 192, 192, 1)",
                                    "rgba(153, 102, 255, 1)",
                                    "rgba(255, 159, 64, 1)");
            }

            this.chartConfiguration = {
                type: 'bar',
                data: {
                    datasets: [{
                        label: 'Contacts',
                        data: chartContacts,
                        backgroundColor: fillPattern,
                        borderColor: fillBorder,
                        borderWidth: 1

                    },
                    ],
                    labels: chartLabel,
                },
                options: {
                    scales: {
                        x: {
                           
                            ticks: {
                                // For a category axis, the val is the index so the lookup via getLabelForValue is needed
                                callback: function(val, index) {
                                    // Hide every 2nd tick label
                                    return index % 2 === 0 ? this.chartLabel(val) : '';
                                },
                                color: 'red',
                            }
                        },
                                // grid: {
                                //     offset: true
                                //   },
                                //   time: {
                                //     unitStepSize: 1
                                //   },
                                //   ticks: {
                                //     autoSkip: false,
                                //     callback: function(val, index) {
                                //                 // Hide every 2nd tick label
                                //                 return index % 2 === 0 ? this.chartLabel(val) : '';
                                //             },
                                //   }
                                
                            // },
                            yAxes: [{
                                display: true,
                                ticks: {
                                    beginAtZero: true   // minimum value will be 0.
                                }
                            }]
                        
                    }
                }
            };
            console.log('data => ', data);
            this.error = undefined;
        }
    }


    async createPdf() {
        const url = 'https://test.digg.ai/insights/cmo/cohort'
        const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
        const pdfDoc = await pdflib.PDFDocument.load(existingPdfBytes);
        const helveticaFont = await pdfDoc.embedFont(pdflib.StandardFonts.Helvetica);

        const page = pdfDoc.addPage();
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();
        

        const pdfBytes = await pdfDoc.save();
        this.saveByteArray("Cohort Report", pdfBytes);
    }

    saveByteArray(pdfName, byte) {
        var blob = new Blob([byte], { type: "application/pdf" });
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        var fileName = pdfName;
        link.download = fileName;
        link.click();
    }
  
}