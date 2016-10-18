import expect from 'expect'
import * as actions from 'actions';

describe('Action Generators - Account', () => {

  it('shoud set fething flag', () => {
    let action = {
      type: 'ACCOUNT:FETCHING',
      fetching: true,
    }
    let res = actions.accountIsFetching(action.fetching);
    expect(res).toEqual(action);
  });

  it('shoud generate LOGIN_FORM_ERROR', () => {
    let action = {
      type: 'LOGIN_FORM_ERROR',
      formError: 'someurl'
    }
    let res = actions.loginFormError(action.formError);
    expect(res).toEqual(action);
  });


  it('shoud generate SET_AUTH_TOKEN', () => {
    let action = {
      type: 'SET_AUTH_TOKEN',
      authToken: "asda123412r135r1234123"
    }
    let res = actions.setAuthToken(action.authToken);
    expect(res).toEqual(action);
  });

  it('shoud generate GET_AUTH_TOKEN', () => {
    let action = {
      type: 'GET_AUTH_TOKEN',
      authToken: "asda123412r135r1234123"
    }
    let res = actions.getAuthToken(action.authToken);
    expect(res).toEqual(action);
  });

  it('shoud generate SET_USER_DATA', () => {
    let action = {
      type: 'SET_USER_DATA',
      user: {
        username: "Ok"
      }
    }
    let res = actions.setUserData(action.user);
    expect(res).toEqual(action);
  });

});
