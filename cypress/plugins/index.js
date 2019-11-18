// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
//module.exports = on => { on('task', { log (message) { console.log(message); return null } }); };

const path = require('path');
const gmail = require('gmail-tester');
const debug = require('debug');

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    'gmail:check': async args => {
      const { from, to, subject } = args;
      const email = await gmail.check_inbox(
        path.resolve(__dirname, "credentials.json"), // credentials.json is inside plugins/ directory.
        path.resolve(__dirname, "gmail_token.json"), // gmail_token.json is inside plugins/ directory.
        subject,
        from,
        to,
        10,                                          // Poll interval (in seconds)
        30                                           // Maximum poll interval (in seconds). If reached, return null, indicating the completion of the task().
      );
      return email;
    }
  });
  
  on('task', {
    'gmail:get-messages': async args => {
      const messages = await gmail.get_messages(
        path.resolve(__dirname, "credentials.json"),
        path.resolve(__dirname, "gmail_token.json"),
        args.options
      );
      return messages;
    }
  });

};


