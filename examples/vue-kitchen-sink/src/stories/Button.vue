<template>
  <button
    class="button"
    :style="{ color, borderColor: color }"
    :class="computedClasses"
    @click="onClick"
    @dblclick="onDoubleClick"
  >
    <slot />!
  </button>
</template>

<script>

  export default {
    name: 'Button',

    props: {
      rounded: { 
        type: Boolean,
        default: false,
      },
      corners: {
        type: [Boolean, Array],
        default: () => [false, false, false, false],
      },
      color: {
        type: String,
        default: '#42b983'
      }
    },

    computed: {
      computedClasses() {
        return {
          rounded: this.rounded,
          'rounded-top-left': this.corners[0],
          'rounded-top-right': this.corners[1],
          'rounded-bottom-right': this.corners[2],
          'rounded-bottom-left': this.corners[3],
        }
      }
    },

    methods: {
      onClick($event) {
        /**
         * Emitted when the button is clicked.
         * @event click
         * @type {Event}
         */
        this.$emit('click', $event);
      },
      onDoubleClick($event) {
        /**
         * Emitted when the button is double clicked.
         * @event doubleClick
         * @type {Event}
         */
        this.$emit('double-click', $event);
      }
    }
  }
</script>

<style>
.rounded {
  border-radius: 5px;
}
.rounded-top-left {
  border-top-left-radius: 5px;
}
.rounded-top-right {
  border-top-right-radius: 5px;
}
.rounded-bottom-right {
  border-bottom-right-radius: 5px;
}
.rounded-bottom-left {
  border-bottom-left-radius: 5px;
}

.button {
  border: 3px solid;
  padding: 10px 20px;
  background-color: white;
  outline: none;
}
</style>