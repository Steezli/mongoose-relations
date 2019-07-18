require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
// const Reviewer = require('../lib/models/Reviewer');
// const Actor = require('../lib/models/Actor');
// const Film = require('../lib/models/Film');
// const Studio = require('../lib/models/Studio');

describe('actor routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
    
  afterAll(() => {
    return mongoose.connection.close();
  });
    
  it('can POST a reviewer', () => {
    return request(app)
      .post('/api/v1/reviewers')
      .send({ name: 'Eli', company: 'ACL' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Eli',
          company: 'ACL',
          __v: 0
        });
      });
  });
});
