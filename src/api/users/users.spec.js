const request = require('supertest');
const should = require('should');
const app = require('../../../app');
const { v4: uuidv4 } = require('uuid');
const { users } = require('../../models');

const session = require('supertest-session');

let newUserID;

// test suit
describe('POST /users , 회원가입 ', () => {
  let email = 'dudu753951@naver.com',
    name = '김현',
    pwd = '1234@1234',
    age = 30;

  let testID;

  after(() =>
    users.destroy({
      where: {
        id: testID
      }
    })
  );

  describe('성공 시', function() {
    let body;

    before(function(done) {
      request(app)
        .post('/users')
        .send({ email, name, pwd, age })
        .expect(200)
        .end((err, res) => {
          body = res.body;
          testID = res.body.user.id;
          done();
        });
    });

    it('생성된 user 객체를 반환한다', () => {
      body.should.have.property('user');
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
            id: testID
          }
        }
      )
    );

    it('파라미터 누락시 400을 반환한다.', done => {
      request(app)
        .post('/users')
        .send({})
        .expect(400)
        .end((err, res) => {
          res.body.should.have.property('message');
          done();
        });
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
          res.body.should.have.property('message');
          done();
        });
    });
  });
});

describe('GET /users/:id , id로 회원조회', () => {
  let testID = uuidv4();
  before(() =>
    users.create({
      id: testID,
      pwd: '1312312 321',
      email: 'demodemodemo@demo.demo',
      name: 'demo.name',
      age: 'demo.pwd'
    })
  );

  after(() =>
    users.destroy({
      where: {
        id: testID
      }
    })
  );

  describe('성공 시', function() {
    let body = null;

    before(function(done) {
      request(app)
        .get(`/users/${testID}`)
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
    it(':id param 값이 없는 경우 400 상태 반환.', done => {
      request(app)
        .get('/users')
        .expect(400)
        .end((err, res) => {
          res.body.should.have.property('message');
          done();
        });
    });

    it('user 조회 되지 않을 경우 404 상태를 반환.', done => {
      request(app)
        .get('/users/12asdzvc')
        .expect(404)
        .end((err, res) => {
          res.body.should.have.property('message');
          done();
        });
    });
  });
});

describe('GET /users/ , queryString name 로 회원조회', () => {
  let testID = uuidv4();
  before(() =>
    users.create({
      id: testID,
      pwd: '1312312 321',
      email: 'demodemodemo@demo.demo',
      name: 'demo',
      age: 'demo.pwd'
    })
  );

  after(() =>
    users.destroy({
      where: {
        id: testID
      }
    })
  );

  describe('성공 시', function() {
    let body;

    before(function(done) {
      request(app)
        .get(`/users/?name=demo`)
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
        .get('/users/')
        .expect(400)
        .end((err, res) => {
          res.body.should.have.property('message');
          done();
        });
    });

    it('user 조회 되지 않을 경우 404 상태를 반환한다.', done => {
      request(app)
        .get('/users/?name=zcxzcd')
        .expect(404)
        .end((err, res) => {
          res.body.should.have.property('message');
          done();
        });
    });
  });
});

describe('PUT /users/:id , user 데이터 수정', () => {
  describe('성공 시', () => {
    let body,
      testID = uuidv4();

    before(() =>
      users.create({
        id: testID,
        pwd: '1312312 321',
        email: 'demodemodemo@demo.demo',
        name: 'demo',
        age: 'demo.pwd'
      })
    );

    after(() =>
      users.destroy({
        where: {
          id: testID
        }
      })
    );

    before(function(done) {
      request(app)
        .put(`/users/${testID}`)
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

  describe('실패 시', () => {
    it(`':id' param 이 존재하지 않을 경우 400 에러.`, done => {
      request(app)
        .put('/users')
        .expect(400)
        .end(done);
    });

    it(`requset body 에 아무 값도 없을 경우 400 에러. `, done => {
      request(app)
        .put('/users')
        .send({})
        .expect(400)
        .end((err, res) => {
          res.body.should.have.property('message');
          done();
        });
    });

    it(`'pwd', 'name', 'profile', 'profile_back', 'status_message', 'email_certification_flag' 가 아닌 키가 body 에 있을 경우 400 에러.`, done => {
      request(app)
        .put('/users')
        .send({ foo: 'foofoo' })
        .expect(400)
        .end((err, res) => {
          res.body.should.have.property('message');
          done();
        });
    });
  });
});

describe('DELETE /users:id , user 삭제', () => {
  let testID = uuidv4();

  before(() => {
    return users.create({
      id: testID,
      pwd: '1312312 321',
      email: 'demodemodemo@demo.demo',
      name: 'demo.name',
      age: 'demo.pwd'
    });
  });

  describe('성공 시', () => {
    it('리턴 객체에 deleteCount 키 값이 존재하고, 숫자 값이다.', done => {
      request(app)
        .delete(`/users/${testID}`)
        .expect(200)
        .end((err, res) => {
          res.body.should.have.property('removeCount');
          res.body.removeCount.should.be.a.Number();
          done();
        });
    });
  });

  describe('실패 시', () => {
    it(`':id' param 이 없는 경우 400 에러`, done => {
      request(app)
        .delete('/users')
        .expect(400)
        .end((err, res) => {
          res.body.should.have.property('message');
          done();
        });
    });
  });
});

describe('POST /users/login', () => {
  let testSession;
  before(() => {
    testSession = session(app);
  });

  describe('성공 시', () => {
    it('로그인 성공한 user 리턴', done => {
      testSession
        .post('/users/login')
        .send({
          email: 'demo',
          pwd: '1234'
        })
        .expect(200)
        .end((err, res) => {
          res.status.should.be.equal(200);
          res.body.should.have.property('user');
          done();
        });
    });
  });

  after(() => {
    testSession
      .get('/users/login')
      .auth('demo', '1234')
      .end((err, res) => {
        console.log('[check session]', res.body);
      });
  });

  describe('실패 시', () => {
    it('email, pwd 를 전달 하지 않은 경우, 401', done => {
      request(app)
        .post('/users/login')
        .expect(401)
        .end((err, res) => {
          console.log(res.body);
          done();
        });
    });

    it('email 계정이 틀린 경우, 401', done => {
      request(app)
        .post('/users/login')
        .expect(401)
        .send({
          email: 'demo3',
          pwd: 123
        })
        .end((err, res) => {
          console.log(res.body);
          done();
        });
    });

    it('pwd 가 틀릴경우, 401', done => {
      request(app)
        .post('/users/login')
        .expect(401)
        .send({
          email: 'demo',
          pwd: 12344
        })
        .end((err, res) => {
          console.log(res.body);
          done();
        });
    });
  });
});

describe.only('POST /users/logout', () => {
  let testSession;

  before(done => {
    testSession = session(app);

    testSession
      .post('/users/login')
      .send({
        email: 'demo',
        pwd: '1234'
      })
      .end((err, res) => {
        console.log('BEFORE', res.body);
        done();
      });
  });

  describe('성공 시', () => {
    it('로그아웃 성공 시, ', done => {
      testSession
        .post('/users/logout')
        .expect(200)
        .end((err, res) => {
          console.log(res.body);
          done();
        });
    });
  });

  // after(() => {
  //   testSession
  //     .get('/users/login')
  //     .auth('demo', '1234')
  //     .end((err, res) => {
  //       console.log('[check session]', res.body);
  //     });
  // });
});
