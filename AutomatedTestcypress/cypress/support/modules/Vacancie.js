class Vacancie {
    navigateToRecruitment() {
        cy.contains('Recruitment').click();
        cy.contains('Vacancies').click();
    }

    clickAddVacancy() {
        cy.get('button').contains('Add').click();
    }

   
    

    enterJobTitle(title) {
        // cy.get('.oxd-form > :nth-child(1) > :nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-input')
        //   .type(title);
        if (title) {
            cy.get('.oxd-form > :nth-child(1) > :nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-input')
              .type(title);
        } else {
            cy.log(" Skipping Job Title - Field is empty");
        }
    }

    selectVacancyName(Vname) {
        // cy.get('.oxd-select-text-input').click();
        // cy.get('.oxd-select-dropdown').contains(category).click();
        if (Vname) {
            cy.get('.oxd-select-text-input').click();
            cy.get('.oxd-select-dropdown').contains(Vname).click();
        } else {
            cy.log("Skipping Job Category - Field is empty");
        }
    }

    

    selectHiringManager(managerName) {
        // cy.get('.oxd-autocomplete-text-input > input').type(managerName);
        // cy.get('.oxd-autocomplete-dropdown').contains(managerName).click();
        if (managerName) {
            cy.get('.oxd-autocomplete-text-input > input').type(managerName);
            cy.get('.oxd-autocomplete-dropdown').contains(managerName).click();

        } else {
            cy.log("Skipping Hiring Manager - Field is empty");
        }
    }

    enterJobDescription(description) {
        // cy.get('.oxd-textarea').type(description);
        if (description) {
            cy.get('.oxd-textarea').type(description);
        } else {
            cy.log("Skipping Job Description - Field is empty");
        }
    }

    enterNumberofPosition(Nposition){
        cy.get('.oxd-grid-2 > .oxd-grid-item > .oxd-input-group > :nth-child(2) > .oxd-input').type(Nposition)
    }

    saveVacancy() {
        cy.get('button[type="submit"]').click();
        
    }
    

    verifyVacancySaved(successMessage, jobTitle) {
        cy.contains(successMessage).should('be.visible');
        cy.contains(jobTitle).should('be.visible');
     

    }

    verifyRequiredFieldErrors() {
        cy.contains('Required').should('be.visible');
    }

    searchVacancy(vacancyname,jobTitle, hiringManager) {
        // cy.get(':nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-select-wrapper > .oxd-select-text > .oxd-select-text--after > .oxd-icon').click();
        // cy.get('.oxd-select-dropdown').contains(jobTitle).click();
        if (jobTitle) {
            cy.get(':nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-select-wrapper > .oxd-select-text > .oxd-select-text--after > .oxd-icon').click();
            cy.get('.oxd-select-dropdown').contains(jobTitle).click();
        }
if(vacancyname){
        cy.get(':nth-child(2) > .oxd-input-group > :nth-child(2) > .oxd-select-wrapper > .oxd-select-text > .oxd-select-text-input').click()
        cy.get('.oxd-select-dropdown').contains(vacancyname).click();
}

        // cy.get(':nth-child(3) > .oxd-input-group > :nth-child(2) > .oxd-select-wrapper > .oxd-select-text > .oxd-select-text-input').click();
        // cy.get('.oxd-select-dropdown').contains(hiringManager).click();
        if (hiringManager) {
            cy.get(':nth-child(3) > .oxd-input-group > :nth-child(2) > .oxd-select-wrapper > .oxd-select-text > .oxd-select-text-input').click();
            cy.get('.oxd-select-dropdown').contains(hiringManager).click();
        }

        cy.get('button').contains('Search').click();
    }

    verifySearchResults(jobTitle) {
        cy.contains(jobTitle).should('be.visible');
        // cy.contains(hiringManager).should('be.visible');
        // cy.contains(vacancyname).should('be.visible');
        // cy.contains(noresult).should('be.visible');

    }
    verifySearchResultstwo(noresult) {
    
        cy.contains(noresult).should('be.visible');

    }

    deleteVacancy(){
        cy.get(':nth-child(1) > .oxd-table-row > :nth-child(6) > .oxd-table-cell-actions > :nth-child(1) > .oxd-icon').click()
        cy.get('.oxd-button--label-danger').click()
    }
editVacancy(vacancyname,jobTitle, hiringManager){
    cy.get(':nth-child(1) > .oxd-table-row > :nth-child(6) > .oxd-table-cell-actions > :nth-child(2) > .oxd-icon').first().click()
    cy.get('.oxd-form > :nth-child(1) > :nth-child(1) > .oxd-input-group > :nth-child(2) > .oxd-input').clear()
    .type(vacancyname)
    cy.get('.oxd-select-text-input').click()
    cy.get('.oxd-select-dropdown', { timeout: 10000 }).should('be.visible').contains(jobTitle).click();
    cy.get('.oxd-autocomplete-text-input > input').clear().type(hiringManager, { delay: 200 })
    cy.get('.oxd-autocomplete-dropdown', { timeout: 10000 })
    .should('be.visible').contains(hiringManager).click();
    cy.get('.oxd-button--secondary').click(); // Save changes
    cy.get(':nth-child(4) > .oxd-grid-item > .oxd-switch-wrapper > label > .oxd-switch-input').click()
    cy.contains('Successfully Saved', { timeout: 10000 }).should('be.visible');

}

}

export default Vacancie;
