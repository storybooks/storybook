import { customElement, bindable } from 'aurelia';

@customElement({
  name: 'storybook-header',
  template: `<template>
  <header>
    <div class="wrapper">
      <div>
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" fillRule="evenodd">
            <path
              d="M10 0h12a10 10 0 0110 10v12a10 10 0 01-10 10H10A10 10 0 010 22V10A10 10 0 0110 0z"
              fill="#FFF"
            />
            <path
              d="M5.3 10.6l10.4 6v11.1l-10.4-6v-11zm11.4-6.2l9.7 5.5-9.7 5.6V4.4z"
              fill="#555AB9"
            />
            <path
              d="M27.2 10.6v11.2l-10.5 6V16.5l10.5-6zM15.7 4.4v11L6 10l9.7-5.5z"
              fill="#91BAF8"
            />
          </g>
        </svg>
        <h1>Acme</h1>
      </div>
      <div>
        <storybook-button
          if.bind="user"
          size="small"
          click.delegate="onLogout($event)"
          label="Log out"
        ></storybook-button>
        <storybook-button
          if.bind="!user"
          size="small"
          click.delegate="onLogin($event)"
          label="Log in"
        ></storybook-button>
        <storybook-button
          if.bind="!user"
          primary
          size="small"
          click.delegate="onCreateAccount($event)"
          label="Sign up"
        ></storybook-button>
      </div>
    </div>
  </header>
  </template>`,
})
export class Header {
  @bindable()
  user: unknown = null;

  @bindable()
  onLogin: () => void = () => {};

  @bindable()
  onLogout: () => void = () => {};

  @bindable()
  onCreateAccount: () => void = () => {};
}
