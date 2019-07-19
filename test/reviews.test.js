require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Review = require('../lib/models/Review');
const Reviewer = require('../lib/models/Reviewer');
// const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');

describe('review routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let studio = null;
  let film = null;
  let reviewer = null;
  beforeEach(async() => {
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'disney' })));
    film = JSON.parse(JSON.stringify(await Film.create({ title: 'Aladdin', released: 1992, studio: studio._id })));
    reviewer = JSON.parse(JSON.stringify(await Reviewer.create({ name: 'robin williams', company: 'warner' })));
  });
    
  afterAll(() => {
    return mongoose.connection.close();
  });
    
  it('can POST a review', () => {
    return request(app)
      .post('/api/v1/reviews')
      .send({ rating: 4,
        reviewer: reviewer._id,
        review: 'Aladdin was good.',
        film: film._id })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          rating: 4,
          reviewer: reviewer._id,
          review: 'Aladdin was good.',
          film: film._id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          __v: 0
        });
      });
  });
  it('can GET reviews', async() => { 
    const reviews = await Review.create([
      { reviewer: reviewer._id, rating: 4, review: 'Aladdin was good.', film: film._id },
      { reviewer: reviewer._id, rating: 3, review: 'Your mom was good.', film: film._id },
      { reviewer: reviewer._id, rating: 5, review: 'applesauce is tasty.', film: film._id }
    ]);

    return request(app)
      .get('/api/v1/reviews')
      .then(res => {
        const reviewsJSON = JSON.parse(JSON.stringify(reviews));
        reviewsJSON.forEach(review => {
          expect(res.body).toContainEqual(review);
        });
      });
  });
  it('can GET up to 100 reviews', async() => { 
    await Promise.all([...Array(101)].map((review, i) => {
      return Review.create({
        rating: 2,
        reviewer: reviewer._id,
        review: `woopde doda ${i}`,
        film: film._id
      });
    }));

    return request(app)
      .get('/api/v1/reviews')
      .then(res => {
        expect(res.body).toHaveLength(100);
      });
  });
});
