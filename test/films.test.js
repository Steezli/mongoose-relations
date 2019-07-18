require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');
const Film = require('../lib/models/Film');
const Actor = require('../lib/models/Actor');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let studio = null;
  let actor = null;
  beforeEach(async() => {
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'disney' })));
    actor = JSON.parse(JSON.stringify(await Actor.create({ name: 'robin williams' })));
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can POST a film', () => {
    return request(app)
      .post('/api/v1/films')
      .send({ title: 'aladdin', studio: studio._id, released: 1992, cast: [{ role: '', actor: actor._id }] })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          title: 'aladdin',
          studio: studio._id,
          released: 1992,
          cast: [{
            _id: expect.any(String),
            role: '',
            actor: actor._id
          }],
          __v: 0
        });
      });
  });

  it('can GET films', async() => {
    const films = await Film.create([
      { title: 'aladdin', studio: studio._id, released: 1992, cast: [{ role: '', actor: actor._id }]  },
      { title: 'Creed', studio: studio._id, released: 1993, cast: [{ role: '', actor: actor._id }]  },
      { title: 'Lion King', studio: studio._id, released: 1994, cast: [{ role: '', actor: actor._id }]  }
    ]);

    return request(app)
      .get('/api/v1/films')
      .then(res => {
        const filmsJSON = JSON.parse(JSON.stringify(films));
        filmsJSON.forEach(film => {
          expect(res.body).toContainEqual(film);
        });
      });
  });
});
