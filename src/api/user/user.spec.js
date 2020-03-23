const request = require('supertest');
const should = require('should');
const app = require('../../../app');
const { user } = require('../../models');

// test suit
describe('POST /user - 회원가입 ', () => {
  let newUserID,
    email = 'dudu753951@naver.com',
    name = '김현',
    pwd = '1234@1234',
    age = 30;

  before(() =>
    user.destroy({
      where: {
        email: 'dudu753951@naver.com'
      }
    })
  );

  describe('성공 시', function() {
    let body;

    before(function(done) {
      // this.timeout(10000);
      request(app)
        .post('/user')
        .send({ email, name, pwd, age })
        .expect(200)
        .end((err, res) => {
          body = res.body;
          newUserID = res.body.user.id;
          done();
        });
    });

    it('result : 1 반환한다', () => {
      body.should.have.property('result', 1);
    });

    it('생성된 유저의 id, email, name 을 반환한다.', () => {
      body.user.should.have.properties(['id', 'email', 'name']);
    });
  });

  describe('실패 시', () => {
    before(() =>
      user.update(
        { email_certification_flag: 1 },
        {
          where: {
            id: newUserID
          }
        }
      )
    );

    it('파라미터 누락시 400을 반환한다.', done => {
      request(app)
        .post('/user')
        .send({})
        .expect(400)
        .end(done);
    });

    it('email 인증이 완료된 user 존재 시 409를 반환한다.', function(done) {
      this.timeout(5000);
      request(app)
        .post('/user')
        .send({
          email: 'dudu753951@naver.com',
          name: '김현',
          pwd: '1234',
          age: '30'
        })
        .expect(409)
        .end((err, res) => {
          res.body.should.have.property('result', -1);
          res.body.should.have.property('info');
          done();
        });
    });
  });
});
