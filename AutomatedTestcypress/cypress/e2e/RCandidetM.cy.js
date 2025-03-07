
// candidet witout parametrization 
import Login from "../support/modules/Login";
import Candidate from "../support/modules/Candidate";

describe('Candidate Management Tests', () => {
    let loginpage;
    let candidatePage;
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false; // Prevent Cypress from failing the test on app errors
    });

    beforeEach(() => {``
        loginpage = new Login();
        candidatePage = new Candidate();

        loginpage.visit();
        loginpage.login('Admin', 'admin123');
    });

    afterEach(() => {
        cy.log('Test case completed.');
    });

    it('should add multiple candidates from Excel file', () => {
        cy.task("readExcelFile", "cypress/fixtures/data/candidates.xlsx").then((candidateData) => {
            candidateData.forEach((candidate) => {
                cy.log(`Adding candidate: ${candidate.FirstName} ${candidate.LastName}`);

                candidatePage.navigateToCandidates();
                candidatePage.clickAddCandidate();
                candidatePage.enterCandidateDetails(
                    candidate.FirstName, 
                    candidate.LastName, 
                    candidate.Email, 
                    candidate.JobTitle,
                    candidate.Contact,
                    candidate.File
                );
                candidatePage.saveCandidate();
                
                candidatePage.verifyCandidateSaved('Successfully Saved', `${candidate.FirstName} ${candidate.LastName}`);
                candidatePage.shortlist()
            });
        });
    });

    it('should not add a candidate with empty fields', () => {
        cy.task("readExcelFile", "cypress/fixtures/data/candidates.xlsx").then((candidateData) => {
            candidateData.forEach((candidate) => {
        candidatePage.navigateToCandidates();
        candidatePage.clickAddCandidate();
        candidatePage.enterCandidateDetailstwo(
           
           
            candidate.Email, 
            candidate.JobTitle,
            candidate.Contact,
          
        );
        candidatePage.saveCandidate();
        candidatePage.verifyRequiredFieldErrors();
    })
})
    });

    // 🔹 **New Search Test Case**
    it('should search for candidates using filters and verify results', () => {
        candidatePage.navigateToCandidates();
        candidatePage.searchCandidate('Software Engineer', 'Software Engineer', 'James Butler', '2024-02-01', '2024-04-01');
        candidatePage.verifySearchResults('No Records Found', 'Software Engineer', 'James Butler');
    });
    it('search candidate by name of john',()=>{
        candidatePage.navigateToCandidates();
        candidatePage.searchCandidateone('John')
        
    })
    it('search candidate by status ',()=>{
        candidatePage.navigateToCandidates();
        candidatePage.searchCandidatetwo('Shortlisted')
    })

    it('delete Candidate ',()=>{
        candidatePage.navigateToCandidates();
        candidatePage.deleteCandidate()
    })
       it('edit Candidate',()=>{
        candidatePage.navigateToCandidates();
        candidatePage.clickAddCandidate();
        candidatePage.enterCandidateDetailsE('firstName', 'lastName', 'email@example.com')
        candidatePage.saveCandidate();
        candidatePage.editCandidate('janedie@example.com')
       })
     





});

