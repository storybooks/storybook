---
title: 'Building pages with Storybook'
---

Storybook helps you build any component, from small “atomic” components to composed pages. But as you move up the component hierarchy toward the level of pages, you end up dealing with more complexity.

There are many ways to build pages in Storybook. Here are common patterns and solutions.

- Pure presentational pages.
- Connected components (e.g., network requests, context, browser environment).

## Pure presentational pages

Teams at the BBC, The Guardian, and the Storybook maintainers themselves build pure presentational pages. If you take this approach, you don't need to do anything special to render your pages in Storybook.

It's straightforward to write components to be fully presentational up to the screen level. That makes it easy to show in Storybook. The idea is that you do all the messy “connected” logic in a single wrapper component in your app outside of Storybook. You can see an example of this approach in the [Data](https://storybook.js.org/tutorials/intro-to-storybook/react/en/data/) chapter of the Intro to Storybook tutorial.

The benefits:

- Easy to write stories once components are in this form.
- All the data for the story is encoded in the args of the story, which works well with other parts of Storybook's tooling (e.g. [controls](../essentials/controls.md)).

The downsides:

- Your existing app may not be structured in this way, and it may be difficult to change it.

- Fetching data in one place means that you need to drill it down to the components that use it. This can be natural in a page that composes one big GraphQL query (for instance), but other data fetching approaches may make this less appropriate.

- It's less flexible if you want to load data incrementally in different places on the screen.

### Args composition for presentational screens

When you are building screens in this way, it is typical that the inputs of a composite component are a combination of the inputs of the various sub-components it renders. For instance, if your screen renders a page layout (containing details of the current user), a header (describing the document you are looking at), and a list (of the subdocuments), the inputs of the screen may consist of the user, document and subdocuments.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/simple-page-implementation.js.mdx',
    'react/simple-page-implementation.ts.mdx',
    'vue/simple-page-implementation.2.mdx',
    'vue/simple-page-implementation.3.mdx',
    'angular/simple-page-implementation.ts.mdx',
    'svelte/simple-page-implementation.js',
  ]}
/>

<!-- prettier-ignore-end -->

In such cases it is natural to use [args composition](../writing-stories/args.md#args-composition) to build the stories for the page based on the stories of the sub-components:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/page-story-with-args-composition.js.mdx',
    'react/page-story-with-args-composition.ts.mdx',
    'vue/page-story-with-args-composition.2.js.mdx',
    'vue/page-story-with-args-composition.3.js.mdx',
    'angular/page-story-with-args-composition.ts.mdx',
    'svelte/page-story-with-args-composition.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

This approach is beneficial when the various subcomponents export a complex list of different stories. You can pick and choose to build realistic scenarios for your screen-level stories without repeating yourself. Your story maintenance burden is minimal by reusing the data and taking a Don't-Repeat-Yourself(DRY) philosophy.

## Mocking connected components

If you need to render a connected component in Storybook, you can mock the network requests to fetch its data. There are various layers in which you can do that.

### Mocking providers

If you are using a provider that supplies data via the context, you can wrap your story in a decorator that provides a mocked version of that provider. For example, in the [Screens](https://storybook.js.org/tutorials/intro-to-storybook/react/en/screen/) chapter of the Intro to Storybook tutorial, we mock a Redux provider with mock data.

### Mocking API Services

Connected applications are everywhere, consuming data either from REST or GraphQL endpoints. If you're working in an application that relies on either of these data providers, you can add Mock Service Worker (MSW) and [Storybook's MSW addon](https://storybook.js.org/addons/msw-storybook-addon) to mock data alongside your app and stories.

[Mock Service Worker](https://mswjs.io/) is an API mocking library. It relies on service workers to capture network requests and provides mocked data in response. The MSW addon adds this functionality into Storybook, allowing you to mock API requests in your stories.

#### Mocking REST requests with MSW addon

The approach documented [above](#args-composition-for-presentational-screens) could be quickly adapted if you're relying on a Restful API. For instance, if you're retrieving the list of documents from a Restful endpoint, you could have an implementation similar to:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/document-screen-fetch.js.mdx',
    'vue/document-screen-fetch.3.js.mdx',
    'angular/document-screen-fetch.ts.mdx',
    'svelte/document-screen-fetch.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

To test your screen with the mocked data, you could write a similar set of stories:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/documentscreen-story-msw-rest-request.js.mdx',
    'vue/documentscreen-story-msw-rest-request.3.js.mdx',
    'angular/documentscreen-story-msw-rest-request.ts.mdx',
    'svelte/documentscreen-story-msw-rest-request.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">
💡 <strong>Note:</strong> This example details how you can mock the REST request with fetch. Similar HTTP clients such as <a href="https://axios-http.com/">axios</a> can be used as well.
</div>

The mocked data (i.e., `TestData`) will be injected via [parameters](./writing-stories/parameters), enabling you to configure it per-story basis.

#### Mocking GraphQL queries with MSW addon

If instead of a Restful endpoint, you're retrieving the data from a [GraphQL](https://www.apollographql.com/docs/react/integrations/integrations/) endpoint. You could have the following implementation for your screen:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/document-screen-with-graphql.js.mdx',
    'vue/document-screen-with-graphql.3.js.mdx',
    'angular/document-screen-with-graphql.ts.mdx',
    'svelte/document-screen-with-grapqhl.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

To test your screen with the GraphQL mocked data, you could write the following stories:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/documentscreen-story-msw-graphql-query.js.mdx',
    'vue/documentscreen-story-msw-graphql-query.3.js.mdx',
    'vue/apollo-wrapper-component.with-mock-implementation-3.js.mdx',
    'angular/documentscreen-story-msw-graphql-query.ts.mdx',
    'angular/apollo-module.mock-apollo-module.ts.mdx',
    'svelte/documentscreen-story-msw-graphql-query.js.mdx',
    'svelte/apollo-wrapper-component.with-mock-implementation.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Mocking imports

It is also possible to mock imports directly, as you might in a unit test, using webpack’s aliasing. It's advantageous if your component makes network requests directly with third-party libraries.

We're going to use [isomorphic-fetch](https://www.npmjs.com/package/isomorphic-fetch) as an example.

Inside a directory called `__mocks__`, create a new file called
`isomorphic-fetch.js` with the following code:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/isomorphic-fetch-mock.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

The code above creates a decorator which reads story-specific data off the story's [parameters](../writing-stories/parameters), enabling you to configure the mock on a per-story basis.

To use the mock in place of the real import, we use [webpack aliasing](https://webpack.js.org/configuration/resolve/#resolvealias):

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-with-mock-decorator.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Add the decorator you've just implemented to your [storybook/preview.js](../configure/overview.md#configure-story-rendering):

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-with-mock-decorator.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Finally, we can set the mock values in a specific story. Let's borrow an example from this [blog post](https://medium.com/@edogc/visual-unit-testing-with-react-storybook-and-fetch-mock-4594d3a281e6):

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/app-story-with-mock.js.mdx',
    'vue/app-story-with-mock.2.js.mdx',
    'vue/app-story-with-mock.3.js.mdx',
    'angular/app-story-with-mock.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Specific mocks

Another mocking approach is to use libraries that intercept calls at a lower level. For instance, you can use [`fetch-mock`](https://www.npmjs.com/package/fetch-mock) to mock fetch requests specifically.

Like the [import mocking](##mocking-imports) above, once you have a mock, you’ll still want to set the return value of the mock per-story basis. Do this in Storybook with a [decorator](../writing-stories/decorators.md) that reads the story's [parameters](../writing-stories/parameters.md).

### Avoiding mocking dependencies

It's possible to avoid mocking the dependencies of connected "container" components entirely by passing them around via props or React context. However, it requires a strict split of the container and presentational component logic. For example, if you have a component responsible for data fetching logic and rendering DOM, it will need to be mocked as previously described.

It’s common to import and embed container components amongst presentational components. However, as we discovered earlier, to render them within Storybook, we’ll likely have to mock their dependencies or the imports themselves.

Not only can this quickly grow to become a tedious task, but it’s also challenging to mock container components that use local states. So, instead of importing containers directly, a solution to this problem is to create a React context that provides the container components. It allows you to freely embed container components as usual, at any level in the component hierarchy without worrying about subsequently mocking their dependencies; since we can swap out the containers themselves with their mocked presentational counterpart.

We recommend dividing context containers up over specific pages or views in your app. For example, if you had a `ProfilePage` component, you might set up a file structure as follows:

```
ProfilePage.js
ProfilePage.stories.js
ProfilePageContainer.js
ProfilePageContext.js
```

<div class="aside">

It’s also often helpful to set up a “global” container context (perhaps named `GlobalContainerContext`) for container components that may be rendered on every page of your app and adding them to the top level of your application. While it’s possible to place every container within this global context, it should only provide globally required containers.

</div>

Let’s look at an example implementation of this approach.

First, create a React context, and name it `ProfilePageContext`. It does nothing more than export a React context:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/mock-context-create.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

`ProfilePage` is our presentational component. It will use the `useContext` hook to retrieve the container components from `ProfilePageContext`:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/mock-context-in-use.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

#### Mocking containers in Storybook

In the context of Storybook, instead of providing container components through context, we’ll instead provide their mocked counterparts. In most cases, the mocked versions of these components can often be borrowed directly from their associated stories.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/mock-context-container.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">

If the same context applies to all `ProfilePage` stories, we can also use a [decorator](../writing-stories/decorators.md).

</div>

#### Providing containers to your application

Now, in the context of your application, you’ll need to provide `ProfilePage` with all of the container components it requires by wrapping it with `ProfilePageContext.Provider`:

For example, in Next.js, this would be your `pages/profile.js` component.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/mock-context-container-provider.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

#### Mocking global containers in Storybook

If you’ve set up `GlobalContainerContext`, you’ll need to set up a decorator within Storybook’s `preview.js` to provide context to all stories. For example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/mock-context-container-global.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->