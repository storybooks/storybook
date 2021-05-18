import MyButton from '../Button.vue';

export default {
  title: 'Button',
  component: MyButton,
  argTypes: {
    color: { control: 'color' },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MyButton },
  template: '<my-button :color="color" :rounded="rounded" :corners="corners">{{label}}</my-button>',
});

export const Rounded = Template.bind({});
Rounded.args = {
  rounded: true,
  color: '#f00',
  label: 'A Button with rounded edges',
};

export const Square = Template.bind({});
Square.args = {
  rounded: false,
  color: '#00f',
  label: 'A Button with square edges',
};

export const Varied = Template.bind({});
Varied.args = {
  rounded: false,
  corners: [true, false, true, false],
  color: '#00f',
  label: 'A Button with varied edges',
};
