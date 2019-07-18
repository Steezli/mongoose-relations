require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Reviewer = require('../lib/models/Reviewer');
// const Actor = require('../lib/models/Actor');
// const Film = require('../lib/models/Film');
// const Studio = require('../lib/models/Studio');

describe('reviewer routes', () => {
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
  it('can GET reviewers', async() => {
    const reviewers = await Reviewer.create([
      { name: 'Eli', company: 'ACL' },
      { name: 'Erin', company: 'ACL' },
      { name: 'Lance', company: 'ACL' }
    ]);
      
    return request(app)
      .get('/api/v1/reviewers')
      .then(res => {
        const reviewersJSON = JSON.parse(JSON.stringify(reviewers));
        reviewersJSON.forEach(reviewer => {
          expect(res.body).toContainEqual(reviewer);
        });
      });
  });
});
