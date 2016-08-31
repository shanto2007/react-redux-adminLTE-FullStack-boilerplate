import expect from 'expect'
import * as actions from 'actions';

describe('Action Generators - Signin', () => {

  it('shoud generate SIGNIN_FETCHING', () => {
    let action = {
      type: 'SIGNIN_FETCHING',
      fetching: true,
    }
    let res = actions.signinFetching(action.fetching);
    expect(res).toEqual(action);
  });

  it('shoud generate NEW_USERNAME_EXIST', () => {
    let action = {
      type: 'NEW_USERNAME_EXIST',
      exist: true,
    }
    let res = actions.usernameExist(action.exist);
    expect(res).toEqual(action);
  });


  it('shoud generate VALID_PASSWORD', () => {
    let action = {
      type: 'VALID_PASSWORD',
      valid: true,
    }
    let res = actions.validPassword(action.valid);
    expect(res).toEqual(action);
  });

  it('shoud generate VALID_PASSWORD_CHECK', () => {
    let action = {
      type: 'VALID_PASSWORD_CHECK',
      valid: true,
    }
    let res = actions.validPasswordCheck(action.valid);
    expect(res).toEqual(action);
  });

  it('shoud generate SIGNIN_USERNAME_ERROR', () => {
    let action = {
      type: 'SIGNIN_USERNAME_ERROR',
      error: 'Some Error'
    }
    let res = actions.signinUsernameError(action.error);
    expect(res).toEqual(action);
  });

  it('shoud generate SIGNIN_PASSWORD_ERROR', () => {
    let action = {
      type: 'SIGNIN_PASSWORD_ERROR',
      error: 'Some Error'
    }
    let res = actions.signinPasswordError(action.error);
    expect(res).toEqual(action);
  });


  it('shoud generate SIGNIN_SUCCESSFUL', () => {
    let action = {
      type: 'SIGNIN_SUCCESSFUL',
      success:true,
    }
    let res = actions.signInSuccess(action.success);
    expect(res).toEqual(action);
  });


});
