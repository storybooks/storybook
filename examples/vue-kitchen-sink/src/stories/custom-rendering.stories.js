import Vuex from 'vuex';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import MyButton from './Button.vue';

export default {
  title: 'Custom/Method for rendering Vue',
};

export const render = () => ({
  render: h => h('div', ['renders a div with some text in it..']),
});

export const renderComponent = () => ({
  render(h) {
    return h(MyButton, { props: { color: 'pink' } }, ['renders component: MyButton']);
  },
});

renderComponent.story = {
  name: 'render + component',
};

export const template = () => ({
  template: `
      <div>
        <h1>A template</h1>
        <p>rendered in vue in storybook</p>
      </div>`,
});

export const templateComponent = () => ({
  components: { MyButton },
  template: '<my-button>MyButton rendered in a template</my-button>',
});

templateComponent.story = {
  name: 'template + component',
};

export const templateMethods = () => ({
  components: { MyButton },
  template: `
      <p>
        <em>Clicking the button will navigate to another story using the 'addon-links'</em><br/>
        <my-button :rounded="true" @click="action">MyButton rendered in a template + props & methods</my-button>
      </p>`,
  methods: {
    action: linkTo('Button'),
  },
});

templateMethods.story = {
  name: 'template + methods',
};

export const JSX = () => ({
  components: { MyButton },
  render() {
    return <my-button>MyButton rendered with JSX</my-button>;
  },
});

export const vuexActions = () => ({
  components: { MyButton },
  template: '<my-button @click="log">with vuex: {{ $store.state.count }}</my-button>',
  store: new Vuex.Store({
    state: { count: 0 },
    mutations: {
      increment(state) {
        state.count += 1; // eslint-disable-line
        action('vuex state')(state);
      },
    },
  }),
  methods: {
    log() {
      this.$store.commit('increment');
    },
  },
});

vuexActions.story = {
  name: 'vuex + actions',
};

export const whateverYouWant = () => ({
  components: { MyButton },
  template: '<my-button @click="log">with awesomeness: {{ $store.state.count }}</my-button>',
  store: new Vuex.Store({
    state: { count: 0 },
    mutations: {
      increment(state) {
        state.count += 1; // eslint-disable-line
        action('vuex state')(state);
      },
    },
  }),
  methods: {
    log() {
      this.$store.commit('increment');
    },
  },
});

whateverYouWant.story = {
  name: 'whatever you want',
};

export const preRegisteredComponent = () => ({
  /* By pre-registering component in config.js,
   * the need to register all components with each story is removed.
   * You'll only need the template */
  template: `
      <p>
        <em>This component was pre-registered in .storybook/config.js</em><br/>
        <my-button>MyButton rendered in a template</my-button>
      </p>`,
});

preRegisteredComponent.story = {
  name: 'pre-registered component',
};
