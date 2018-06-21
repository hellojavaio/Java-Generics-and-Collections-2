import React from 'react';

let defaultLoadingComponent = () => null;

function asyncComponent(config) {
  const { resolve } = config;
  return class Lazyloads extends React.Component {
    constructor(props) {
      super(props);
      this.LoadingComponent = config.LoadingComponent || defaultLoadingComponent;
      this.state = {
        AsyncComponent: null,
      };
      this.load(props);
    }
    componentDidMount() {
      this.mounted = true;
    }
    componentWillUnmount() {
      this.mounted = false;
    }
    componentWillReceiveProps(nextProps) {
      if (nextProps.load !== this.props.load) {
        this.load(nextProps);
      }
    }
    load() {
      resolve().then((mod) => {
        const AsyncComponent = mod.default || mod;
        if (this.mounted) {
          this.setState({ AsyncComponent });
        } else {
          this.state.AsyncComponent = AsyncComponent; // eslint-disable-line
        }
      });
    }
    render() {
      const { AsyncComponent } = this.state;
      const { LoadingComponent } = this;
      if (this.state.AsyncComponent) {
        return <AsyncComponent {...this.props} />;
      }
      return <LoadingComponent {...this.props} />;
    }
  };
}

export default function dynamic(config) {
  const { component: resolveComponent, models: resolveModels } = config;
  return asyncComponent({
    resolve: config.resolve || function () {
      return new Promise((resolve) => {
        let models = typeof resolveModels === 'function' ? resolveModels() : [];
        const component = resolveComponent();
        models = !models ? [] : models;
        Promise.all([...models, component]).then((ret) => {
          if (!models || !models.length) {
            return resolve(ret[0]);
          }
          const len = models.length;
          return resolve(ret[len]);
        });
      });
    },
    ...config,
  });
}

dynamic.setDefaultLoadingComponent = (LoadingComponent) => {
  defaultLoadingComponent = LoadingComponent;
};
