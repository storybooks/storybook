import React, { PureComponent, Fragment, Validator } from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';
import { document } from 'global';
import { styled } from '@storybook/theming';
import copy from 'copy-to-clipboard';

import { STORY_CHANGED } from '@storybook/core-events';
import {
  Placeholder,
  TabWrapper,
  TabsState,
  ActionBar,
  Link,
  ScrollArea,
} from '@storybook/components';
import { API } from '@storybook/api';
import { RESET, SET, CHANGE, SET_OPTIONS, CLICK } from '../shared';

import { getKnobControl } from './types';
import PropForm from './PropForm';
import { KnobStoreKnob } from '../KnobStore';

const getTimestamp = () => +new Date();

export const DEFAULT_GROUP_ID = 'Other';

const PanelWrapper = styled(({ children, className }: any) => (
  <ScrollArea horizontal vertical className={className}>
    {children}
  </ScrollArea>
))({
  height: '100%',
  width: '100%',
});

interface PanelKnobGroups {
  title: string;
  render: (knob: any) => any;
}

interface KnobPanelProps {
  active: boolean;
  onReset?: object;
  api: Pick<API, 'on' | 'off' | 'emit' | 'getQueryParam' | 'setQueryParams'>;
}

interface KnobPanelState {
  knobs: Record<string, KnobStoreKnob>;
}

interface KnobPanelOptions {
  timestamps?: boolean;
}

export default class KnobPanel extends PureComponent<KnobPanelProps> {
  static propTypes = {
    active: PropTypes.bool.isRequired as Validator<KnobPanelProps['active']>,
    onReset: PropTypes.object as Validator<KnobPanelProps['onReset']>, // eslint-disable-line
    api: PropTypes.shape({
      on: PropTypes.func,
      off: PropTypes.func,
      emit: PropTypes.func,
      getQueryParam: PropTypes.func,
      setQueryParams: PropTypes.func,
    }).isRequired as Validator<KnobPanelProps['api']>,
  };

  static defaultProps: KnobPanelProps = {
    active: true,
    api: {
      on: () => () => {},
      off: () => {},
      emit: () => {},
      getQueryParam: () => undefined,
      setQueryParams: () => {},
    },
  };

  state: KnobPanelState = {
    knobs: {},
  };

  options: KnobPanelOptions = {};

  lastEdit: number = getTimestamp();

  loadedFromUrl = false;

  mounted = false;

  componentDidMount() {
    this.mounted = true;
    const { api } = this.props;
    api.on(SET, this.setKnobs);
    api.on(SET_OPTIONS, this.setOptions);

    this.stopListeningOnStory = api.on(STORY_CHANGED, () => {
      if (this.mounted) {
        this.setKnobs({ knobs: {} });
      }
      this.setKnobs({ knobs: {} });
    });
  }

  componentWillUnmount() {
    this.mounted = false;
    const { api } = this.props;

    api.off(SET, this.setKnobs);
    this.stopListeningOnStory();
  }

  setOptions = (options: KnobPanelOptions = { timestamps: false }) => {
    this.options = options;
  };

  setKnobs = ({
    knobs,
    timestamp,
  }: {
    knobs: Record<string, KnobStoreKnob>;
    timestamp?: number;
  }) => {
    const queryParams: Record<string, any> = {};
    const { api } = this.props;

    if (!this.options.timestamps || !timestamp || this.lastEdit <= timestamp) {
      Object.keys(knobs).forEach((name) => {
        const knob = knobs[name];
        // For the first time, get values from the URL and set them.
        if (!this.loadedFromUrl) {
          const urlValue = api.getQueryParam(`knob-${name}`);

          // If the knob value present in url
          if (urlValue !== undefined) {
            const value = getKnobControl(knob.type).deserialize(urlValue);
            knob.value = value;
            queryParams[`knob-${name}`] = getKnobControl(knob.type).serialize(value);

            api.emit(CHANGE, knob);
          }
        }
      });

      api.setQueryParams(queryParams);
      this.setState({ knobs });

      this.loadedFromUrl = true;
    }
  };

  reset = () => {
    const { api } = this.props;

    api.emit(RESET);
  };

  copy = () => {
    const { location } = document;
    const query = qs.parse(location.search, { ignoreQueryPrefix: true });
    const { knobs } = this.state;

    Object.entries(knobs).forEach(([name, knob]) => {
      query[`knob-${name}`] = getKnobControl(knob.type).serialize(knob.value);
    });

    copy(`${location.origin + location.pathname}?${qs.stringify(query, { encode: false })}`);

    // TODO: show some notification of this
  };

  emitChange = (changedKnob: KnobStoreKnob) => {
    const { api } = this.props;

    api.emit(CHANGE, changedKnob);
  };

  handleChange = (changedKnob: KnobStoreKnob) => {
    this.lastEdit = getTimestamp();
    const { api } = this.props;
    const { knobs } = this.state;
    const { name } = changedKnob;
    const newKnobs = { ...knobs };
    newKnobs[name] = {
      ...newKnobs[name],
      ...changedKnob,
    };

    this.setState({ knobs: newKnobs }, () => {
      this.emitChange(changedKnob);

      const queryParams: { [key: string]: any } = {};

      Object.keys(newKnobs).forEach((n) => {
        const knob = newKnobs[n];
        queryParams[`knob-${n}`] = getKnobControl(knob.type).serialize(knob.value);
      });

      api.setQueryParams(queryParams);
    });
  };

  handleClick = (knob: KnobStoreKnob) => {
    const { api } = this.props;

    api.emit(CLICK, knob);
  };

  stopListeningOnStory!: Function;

  render() {
    const { knobs } = this.state;
    const { active: panelActive } = this.props;
    if (!panelActive) {
      return null;
    }

    const groups: Record<string, PanelKnobGroups> = {};
    const groupIds: string[] = [];

    const knobKeysArray = Object.keys(knobs).filter((key) => knobs[key].used);

    knobKeysArray.forEach((key) => {
      const knobKeyGroupId = knobs[key].groupId || DEFAULT_GROUP_ID;
      groupIds.push(knobKeyGroupId);
      groups[knobKeyGroupId] = {
        render: ({ active }) => (
          <TabWrapper key={knobKeyGroupId} active={active}>
            <PropForm
              knobs={knobsArray.filter(
                (knob) => (knob.groupId || DEFAULT_GROUP_ID) === knobKeyGroupId
              )}
              onFieldChange={this.handleChange}
              onFieldClick={this.handleClick}
            />
          </TabWrapper>
        ),
        title: knobKeyGroupId,
      };
    });

    const knobsArray = knobKeysArray.map((key) => knobs[key]);

    if (knobsArray.length === 0) {
      return (
        <Placeholder>
          <Fragment>No knobs found</Fragment>
          <Fragment>
            Learn how to&nbsp;
            <Link
              href="https://github.com/storybookjs/storybook/tree/master/addons/knobs"
              target="_blank"
              withArrow
              cancel={false}
            >
              dynamically interact with components
            </Link>
          </Fragment>
        </Placeholder>
      );
    }

    // Always sort DEFAULT_GROUP_ID (ungrouped) tab last without changing the remaining tabs
    const sortEntries = (g: Record<string, PanelKnobGroups>): [string, PanelKnobGroups][] => {
      const unsortedKeys = Object.keys(g);
      if (unsortedKeys.includes(DEFAULT_GROUP_ID)) {
        const sortedKeys = unsortedKeys.filter((key) => key !== DEFAULT_GROUP_ID);
        sortedKeys.push(DEFAULT_GROUP_ID);
        return sortedKeys.map<[string, PanelKnobGroups]>((key) => [key, g[key]]);
      }
      return Object.entries(g);
    };

    const entries = sortEntries(groups);

    return (
      <Fragment>
        <PanelWrapper>
          {entries.length > 1 ? (
            <TabsState>
              {entries.map(([k, v]) => (
                <div id={k} key={k} title={v.title}>
                  {v.render}
                </div>
              ))}
            </TabsState>
          ) : (
            <PropForm
              knobs={knobsArray}
              onFieldChange={this.handleChange}
              onFieldClick={this.handleClick}
            />
          )}
        </PanelWrapper>
        <ActionBar
          actionItems={[
            { title: 'Copy', onClick: this.copy },
            { title: 'Reset', onClick: this.reset },
          ]}
        />
      </Fragment>
    );
  }
}
