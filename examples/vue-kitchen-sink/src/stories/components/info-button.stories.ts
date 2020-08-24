import InfoButton from './InfoButton.vue';

export default {
  title: 'InfoButton',
  component: InfoButton,
};

export const Simple = () => ({
  components: { InfoButton },
  template: '<info-button label="I\'m a button!"/>',
});
