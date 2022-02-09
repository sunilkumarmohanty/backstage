/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';

import { TechDocsShadowDomProvider } from '@backstage/plugin-techdocs';

import { AnchorScrollTransformer } from './AnchorScroll';
import { createDom } from '../../test-utils';

jest.useFakeTimers();

describe('AnchorScroll', () => {
  const { location, scroll } = window;

  beforeAll(() => {
    jest.clearAllMocks();
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = { hash: '' };
    window.scroll = jest.fn();
  });

  afterAll(() => {
    window.location = location;
    window.scroll = scroll;
  });

  it('Should scroll to top if location does not have hash', () => {
    const dom = createDom(<body />);
    render(
      <TechDocsShadowDomProvider dom={dom}>
        <AnchorScrollTransformer />
      </TechDocsShadowDomProvider>,
    );
    jest.advanceTimersByTime(200);
    expect(window.scroll).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('Should scroll to anchor if location have hash', () => {
    window.location.hash = '#id';
    const dom = createDom(
      <body>
        <a id="id" href="/" style={{ marginTop: 100 }}>
          anchor
        </a>
      </body>,
    );
    render(
      <TechDocsShadowDomProvider dom={dom}>
        <AnchorScrollTransformer />
      </TechDocsShadowDomProvider>,
    );
    jest.advanceTimersByTime(200);
    expect(window.scroll).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
