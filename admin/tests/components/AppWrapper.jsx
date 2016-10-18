import React from 'react'
import ReactDOM from 'react-dom'
import expect from 'expect'
import $ from 'jQuery'
import TestUtils from 'react-addons-test-utils'

import {Provider} from 'react-redux'
import {configureStore} from 'configureStore'


import AppWrapper from 'AppWrapper'

describe('AppWrapper', () => {
  it('should exist', () => {
    expect(AppWrapper).toExist();
  });

  // it('should render Child Component', () => {
  //   var store = configureStore();
  //   var provider = TestUtils.renderIntoDocument(
  //     <Provider store={ store }>
  //       <Main/>
  //     </Provider>
  //   )
  //   var childCompToSearch = TestUtils.scryRenderedComponentsWithType(provider, ChildComponentToSearch)[0];
  //
  //   expect(childCompToSearch.length).toEqual(1);
  // });
})
