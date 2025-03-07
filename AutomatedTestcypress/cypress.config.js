const { defineConfig } = require('cypress');
const { beforeRunHook, afterRunHook } = require('cypress-mochawesome-reporter/lib');
const xlsx = require("xlsx")

module.exports = defineConfig({
// retries:{
//   runMode:1,
//   openMode:2
//   },
  projectId: "av5syz",
  reporter: 'cypress-mochawesome-reporter',
  video: true,
  // reporterOptions: {
  //   charts: true,
  //   reportPageTitle: 'custom-title',
  //   embeddedScreenshots: true,
  //   inlineAssets: true,
  //   saveAllAttempts: false,
  // },
  e2e: {
    setupNodeEvents(on, config) {
      on('before:run', async (details) => {
        console.log('override before:run');
        await beforeRunHook(details);
      });

      on('after:run', async () => {
        console.log('override after:run');
        await afterRunHook();
      });
      // define custom task
      on("task",{
           readExcelFile(filepath){
            try{
              const workbook= xlsx.readFile(filepath);
              const firstSheetName = workbook.SheetNames[0];
              const sheet = workbook.Sheets[firstSheetName]
              const jsonfile= xlsx.utils.sheet_to_json(sheet)
              return jsonfile
            }
            catch(error){
               cy.error("file handling error", error)
               throw error;
            }
         
           }
      })
    },
  },
});
