require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Reviewer = require('../lib/models/Reviewer');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');
const Review = require('../lib/models/Review');

describe('reviewer routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  
  let studio = null;
  let actor = null;
  let film = null;
  let reviewer = null;
  beforeEach(async() => {
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'disney' })));
    actor = JSON.parse(JSON.stringify(await Actor.create({ name: 'robin williams' })));
    film = await Film.create({ title: 'Aladdin', studio: studio._id, released: 1992, cast: [{ actor: actor._id }] });
    reviewer = JSON.parse(JSON.stringify(await Reviewer.create({ name: 'erin', company: 'you' })));
    await Review.create({ rating: 4, reviewer: reviewer._id, review: 'robin williams', film: film._id });
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
  it('can GET a reviewer by id', async() => {
    return request(app)
      .get(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        const reviewerJSON = JSON.parse(JSON.stringify(reviewer));
        expect(res.body).toEqual({
          ...reviewerJSON,
          _id: expect.any(String),
          name: 'erin',
          company: 'you',
          reviews: [{ _id: expect.any(String),
            rating: 4,
            review: 'robin williams',
            film: {
              _id: expect.any(String),
              title: 'Aladdin'
            },
            __v: 0 }],
          __v: 0
        });
      });
  });
  it('can update using PUT', async() => {
    return request(app)
      .put(`/api/v1/reviewers/${reviewer._id}`)
      .send({ name: 'erin gurley', company: 'you' })
      .then(res => {
        const reviewerJSON = JSON.parse(JSON.stringify(reviewer));
        expect(res.body).toEqual({
          ...reviewerJSON,
          name: 'erin gurley'
        });
      });
  });
});
