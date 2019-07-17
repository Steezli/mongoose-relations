require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');

describe('studio routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can POST a studio', () => {
    return request(app)
      .post('/api/v1/studios')
      .send({ name: 'Warner Bros', address: { city: 'portland', state: 'oregon', country: 'US' } })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Warner Bros',
          address: {
            city: 'portland',
            state: 'oregon',
            country: 'US'
          },
          __v: 0
        });
      });
  });
  it('can GET studios', async() => {
    const studios = await Studio.create([
      { name: 'Warner Bros', address: { city: 'portland', state: 'oregon', country: 'US' } },
      { name: 'Erin', address: { city: 'portland', state: 'oregon', country: 'US' } },
      { name: 'Lance', address: { city: 'portland', state: 'oregon', country: 'US' } }
    ]);

    return request(app)
      .get('/api/v1/studios')
      .then(res => {
        const studiosJSON = JSON.parse(JSON.stringify(studios));
        studiosJSON.forEach(studio => {
          expect(res.body).toContainEqual(studio);
        });
      });
  });
  it('can GET a studio by id', async() => {
    const studio = await Studio.create({
      name: 'Warner bros',
      address: { 
        city: 'portland',
        state: 'oregon',
        country: 'US'
      }
    });

    return request(app)
      .get(`/api/v1/studios/${studio._id}`)
      .then(res => {
        const studioJSON = JSON.parse(JSON.stringify(studio));
        expect(res.body).toEqual({
          ...studioJSON,
          name: 'Warner bros'
        });
      });
  });
});
