require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');
const Film = require('../lib/models/Film');

describe('studio routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let film = null;
  let studio = null;
  beforeEach(async() => {
    studio = await Studio.create({
      name: 'Warner bros',
      address: { 
        city: 'portland',
        state: 'oregon',
        country: 'US'
      }
    });
    film = JSON.parse(JSON.stringify(await Film.create({ title: 'aladdin', studio: studio._id, released: 1992, cast: [] })));
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
    return request(app)
      .get(`/api/v1/studios/${studio._id}`)
      .then(res => {
        const studioJSON = JSON.parse(JSON.stringify(studio));
        expect(res.body).toEqual({
          ...studioJSON,
          name: 'Warner bros',
          films: [film]
        });
      });
  });
});
