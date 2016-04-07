const Hapi = require('hapi');
const siteminder = require('../');

describe('hapi-auth-siteminder', () => {
    
    beforeAll((done) => {
        this.server = new Hapi.Server();
        this.server.connection();
        
        const smAuth = {
            register: siteminder,
            options: { required: ['HTTP_SM_USER', 'HTTP_SM_USERID'] }
        };
        
        this.server.register([smAuth], (err) => {
            this.server.auth.strategy('default', 'siteminder', { validate: validate });
            this.server.route(
                { method: 'GET', path: '/', config: { auth: 'default' }, 
                handler: function(request, reply){ return reply(request.auth.credentials);} }
            );
            
            done();
        });

        function validate(request, headers, callback) {
            callback(null, {
                id: headers.http_sm_userid,
                username: headers.http_sm_user
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
    
    it('should return an error if missing any headers', (done) => {
        const headers = { 'HTTP_SM_USER': 'TEST' };
        inject.call(this, headers, function(response){
            expect(response.statusCode).toBe(401);
            done();
        });
    });
    
    it('should return a valid user', (done) => {
        const headers = { HTTP_SM_USER: 'janedoe', HTTP_SM_USERID: 12 };
        inject.call(this, headers, function(response){
            expect(response.statusCode).toBe(200);
            expect(response.result.id).toBe(12);
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