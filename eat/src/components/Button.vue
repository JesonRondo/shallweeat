<template>
  <div class="btn" :class="disabled ? 'disabled' : type" @click="bindtap">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    bindtap: {
      type: Function,
      default: function () {}
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'default'
    }
  }
}
</script>

<style scoped>
.btn {
  border: 1px solid rgb(231, 77, 59);
  background: rgb(231, 77, 59);
  color: #fff;
  line-height: 2;
  font-size: 16px;
  text-align: center;
}

.primary {
  border: 1px solid rgb(230, 119, 29);
  background: rgb(230, 119, 29);
}

.disabled {
  border: 1px solid #c3c3c3;
  background: #efefef;
  color: #999;
}

</style>
