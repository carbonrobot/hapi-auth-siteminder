'use strict';

// modules
const Boom = require('boom');
const Hoek = require('hoek');

// Declare internals
const internals = {
    required: []
};

/**
 * Authenticate for this scheme [required]
 * 
 * @param request - Hapi Request object @see http://hapijs.com/api#request-object
 * @param reply - reply is a callback that must be called when your authentication is complete.
 */
function authenticate(request, reply) {

    const req = request.raw.req;
    const headers = req.headers;
    console.log(headers);
    
    // check for required values
    if (headers.length > 0) {
        if (!Hoek.contain(headers, internals.required)) {
            return reply(Boom.unauthorized(null, 'siteminder'));
        }
    }

    // call the user supplied validator
    internals.validate(request, headers, (err, credentials) => {
        credentials = credentials || null;

        if (err) {
            return reply(err, null, { credentials: credentials });
        }

        if (!credentials || typeof credentials !== 'object') {
            return reply(Boom.badImplementation('Bad credentials object received for Siteminder auth validation'));
        }
        
        return reply.continue({ credentials: credentials });
    });
}

/**
 This method must return an object with at least the key authenticate. Other optional methods that can be used are payload and response.
 * @param server
 * @param options
 */
function scheme(server, options) {
    Hoek.assert(typeof options.validate === 'function', 'options.validate must be a valid function that returns a user object if successful.');

    internals.validate = options.validate;

    return {
        authenticate: authenticate
    };
}

/**
 * Register the plugin with the hapi ecosystem
 */
exports.register = function (server, options, next) {
    internals.required = options.required || [];

    server.auth.scheme('siteminder', scheme);
    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};