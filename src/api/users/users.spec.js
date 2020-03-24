const request = require('supertest');
const should = require('should');
const app = require('../../../app');
const { users } = require('../../models');

let newUserID;

// test suit
describe('POST /users , 회원가입 ', () => {
  let email = 'dudu753951@naver.com',
    name = '김현',
    pwd = '1234@1234',
    age = 30;

  before(() =>
    users.destroy({
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
        .post('/users')
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
      users.update(
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
        .post('/users')
        .send({})
        .expect(400)
        .end(done);
    });

    it('email 인증이 완료된 user 존재 시 409를 반환한다.', function(done) {
      this.timeout(5000);
      request(app)
        .post('/users')
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

describe('GET /users/:id , id로 회원조회', () => {
  describe('성공 시', function() {
    let body = null;

    before(function(done) {
      request(app)
        .get(`/users/fbce0716-39ef-4d8d-a8cb-155b81bea999`)
        // .get(`/users/${newUserID}`)
        .expect(200)
        .end((err, res) => {
          body = res.body;
          done();
        });
    });

    it('리턴 객체에 user 키 값이 존재한다.', () => {
      body.should.have.property('user');
    });

    it(`user 객체의 키에는 'id', 'email', 'name', 'profile', 'profile_back', 'status_message' 가 있어야한다.`, () => {
      let user = body.user;
      user.should.have.properties([
        'id',
        'email',
        'name',
        'profile',
        'profile_back',
        'status_message'
      ]);
    });
  });

  describe('실패 시', function() {
    it('user 조회 되지 않을 경우 404 상태를 반환한다.', done => {
      request(app)
        .get('/users/12asdzvc')
        .expect(404)
        .end(done);
    });
  });
});

describe('GET /users?name= , name query String 조회', () => {
  describe('성공 시', function() {
    let body,
      testName = 'demo!!';

    before(function(done) {
      request(app)
        .get(`/users?name=${testName}`)
        .expect(200)
        .end((err, res) => {
          body = res.body;
          done();
        });
    });

    it('리턴 객체에 users 키 값이 존재한다.', () => {
      body.should.have.property('users');
    });

    it('배열을 리턴해준다.', () => {
      body.users.should.be.Array();
    });

    it(`user 객체의 키에는 'id', 'email', 'name', 'profile', 'profile_back', 'status_message' 가 있어야한다.`, () => {
      let user = body.users[0];
      user.should.have.properties([
        'id',
        'email',
        'name',
        'profile',
        'profile_back',
        'status_message'
      ]);
    });
  });

  describe('실패 시', function() {
    it('queryString name 값을 넘기지 않은 경우 400 상태반환.', done => {
      request(app)
        .get('/users')
        .expect(400)
        .end(done);
    });

    it('user 조회 되지 않을 경우 404 상태를 반환한다.', done => {
      request(app)
        .get('/users?name=zcxzcd')
        .expect(404)
        .end(done);
    });
  });
});

describe.only('PUT /users/:id , user 대이터 수정', () => {
  describe('성공 시', () => {
    let demoID = 'fbce0716-39ef-4d8d-a8cb-155b81bea999',
      body;

    before(function(done) {
      request(app)
        .put(`/users/${demoID}`)
        // .send({})
        .send({ profile: 'a777123.jpg', status_message: null })
        .expect(200)
        .end((err, res) => {
          body = res.body;
          done();
        });
    });

    it('리턴 객체에 user 키 값이 존재한다.', () => {
      body.should.have.property('user');
    });

    it(`user 객체의 키에는 'id', 'email', 'name', 'profile', 'profile_back', 'status_message' 가 있어야한다.`, () => {
      let user = body.user;
      user.should.have.properties([
        'id',
        'email',
        'name',
        'profile',
        'profile_back',
        'status_message'
      ]);
    });

    it('리턴 객체에 updateCount 키 값이 존재하고, 숫자 값이다.', () => {
      body.should.have.property('updateCount');
      body.updateCount.should.be.a.Number();
    });
  });
});
