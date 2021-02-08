import AngularSnapshotSerializer from 'jest-preset-angular/build/AngularSnapshotSerializer';
import HTMLCommentSerializer from 'jest-preset-angular/build/HTMLCommentSerializer';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TestBed } from '@angular/core/testing';
// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { addSerializer } from 'jest-specific-snapshot';
import { getStorybookModuleMetadata } from '@storybook/angular/renderer';
import { BehaviorSubject } from 'rxjs';

addSerializer(HTMLCommentSerializer);
addSerializer(AngularSnapshotSerializer);

async function getRenderedTree(story: any) {
  const currentStory = await story.render();

  const moduleMeta = getStorybookModuleMetadata(
    { storyFnAngular: currentStory, parameters: story.parameters },
    new BehaviorSubject(currentStory.props)
  );

  TestBed.configureTestingModule({
    imports: [...moduleMeta.imports],
    declarations: [...moduleMeta.declarations],
    providers: [...moduleMeta.providers],
    schemas: [...moduleMeta.schemas],
  });

  TestBed.overrideModule(BrowserDynamicTestingModule, {
    set: {
      entryComponents: [...moduleMeta.entryComponents],
    },
  });

  return TestBed.compileComponents().then(() => {
    const tree = TestBed.createComponent(moduleMeta.bootstrap[0] as any);
    tree.detectChanges();

    // Empty componentInstance remove attributes of the internal main component (<storybook-wrapper>) in snapshot
    return { ...tree, componentInstance: {} };
  });
}

export default getRenderedTree;
