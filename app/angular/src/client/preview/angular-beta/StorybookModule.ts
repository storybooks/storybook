import { NgModule, Type } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import dedent from 'ts-dedent';

import { Subject } from 'rxjs';
import deprecate from 'util-deprecate';
import { ICollection, StoryFnAngularReturnType } from '../types';
import { Parameters } from '../types-6-0';
import { storyPropsProvider } from './StorybookProvider';
import { isComponentAlreadyDeclaredInModules } from './utils/NgModulesAnalyzer';
import { isDeclarable } from './utils/NgComponentAnalyzer';
import { createStorybookWrapperComponent } from './StorybookWrapperComponent';
import { computesTemplateFromComponent } from './ComputesTemplateFromComponent';

const deprecatedStoryComponentWarning = deprecate(
  () => {},
  dedent`\`component\` story return value is deprecated, and will be removed in Storybook 7.0.
        Instead, use \`export const default = () => ({ component: AppComponent });\`
        or
        \`\`\`
        export const Primary: Story = () => ({});
        Primary.parameters = { component: AppComponent };
        \`\`\`
        Read more at 
        - https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#deprecated-angular-story-component).
        - https://storybook.js.org/docs/angular/writing-stories/parameters
      `
);

export const getStorybookModuleMetadata = (
  {
    storyFnAngular,
    parameters,
    targetSelector,
  }: {
    storyFnAngular: StoryFnAngularReturnType;
    parameters: Parameters;
    targetSelector: string;
  },
  storyProps$: Subject<ICollection>
): NgModule => {
  const { component: storyComponent, props, styles, moduleMetadata = {} } = storyFnAngular;
  let { template } = storyFnAngular;

  if (storyComponent) {
    deprecatedStoryComponentWarning();
  }
  const component = storyComponent ?? parameters.component;

  if (hasNoTemplate(template) && component) {
    template = computesTemplateFromComponent(component, props, '');
  }

  /**
   * Create a component that wraps generated template and gives it props
   */
  const ComponentToInject = createStorybookWrapperComponent(
    targetSelector,
    template,
    component,
    styles,
    props
  );

  // Look recursively (deep) if the component is not already declared by an import module
  const requiresComponentDeclaration =
    isDeclarable(component) &&
    !isComponentAlreadyDeclaredInModules(
      component,
      moduleMetadata.declarations,
      moduleMetadata.imports
    );

  return {
    declarations: [
      ...(requiresComponentDeclaration ? [component] : []),
      ComponentToInject,
      ...(moduleMetadata.declarations ?? []),
    ],
    imports: [BrowserModule, ...(moduleMetadata.imports ?? [])],
    providers: [storyPropsProvider(storyProps$), ...(moduleMetadata.providers ?? [])],
    entryComponents: [...(moduleMetadata.entryComponents ?? [])],
    schemas: [...(moduleMetadata.schemas ?? [])],
    bootstrap: [ComponentToInject],
  };
};

export const createStorybookModule = (ngModule: NgModule): Type<unknown> => {
  @NgModule(ngModule)
  class StorybookModule {}
  return StorybookModule;
};

function hasNoTemplate(template: string | null | undefined): template is undefined {
  return template === null || template === undefined;
}
