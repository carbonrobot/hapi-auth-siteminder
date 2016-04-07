hapi-auth-siteminder
-------------------------

[![npm version](https://badge.fury.io/js/hapi-auth-siteminder.svg)](https://badge.fury.io/js/hapi-auth-siteminder)

Authentication plugin for Siteminder protected sites.

## Usage

```js
const siteminder = {
    register: require('hapi-auth-siteminder'),
    options: {
        // Headers required by your application
        required: ['HTTP_SM_USER', 'HTTP_SM_USERID']   
    }  
};

server.register([opentoken], (err) => {
    server.auth.strategy('default', 'siteminder', { validate: validate });
    server.route({ method: 'GET', path: '/', config: { auth: 'default' } });
});

function validate(request, headers, callback) {
    // headers contains all headers sent with this request
    // additional processing such as gather information from the
    // database can occur here and be attached to the object
    
    // note: hapijs headers are always lowercase property names
    
    callback(err, { 
        id: headers.http_sm_userid, 
        username: headers.http_sm_user 
    });
}
```

## Options

Plugin takes the following options

- required - (optional) The headers that your application requires. Use this to specify headers your application requires for later processing. If a required header is missing, the plugin will throw and authorization exception. Regardless of what headers are marked as required, the plugin will still send all avaiable headers to the validate function. Case insensitive. (default: [])

## Validation

The validation function has a signature of `validate(request, headers, callback)` where

- request - the hapi.js request object
- headers - all headers in the request
- callback - a callback function taking the following parameters
    - err - An optional error message which gets logged to stdout, null if no error
    - user - the user information to attach to request.auth.credentials in downstream methods