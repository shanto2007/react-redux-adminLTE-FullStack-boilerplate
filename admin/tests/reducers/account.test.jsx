import expect from 'expect'
import uuid from 'node-uuid'
import moment from 'moment'
import df from 'deep-freeze-strict' // to test pure function won't change source argument

import * as reducers from 'reducers'

describe('Reducers - Account', () => {

  // it('shoud set account fetching flag', () => {
  //   let action = {
  //     type: 'ACCOUNT:FETCHING',
  //     fetching: true,
  //   }
  //   let state = reducers.account = ( df({}), df(action) );
  //
  //   console.log(state);
  //
  // });

});
