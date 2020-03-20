const request = require('supertest');
const should = require('should');
const app = require('../../../app');

// test suit

describe('POST / 메일전송 ', () => {

  describe('성공시', () => {
    
    it('result : 1 반환한다', function(done) {
      this.timeout(10000);
      request(app)
      .post('/user')
      .end((err, res) => {
        res.body.should.have.property('result', 1)
        done();
      });
    });
   
  });

});