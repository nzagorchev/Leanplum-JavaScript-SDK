/*
 *
 *  Copyright 2017 Leanplum Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
const sinon = require('sinon');

const APP_ID = 'app_BWTRIgOs0OoevDfSsBtabRiGffu5wOFU3mkxIxA7NBs';
const KEY_DEV = 'dev_Bx8i3Bbz1OJBTBAu63NIifr3UwWqUBU5OhHtywo58RY';
const KEY_PROD = 'prod_A1c7DfHO6XTo2BRwzhkkXKFJ6oaPtoMnRA9xpPSlx74';

const startResponse = require('./responses/start.json');
const successResponse = require('./responses/success.json');
const LEANPLUM_PATH = '../../dist/leanplum.js';

global.WebSocket = undefined;

// Mocking Requests
let xhr;

// Test data
const userId = (Math.random() * 100000000).toFixed(0);
const userAttributes = {
  gender: 'female',
  age: 27,
};

let Leanplum = require(LEANPLUM_PATH);

/**
 * Extracts the leanplum action type from a request.
 * @param  {Object} request The request payload.
 * @return {String} The action name.
 */
function getAction(request) {
  let requestBody = JSON.parse(request.requestBody);
  let action = requestBody.data[0].action;
  return action;
};

/**
 * Intercept the next request.
 * @param  {Function} callback The callback to be called on interception.
 */
function interceptRequest(callback) {
  xhr = sinon.useFakeXMLHttpRequest();
  xhr.onCreate = function (req) {
    // Wait for request to populate correctly.
    setTimeout(function () {
      callback(req);
    }, 0);
  };
};

/**
 * Sets the app id based on the provided mode.
 * @param {String} mode The Leanplum mode.
 */
function setAppId(mode) {
  if (mode === testModes.DEV) {
    Leanplum.setAppIdForDevelopmentMode(APP_ID, KEY_PROD);
  } else {
    Leanplum.setAppIdForProductionMode(APP_ID, KEY_DEV);
  }
};

const testModes = {
  PROD: 0,
  DEV: 1,
};

Object.keys(testModes).forEach((mode) => {
  describe(mode + ' mode:', () => {
    describe('Test start methods.', () => {
      before(() => {
      });

      after(() => {
        xhr.restore();
      });

      beforeEach(() => {
        Leanplum = require(LEANPLUM_PATH);
        setAppId(testModes[mode]);
      });

      afterEach(() => {
        requests = [];
        assert.equal(requests.length, 0);
        delete require.cache[require.resolve(LEANPLUM_PATH)];
      });

      it('start', (done) => {
        interceptRequest((request) => {
          request.respond(200, {
            'Content-Type': 'application/json',
          }, JSON.stringify(startResponse));
        });
        Leanplum.start(userId, userAttributes, (success) => {
          assert.equal(success, true);
          return done(success ? null : success);
        });
      });

      it('startFromCache', (done) => {
        Leanplum.startFromCache(userId, userAttributes, (success) => {
          assert.equal(success, true);
          return done(success ? null : success);
        });
      });

      it('stop', () => {
        interceptRequest((request) => {
          assert.isNotNull(request);
          assert.equal(getAction(request), 'stop');
          request.respond(200, {
            'Content-Type': 'application/json',
          }, JSON.stringify(successResponse));
        });
        Leanplum.stop();
      });
    });

    describe('Test action methods.', () => {
      before((done) => {
        Leanplum = require(LEANPLUM_PATH);
        interceptRequest((request) => {
          assert.isNotNull(request);
          request.respond(200, {
            'Content-Type': 'application/json',
          }, JSON.stringify(startResponse));
        });
        setAppId(testModes[mode]);
        Leanplum.setRequestBatching(false);
        Leanplum.start(userId, userAttributes, (success) => {
          assert.equal(success, true);
          requests = [];
          return done(success ? null : success);
        });
      });

      after(() => {
        xhr.restore();
        delete require.cache[require.resolve(LEANPLUM_PATH)];
      });

      beforeEach(() => {
      });

      afterEach(() => {
        requests = [];
      });

      it('pauseSession', (done) => {
        interceptRequest((request) => {
          assert.isNotNull(request);
          assert.equal(getAction(request), 'pauseSession');
          request.respond(200, {
            'Content-Type': 'application/json',
          }, JSON.stringify(successResponse));
          done();
        });
        Leanplum.pauseSession();
      });

      it('resumeSession', (done) => {
        interceptRequest((request) => {
          assert.isNotNull(request);
          assert.equal(getAction(request), 'resumeSession');
          request.respond(200, {
            'Content-Type': 'application/json',
          }, JSON.stringify(successResponse));
          done();
        });
        Leanplum.resumeSession();
      });

      it('pauseState', (done) => {
        interceptRequest((request) => {
          assert.isNotNull(request);
          assert.equal(getAction(request), 'pauseState');
          request.respond(200, {
            'Content-Type': 'application/json',
          }, JSON.stringify(successResponse));
          done();
        });
        Leanplum.pauseState();
      });

      it('resumeState', (done) => {
        interceptRequest((request) => {
          assert.isNotNull(request);
          assert.equal(getAction(request), 'resumeState');
          request.respond(200, {
            'Content-Type': 'application/json',
          }, JSON.stringify(successResponse));
          done();
        });
        Leanplum.resumeState();
      });

      it('setUserAttributes', (done) => {
        interceptRequest((request) => {
          assert.isNotNull(request);
          assert.equal(getAction(request), 'setUserAttributes');
          request.respond(200, {
            'Content-Type': 'application/json',
          }, JSON.stringify(successResponse));
          done();
        });
        Leanplum.setUserAttributes(userId, userAttributes);
      });

      it('track', (done) => {
        interceptRequest((request) => {
          assert.isNotNull(request);
          assert.equal(getAction(request), 'track');
          request.respond(200, {
            'Content-Type': 'application/json',
          }, JSON.stringify(successResponse));
          done();
        });
        Leanplum.track();
      });

      it('advanceTo', (done) => {
        interceptRequest((request) => {
          assert.isNotNull(request);
          assert.equal(getAction(request), 'advance');
          request.respond(200, {
            'Content-Type': 'application/json',
          }, JSON.stringify(successResponse));
          done();
        });
        Leanplum.advanceTo();
      });

      it('verifyDefaultApiPath', (done) => {
        interceptRequest((request) => {
          assert.isNotNull(request);
          assert.include(request.url, 'https://www.leanplum.com/api');
          request.respond(200, {
            'Content-Type': 'application/json',
          }, JSON.stringify(successResponse));
          done();
        });
        Leanplum.track();
      });

      it('setApiPath', (done) => {
        const newApiPath = 'http://leanplum-staging.appspot.com/api';
        interceptRequest((request) => {
          assert.isNotNull(request);
          assert.include(request.url, newApiPath);
          request.respond(200, {
            'Content-Type': 'application/json',
          }, JSON.stringify(successResponse));
          done();
        });
        Leanplum.setApiPath(newApiPath);
        Leanplum.track();
      });

      it('setUserAttributes', (done) => {
        interceptRequest((request) => {
          assert.isNotNull(request);
          let json = JSON.parse(request.requestBody).data[0];
          assert.equal(getAction(request), 'setUserAttributes');
          assert.equal(json.newUserId, 'u1');
          assert.equal(JSON.parse(json.userAttributes).gender,
              userAttributes.gender);
          assert.equal(JSON.parse(json.userAttributes).age,
              userAttributes.age);
          request.respond(200, {
            'Content-Type': 'application/json',
          }, JSON.stringify(successResponse));
          done();
        });
        Leanplum.setUserAttributes('u1', userAttributes);
      });

      it('setRequestBatching', (done) => {
        Leanplum.setRequestBatching(true, 5);
        let count = 0;
        interceptRequest((request) => {
          assert.isNotNull(request);
          // console.log(request);
          count++;
          request.respond(200, {
            'Content-Type': 'application/json',
          }, JSON.stringify(successResponse));
        });

        setTimeout(function () {
          assert.equal(count, testModes[mode] === testModes.DEV ? 2 : 1);
          done();
        }, 10);

        Leanplum.track();
        Leanplum.advanceTo();
      });
    });

    describe('Test variable changed callback after start.', () => {
      before(() => {
      });

      after(() => {
        xhr.restore();
      });

      beforeEach(() => {
        Leanplum = require(LEANPLUM_PATH);
        setAppId(testModes[mode]);
      });

      afterEach(() => {
        requests = [];
        assert.equal(requests.length, 0);
        delete require.cache[require.resolve(LEANPLUM_PATH)];
      });

      it('setVariable', (done) => {
        interceptRequest((request) => {
          request.respond(200, {
            'Content-Type': 'application/json',
          }, JSON.stringify(startResponse));
        });
        Leanplum.setVariables(userAttributes);
        Leanplum.addVariablesChangedHandler(() => {
          assert.equal(Leanplum.getVariables().gender, userAttributes.gender);
          assert.equal(Leanplum.getVariables().age, userAttributes.age);
        });
        Leanplum.start(userId, userAttributes, (success) => {
          assert.equal(success, true);
          return done(success ? null : success);
        });
      });
    });

    describe('Test addStartResponseHandler callback after start.', () => {
      before(() => {
      });

      after(() => {
        xhr.restore();
      });

      beforeEach(() => {
        Leanplum = require(LEANPLUM_PATH);
        setAppId(testModes[mode]);
      });

      afterEach(() => {
        requests = [];
        assert.equal(requests.length, 0);
        delete require.cache[require.resolve(LEANPLUM_PATH)];
      });

      it('test addStartResponseHandler', (done) => {
        interceptRequest((request) => {
          request.respond(200, {
            'Content-Type': 'application/json',
          }, JSON.stringify(startResponse));
        });
        Leanplum.addStartResponseHandler(() => {
          console.log('asdf');
          return done();
        });
        Leanplum.start();
      });
    });
  });
});
