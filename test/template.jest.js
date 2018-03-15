'use strict';

/* NOTE: this scipt is meant to be run via Jest, not Tape */

const assert = require('assert');
const template = require('../lib/template');

test('[template]', () => {
  assert.throws(
    () => template(),
    /options.service is required/,
    'throws when missing required options'
  );

  const builtWithDefaults = template({
    service: 'example',
    serviceVersion: '1',
    command: 'echo hello world',
    cluster: 'processing'
  });

  expect(builtWithDefaults).toMatchSnapshot('defaults');

  const setsAllOptions = template({
    service: 'example',
    serviceVersion: '1',
    command: 'echo hello world',
    cluster: 'processing',
    permissions: [
      {
        Effect: 'Allow',
        Action: 's3:GetObject',
        Resource: 'arn:aws:s3:::bucket/*'
      }
    ],
    env: {
      MyKey: 'MyValue'
    },
    prefix: 'Soup',
    family: 'abc-123',
    workers: 90,
    mounts: '/mnt/data:/data,/ephemeral',
    reservation: {
      memory: 512,
      softMemory: 128,
      cpu: 4096
    },
    privileged: true,
    messageTimeout: 300,
    messageRetention: 1096
  });

  expect(setsAllOptions).toMatchSnapshot('all-properties');
});