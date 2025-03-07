class Login{
    visit(){
        cy.visit("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
       
    }
    getusername(){
       return cy.get('[name="username"]')
      
    }
    getpassword(){
        return cy.get('[name="password"]')
    } 
    getclick(){
        return cy.get('button[type="submit"]');
     
              }

              getlogout(){
                 cy.get('.oxd-userdropdown-name').click()
                 cy.get(':nth-child(4) > .oxd-userdropdown-link').click()

              }

              login(user, pass){
                   this.visit()
                  if(user) this.getusername().type(user);
                  if(pass) this.getpassword().type(pass)
                   this.getclick().click()
                
              }

              verifyPasswordEncryption(password) {
                const passwordField = this.getpassword();
                
                // Ensure the password field exists and is of type 'password'
                passwordField.should('exist');
                passwordField.should('have.attr', 'type', 'password');
        
                // Type password and verify it remains encrypted
                passwordField.type(password);
                passwordField.should('have.attr', 'type', 'password');
            }
        
          

}
export default Login