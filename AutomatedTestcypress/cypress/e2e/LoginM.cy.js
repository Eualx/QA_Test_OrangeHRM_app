import Login from "../support/modules/Login";

describe('Login Tests with Parameterization', () => {
    let loginpage;
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false; // Prevent Cypress from failing the test on app errors
    });
    

    beforeEach(() => {
        loginpage = new Login();
        loginpage.visit();
    });


    it('Login Test using data from Excel', () => {

     

        cy.task("readExcelFile", "cypress/fixtures/data/logindata.xlsx").then((data) => {
            data.forEach(row => {
                

                loginpage.login(row.Username, row.Password);

                if (row["Expected Result"] === 'Dashboard') {
                    cy.url().should('include', '/dashboard');
                    cy.contains('Dashboard').should('be.visible');
                    loginpage.getlogout()
                } else {
                    cy.contains(row["Expected Result"]).should('be.visible');
                    cy.url().should('include', '/auth/login');
                }
            });
        });
    });

    it('should ensure the password field is encrypted', () => {
        loginpage.getpassword().should('have.attr', 'type', 'password');

        loginpage.getpassword().type('test12345');

        // Ensure the password input remains encrypted (not visible as plain text)
        loginpage.getpassword().should('have.attr', 'type', 'password');
    });

   

});
