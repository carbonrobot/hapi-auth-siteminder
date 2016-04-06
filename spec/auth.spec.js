const Hapi = require('hapi');
const siteminder = require('../');

describe('hapi-auth-siteminder', () => {

    beforeAll((done) => {
        this.server = new Hapi.Server();
        this.server.connection();
        
        const smAuth = {
            register: siteminder,
            options: { headers: ['HTTP_SM_USER', 'HTTP_SM_USERID'] }
        };
        
        this.server.register([smAuth], (err) => {
            this.server.auth.strategy('default', 'siteminder', { validate: validate });
            this.server.route({ method: 'GET', path: '/', config: { auth: 'default' }, handler: function(req,rep){ return 'ok';} });
            
            done();
        });

        function validate(request, headers, callback) {
            callback(null, {
                id: headers.HTTP_SM_USERID,
                username: headers.HTTP_SM_USER
            });
        }
    });

    it('should return an error if missing headers', (done) => {
        const headers = {};
        inject.call(this, headers, function(response){
            expect(response.statusCode).toBe(401);
            done();
        });
    });
    
    function inject(headers, asyncValidator){
        const options = { 
            method: 'GET', 
            url: '/', 
            headers: headers 
        };
        this.server.inject(options, asyncValidator);
    }

});