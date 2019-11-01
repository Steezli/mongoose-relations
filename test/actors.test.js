require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');

describe('actor routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let film = null;
  let actor = null;
  let studio = null;
  beforeEach(async() => {
    const dob = new Date();
    actor = await Actor.create({
      name: 'Willem',
      dob,
      pob: 'portland'
    });
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'Warner bros', address: { city: 'portland', state: 'oregon', country: 'US' } })));
    film = JSON.parse(JSON.stringify(await Film.create({ title: 'aladdin', studio: studio._id, released: 1992, cast: [{ actor: actor._id }] })));
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
        actorsJSON.forEach(() => {
          expect(res.body).toContainEqual({ name: 'Erin', _id: expect.any(String) });
        });
      });
  });
  it('can GET an actor by id', async() => {
    return request(app)
      .get(`/api/v1/actors/${actor._id}`)
      .then(res => {
        expect(res.body).toEqual({
          name: actor.name,
          dob: expect.any(String),
          pob: actor.pob,
          films: [{ _id: expect.any(String),
            title: film.title, 
            released: film.released
          }]
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
  it('can DELETE a actor', async() => {
    const actor = await Actor.create({ name: 'Ryan Mehta', dob: '04-03-1992', pob: 'here' });
    return request(app)
      .delete(`/api/v1/actors/${actor._id}`)
      .then(res => {
        const actorJSON = JSON.parse(JSON.stringify(actor));
        expect(res.body).toEqual(actorJSON);
      });
  });
  it('cannot DELETE a actor if in a film, instead return a message', async() => {
    return request(app)
      .delete(`/api/v1/actors/${actor._id}`)
      .then(res => {
        expect(res.body).toEqual({ message: 'Could not delete because the actor is in at least one film.' });
      });
  });
});
