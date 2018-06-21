
react-dynamic-loadable
---

A higher order component for loading components with dynamic imports.

## Install

```bash
npm install react-dynamic-loadable --save
```

## Example

```js
import Loadable from 'react-dynamic-loadable';
import Loading from './my-loading-component';

const LoadableComponent = Loadable({
  component: () => import('./my-component'),
  LoadingComponent: () => Loading,
});

export default class App extends React.Component {
  render() {
    return <LoadableComponent/>;
  }
}
```

## Example

Use [Redux](https://github.com/reactjs/redux) (**[@rematch](https://github.com/rematch/rematch)**), [React Router](https://github.com/ReactTraining/react-router) [Example](./example).

> [Example code](./example)

```js
import React from 'react';
import { model } from '@rematch/core';
import dynamic from 'react-dynamic-loadable';

const dynamicWrapper = (models, component) => dynamic({
  models: () => models.map((m) => {
    return import(`./models/${m}.js`).then((md) => {
      model({ name: m, ...md[m] });
    });
  }),
  component,
  LoadingComponent: () => <span>loading....</span>,
});

export const getRouterData = () => {
  const conf = {
    '/': {
      component: dynamicWrapper(['user'], () => import('./layouts/BasicLayout')),
    },
    '/home': {
      component: dynamicWrapper([], () => import('./routes/Home')),
    },
    '/login': {
      component: dynamicWrapper(['user'], () => import('./routes/Login')),
    },
  };
  return conf;
};
```