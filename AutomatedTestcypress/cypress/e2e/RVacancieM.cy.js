import Login from "../support/modules/Login";
import Vacancie from "../support/modules/Vacancie";

describe('Recruitment Tests with DDT', () => {
    let loginpage;
    let VacanciePage;

    beforeEach(() => {
        loginpage = new Login();
        VacanciePage = new Vacancie();

        loginpage.visit();
        loginpage.login('Admin', 'admin123');
    });

    afterEach(() => {
        cy.log('Test case completed.');
    });

    it('should add a new vacancy using data from Excel', () => {
        cy.task("readExcelFile", "cypress/fixtures/data/vacancies_test_data.xlsx").then((data) => {
            data.forEach(row => {
                cy.log(`Processing: ${row.JobTitle}`);

                VacanciePage.navigateToRecruitment();
                VacanciePage.clickAddVacancy();
                VacanciePage.enterJobTitle(row.JobTitle);
                VacanciePage.enterNumberofPosition(row.Numberofposition);
                VacanciePage.selectVacancyName(row.VacancyName);
                VacanciePage.selectHiringManager(row.HiringManager);
                VacanciePage.enterJobDescription(row.JobDescription);
                

                VacanciePage.saveVacancy();
               
               
                // Verifying if the vacancy was saved successfully
                // VacanciePage.verifyVacancySaved('Successfully Saved');
                // if ("Successfully Saved") {
                // VacanciePage.verifyVacancySaved(row.ExpectedMessage, row.JobTitle);
                    
                // } else {
                //     VacanciePage.verifyRequiredFieldErrors();
                // }
            });
        });
    });

    it('should not add a vacancy without required fields (DDT)', () => {
        cy.task("readExcelFile", "cypress/fixtures/data/vacancies_test_data_1.xlsx").then((data) => {
            data.filter(row => row.MissingFields === 'Yes').forEach(row => {
                cy.log(`Processing: ${row.JobTitle} (Missing Fields Test)`);
// skip jobtitle and hiring manager
                VacanciePage.navigateToRecruitment();
                VacanciePage.clickAddVacancy();
                VacanciePage.selectVacancyName(row.VacancyName);
                // VacanciePage.selectHiringManager(row.HiringManager);
                VacanciePage.enterJobDescription(row.JobDescription);
                VacanciePage.saveVacancy();

                // Expect error messages for missing fields
                VacanciePage.verifyRequiredFieldErrors();
            });
        });
    });

    it('should search vacancies using filters and verify the results', () => {
        VacanciePage.navigateToRecruitment();
        VacanciePage.searchVacancy( 'Software Engineer','Software Engineer', 'James');
        VacanciePage.verifySearchResults('Software Engineer');
    });

    it('should search vacancies with incorrect data', () => {
        VacanciePage.navigateToRecruitment();
        VacanciePage.searchVacancy( 'test','Software Engineer', 'James');
        VacanciePage.verifySearchResultstwo('No Records Found');
    });

    it('edit vacancy',()=>{
        VacanciePage.navigateToRecruitment();
        //VacanciePage.searchVacancy('Software Engineer', 'Rahul')
        VacanciePage.editVacancy('Software QA', 'QA Engineer','James Butler')
       })
it('delete Recored vacancy',()=>{
    VacanciePage.navigateToRecruitment();
    VacanciePage.deleteVacancy()
})
  
});
