/// <reference types="Cypress" />

context('Action',() => {
  
  it("Check Gmail Integration", function() {
    cy.task('gmail:get-messages',{
        options: {
          from: "shahzadtalks@gmail.com",
          to: Cypress.env('UserEmailId'),
          subject: "Check Email Integration",
          include_body : true
        }
      })
      .then(messages => {
        assert.isAtLeast(
          messages.length,
          1,
          "Expected to find at least one email, but none were found!"
        );
        const body = messages[0].body.text;
        assert.include(body,
          "Sending this email to check email integration",
          "Validate email body text")

        //validate linked link is prenset
        assert.include(body,
          "<https://www.linkedin.com/in/shahzad-ali-4bb99916/>",
          "Validate email body link")        
      })
  })
})


