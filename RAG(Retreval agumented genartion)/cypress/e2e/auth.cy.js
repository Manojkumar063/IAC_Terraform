describe('Auth Page', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/auth');
  });

  context('Tab Switching', () => {
    it('shows login form by default', () => {
      cy.get('#loginForm').should('be.visible');
      cy.get('#registerForm').should('not.be.visible');
    });

    it('switches to register tab', () => {
      cy.contains('button', 'Register').click();
      cy.get('#registerForm').should('be.visible');
      cy.get('#loginForm').should('not.be.visible');
    });

    it('switches back to login tab', () => {
      cy.contains('button', 'Register').click();
      cy.contains('button', 'Sign In').click();
      cy.get('#loginForm').should('be.visible');
    });
  });

  context('Login', () => {
    it('shows error on failed login', () => {
      cy.intercept('POST', '/api/login', { statusCode: 401, body: { error: 'Invalid credentials' } });
      cy.get('#loginEmail').type('test@example.com');
      cy.get('#loginPassword').type('wrongpass');
      cy.get('#loginBtn').click();
      cy.get('#loginMsg').should('have.class', 'error').and('contain', 'Invalid credentials');
    });

    it('redirects to /chat on successful login', () => {
      cy.intercept('POST', '/api/login', { statusCode: 200, body: { token: 'abc123', username: 'testuser' } });
      cy.get('#loginEmail').type('test@example.com');
      cy.get('#loginPassword').type('password123');
      cy.get('#loginBtn').click();
      cy.location('pathname').should('eq', '/chat');
    });

    it('shows connection error on network failure', () => {
      cy.intercept('POST', '/api/login', { forceNetworkError: true });
      cy.get('#loginEmail').type('test@example.com');
      cy.get('#loginPassword').type('password123');
      cy.get('#loginBtn').click();
      cy.get('#loginMsg').should('have.class', 'error').and('contain', 'Connection error');
    });

    it('disables button while submitting', () => {
      cy.intercept('POST', '/api/login', (req) =>
        req.reply({ delay: 500, statusCode: 200, body: { token: 't', username: 'u' } })
      );
      cy.get('#loginEmail').type('test@example.com');
      cy.get('#loginPassword').type('password123');
      cy.get('#loginBtn').click();
      cy.get('#loginBtn').should('be.disabled').and('contain', 'Signing in...');
    });
  });

  context('Register', () => {
    beforeEach(() => cy.contains('button', 'Register').click());

    it('shows error on failed registration', () => {
      cy.intercept('POST', '/api/register', { statusCode: 400, body: { error: 'Email already exists' } });
      cy.get('#regUsername').type('johndoe');
      cy.get('#regEmail').type('existing@example.com');
      cy.get('#regPassword').type('password123');
      cy.get('#registerBtn').click();
      cy.get('#registerMsg').should('have.class', 'error').and('contain', 'Email already exists');
    });

    it('shows success and switches to login on successful registration', () => {
      cy.intercept('POST', '/api/register', { statusCode: 200, body: {} });
      cy.get('#regUsername').type('johndoe');
      cy.get('#regEmail').type('new@example.com');
      cy.get('#regPassword').type('password123');
      cy.get('#registerBtn').click();
      cy.get('#registerMsg').should('have.class', 'success').and('contain', 'Account created');
      cy.get('#loginForm', { timeout: 2000 }).should('be.visible');
    });

    it('shows connection error on network failure', () => {
      cy.intercept('POST', '/api/register', { forceNetworkError: true });
      cy.get('#regUsername').type('johndoe');
      cy.get('#regEmail').type('new@example.com');
      cy.get('#regPassword').type('password123');
      cy.get('#registerBtn').click();
      cy.get('#registerMsg').should('have.class', 'error').and('contain', 'Connection error');
    });
  });

  context('Already logged in', () => {
    it('redirects to /chat if token exists in localStorage', () => {
      cy.window().then((win) => win.localStorage.setItem('token', 'existing-token'));
      cy.visit('/auth');
      cy.location('pathname').should('eq', '/chat');
    });
  });
});
