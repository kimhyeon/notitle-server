const request = require('supertest');
const should = require('should');
const app = require('../../../app');

// test suit

describe('POST /user - 회원가입 ', () => {

  describe('성공 시', () => {
    
    it('result : 1 반환한다', function(done) {
      this.timeout(10000);
      request(app)
      .post('/user')
      .send({
        email: 'dudu753951@naver.com',
        name: '김현',
        pwd: '1234',
        age: '30'
      })
      .end((err, res) => {
        res.body.should.be.property('result', 1)
        done();
      });
    });

  });

  describe('실패 시', () => {
    it('파라미터 누락시 400을 반환한다.', done => {
      request(app)
        .post('/user')
        .send({})
        .end(done);
    });

    it('email 중복일 경우 409를 반환한다.', done => {
      request(app)
        .post('/user')
        .send({
          email: 'dudu753951@naver.com',
          name: '김현',
          pwd: '1234',
          age: '30'
        })
        .exoect(409)
        .end(done);
    });
  });

});