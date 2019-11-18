/// <reference types="Cypress" />

context('Action',() => {
  
  it('Navigate to home page', () => {
    
    cy.visit('https://www.bayzat.com')
    //To handle uncaught exception on home page load
    cy.on('uncaught:exception', (err, runnable) => {
      return false
    })
    //verify login menu is present
    cy.get('.menu__login').should('have.class','menu__login')

  })

  it('Navigate to login page', () => {
    cy.get('.menu__login > a').eq(1). as('loginBtn')
    cy.get('@loginBtn').should('have.class','js-link-logged-out')
    cy.get('@loginBtn').click()

    //varify url have login
    cy.location('pathname').should('include','login');
  })

  it('Login to Bayzat Application', () => {
    userLogin()

    //verify url have dashboard
    cy.location('pathname').should('equal','/enterprise/dashboard/index');   

  })
    
  it('Add employee 1 details', () => {

    cy.get('.main-menu__link[data-external-id="add-employees-link"]').as('MenuAddEmployeeBtn').scrollIntoView().click()
    //Loign Again
    userLogin()

    //check for add employee button
    cy.get('.btn-primary[href="/enterprise/dashboard/employees/create"]').should('have.text','Add Employee').as('addEmployeeBtn')
    cy.get('@addEmployeeBtn').click()

    
    addEmployeeDetais(Cypress.env('UserFirstName'),Cypress.env('UserLastName'),Cypress.env('UserEmailId'))
    cy.get('.btn-link').next('button').should('have.text','Create').as('createBtn');
    cy.get('@createBtn').click();

    //verify success msg
    cy.get('.media-body > .mar-no').should('have.text','Employee successfully added and invited to Bayzat Benefits')
    cy.wait(5000)
  })

  it('Add employee 2 details', () => {

    cy.get('.main-menu__link[data-external-id="add-employees-link"]').as('MenuAddEmployeeBtn').scrollIntoView().click()
    //Loign Again
    userLogin()

    //check for add employee button
    cy.get('.btn-primary[href="/enterprise/dashboard/employees/create"]').should('have.text','Add Employee').as('addEmployeeBtn')
    cy.get('@addEmployeeBtn').click()

    
    addEmployeeDetais(Cypress.env('User2FirstName'),Cypress.env('User2LastName'),Cypress.env('User2EmailId'))
    cy.get('.btn-link').next('button').should('have.text','Create').as('createBtn');
    cy.get('@createBtn').click();

    //verify success msg
    cy.get('.media-body > .mar-no').should('have.text','Employee successfully added and invited to Bayzat Benefits')
    cy.wait(5000)
  })

  it("Check email is delievered for employee 1", function() {
    cy
      .task('gmail:check', {
        from: Cypress.env('FromEmailId'),
        to: Cypress.env('UserEmailId'),
        subject: Cypress.env('EmailSubject')
      })
      .then(email => {
        assert.isNotNull(email,'Email was not found')        
      })

    })

  it("Check email content for employee 1", function() {
    cy.task('gmail:get-messages',{
        options: {
          from: Cypress.env('FromEmailId'),
          to: Cypress.env('UserEmailId'),
          subject: Cypress.env('EmailSubject'),
          include_body : true
        }
      })
      .then(messages => {
        assert.isAtLeast(
          messages.length,
          1,
          "Expected to find at least one email, but none were found!"
        );

        //it is failing at below step hence not able to pick activation link from email body
        const body = messages[0].body.text;
        assert.include(body,
          "Bayzat Benefits is a part of your employee experience",
          "Validate email body text")
      })
  })


  it('Search and Verify employee 1 details then delete it', () => {
    cy.get('.main-menu__link[data-external-id="view-team-link"]').scrollIntoView().click()
    userLogin()    
    searchEmployee(Cypress.env('UserFirstName') +' '+ Cypress.env('UserLastName'))
    verifyEmployeeDetails()
    selectAndDeleteEmployee()
  })

  it('Search and Verify employee 2 details then delete it', () => {
    cy.get('.main-menu__link[data-external-id="view-team-link"]').scrollIntoView().click()
    userLogin()    
    searchEmployee(Cypress.env('User2FirstName') +' '+ Cypress.env('User2LastName'))
    verifyEmployeeDetails()
    selectAndDeleteEmployee()
  })

  it('Logout from bayzat application', () => {

    cy.get('.main-menu__link[data-external-id="logout-link"]').scrollIntoView().click()
    //Verify page post logout because of defect it is failing
    cy.location('href').should('have.text','https://www.bayzat.com')

  })

  function addEmployeeDetais(firstName,lastName,emailAddress){
    cy.get('[name="firstName"]').type(firstName)
    cy.get('[name="lastName"]').type(lastName)
    cy.get('[name="workEmail"]').type(emailAddress)
  }

 //Login function
  function userLogin() {
    
    cy.wait(3000)
    //Login 
    cy.get('[name="username"]').type(Cypress.env('LoginUser'));
    cy.get('[name="password"]').type(Cypress.env('LoginPassword'));
    cy.get('.btn-login').click();
    cy.wait(3000)
  }

  //Search function
  function searchEmployee(employee){
    cy.get('.search__input').type(employee,{delay : 20}).type('{enter}')
  }

  //verify function 
  function verifyEmployeeDetails(){
    cy.get('.js-employee-list tbody tr').should('have.length','1').as('employeeData')
    cy.get('@employeeData').find('td').should('have.length',7)
  }

   //Select and Delete function
  function selectAndDeleteEmployee(){
    
    cy.get('.js-employee-list tbody tr').find('td').eq(0).find('i').click()
    cy.get('.mar-btm.text-right i.fa-trash-o').as('deleteEmployeBtn').should('be.visible')
    
    cy.get('@deleteEmployeBtn').click()

    //Click on confirm button
    cy.get('.modal-footer .btn-danger').should('be.visible').should('have.text','Confirm').as('ConfrimDeleteBtn')
    cy.get('@ConfrimDeleteBtn').click()
    
    //verify delete message
    cy.get('.media-body > .mar-no').should('have.text','1 employee has  been deleted!')

  } 

})


