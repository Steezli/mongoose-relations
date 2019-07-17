require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');

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

  it('can POST a actors', () => {
    const dob = new Date();
    return request(app)
      .post('/api/v1/actors')
      .send({ name: 'apples', dob, pob: 'redmond' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'apples',
          dob: dob.toISOString(),
          pob: 'redmond',
          __v: 0
        });
      });
  });

  it('can GET actors', async() => {
    const dob = new Date();
    const actors = await Actor.create([
      { name: 'Warner Bros', dob, pob: 'hollywood' },
      { name: 'Erin', dob, pob: 'kansas' },
      { name: 'Lance', dob, pob: 'seattle' }
    ]);

    return request(app)
      .get('/api/v1/actors')
      .then(res => {
        const actorsJSON = JSON.parse(JSON.stringify(actors));
        actorsJSON.forEach(actor => {
          expect(res.body).toContainEqual(actor);
        });
      });
  });
  it('can GET a actor by id', async() => {
    const dob = new Date();
    const actor = await Actor.create({
      name: 'Willem',
      dob,
      pob: 'portland'
    });

    return request(app)
      .get(`/api/v1/actors/${actor._id}`)
      .then(res => {
        const actorJSON = JSON.parse(JSON.stringify(actor));
        expect(res.body).toEqual({
          ...actorJSON,
          name: 'Willem'
        });
      });
  });
  it('can update using PUT', async() => {
    const dob = new Date();
    const actor = await Actor.create({
      name: 'willem',
      dob,
      pob: 'portland'
    });

    return request(app)
      .put(`/api/v1/actors/${actor._id}`)
      .send({ name: 'Willem lost', dob, pob: 'portland' })
      .then(res => {
        const actorJSON = JSON.parse(JSON.stringify(actor));
        expect(res.body).toEqual({
          ...actorJSON,
          name: 'Willem lost'
        });
      });
  });
});
