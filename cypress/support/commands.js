// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const logger = console;
Cypress.Commands.add(
  'console',
  {
    prevSubject: true,
  },
  (subject, method = 'log') => {
    logger[method]('The subject is', subject);
    return subject;
  }
);

Cypress.Commands.add('visitStorybook', () => {
  cy.log('visitStorybook');
  const host = Cypress.env('location') || 'http://localhost:8001';
  return cy
    .clearLocalStorage()
    .visit(`${host}/?path=/story/example-introduction--page`)
    .get(`#storybook-preview-iframe`, { log: false })
    .its('0.contentDocument.body', { log: false })
    .should('not.be.empty')
    .then((body) => cy.wrap(body, { log: false }))
    .find('#storybook-docs-root', { log: false })
    .should('not.be.empty');
});

Cypress.Commands.add('getStoryElement', {}, () => {
  cy.log('getStoryElement');
  return cy
    .get(`#storybook-preview-iframe`, { log: false })
    .its('0.contentDocument.body', { log: false })
    .should('not.be.empty')
    .then((body) => cy.wrap(body, { log: false }))
    .find('#storybook-root', { log: false })
    .should('not.be.empty')
    .then((storyRoot) => cy.wrap(storyRoot, { log: false }));
});

Cypress.Commands.add('getDocsElement', {}, () => {
  cy.log('getDocsElement');
  return cy
    .get(`#storybook-preview-iframe`, { log: false })
    .its('0.contentDocument.body', { log: false })
    .should('not.be.empty')
    .then((body) => cy.wrap(body, { log: false }))
    .find('#storybook-docs-root', { log: false })
    .should('not.be.empty')
    .then((storyRoot) => cy.wrap(storyRoot, { log: false }));
});

Cypress.Commands.add('getCanvasElement', {}, () => {
  cy.log('getCanvasElement');
  return cy
    .get(`#storybook-preview-iframe`, { log: false })
    .then((iframe) => cy.wrap(iframe, { log: false }));
});

Cypress.Commands.add('getCanvasBodyElement', {}, () => {
  cy.log('getCanvasBodyElement');
  return cy
    .getCanvasElement()
    .its('0.contentDocument.body', { log: false })
    .should('not.be.empty')
    .then((body) => cy.wrap(body, { log: false }));
});

Cypress.Commands.add('navigateToStory', (kind, name) => {
  const kindId = kind.replace(/ /g, '-').toLowerCase();
  const storyId = name.replace(/ /g, '-').toLowerCase();

  const storyLinkId = `#${kindId}--${storyId}`;
  cy.log(`navigateToStory ${kind} ${name}`);

  if (name !== 'page') {
    // Section might be collapsed
    cy.get(`#${kindId}`).then(($item) => {
      if ($item.attr('aria-expanded') === 'false') $item.click();
    });
  }
  cy.get(storyLinkId).click();

  // assert url changes
  cy.url().should('include', `path=/story/${kindId}--${storyId}`);
  cy.get(storyLinkId).should('have.attr', 'data-selected', 'true');

  // A pause is good when switching stories
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(50);
});

Cypress.Commands.add('viewAddonPanel', (name) => {
  cy.get(`[role=tablist] button[role=tab]`).contains(name).click();
});
