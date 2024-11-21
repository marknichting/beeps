describe('template spec', () => {
  it('We are connected to the websocket', () => {
    cy.visit('http://localhost:3000');

    cy.get('[cy-data^="message"]')
      .should('exist')
      .then(($messages) => {
        const initialCount = $messages.length;
        cy.wait(3000); // Wait for more messages
        cy.get('[cy-data^="message"]').should(($newMessages) => {
          expect($newMessages.length).to.be.greaterThan(initialCount);
        });
      });
  });

  it('Metrics are updated', () => {
    cy.visit('http://localhost:3000');

    cy.get('[cy-data^="event-count"]')
      .should('exist')
      .then((element) => {
        const initialCount = parseInt(element.text());
        cy.wait(3000);
        cy.get('[cy-data^="event-count"]').should((newElement) => {
          expect(parseInt(newElement.text())).to.be.greaterThan(initialCount);
        });
      });

    cy.get('[cy-data^="connection-status"]').should('exist').should('have.text', 'Connected');

    cy.get('[cy-data^="event-rate"]')
      .should('exist')
      .then((element) => {
        const initialCount = parseInt(element.text());
        cy.wait(3000); // Wait for more messages
        cy.get('[cy-data^="event-rate"]').should((newElement) => {
          expect(parseInt(newElement.text())).to.not.equal(initialCount);
        });
      });

    cy.get('[cy-data^="time-elapsed"]')
      .should('exist')
      .then((element) => {
        const initialCount = parseInt(element.text());
        cy.wait(3000); // Wait for more messages
        cy.get('[cy-data^="time-elapsed"]').should((newElement) => {
          expect(parseInt(newElement.text())).to.be.greaterThan(initialCount);
        });
      });
  });
});
