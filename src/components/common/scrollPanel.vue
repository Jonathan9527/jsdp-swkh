<template>
  <div class="scroll-container" ref="scrollContainer" @mousewheel="handleScroll">
    <div class="scroll-wrapper" ref="scrollWrapper" :style="{left: left + 'px'}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  const padding = 1;
  export default {
    name: 'scrollPane',
    data() {
      return {
        left: 0
      }
    },
    methods: {
      handleScroll(e) {
        let left = this.left;
        e.preventDefault();
        const $container = this.$refs.scrollContainer;
        const $containerWidth = $container.offsetWidth;
        const $wrapper = this.$refs.scrollWrapper;
        const $wrapperWidth = $wrapper.offsetWidth;

        if (e.wheelDelta > 0) {
          this.left = Math.min(0, left + e.wheelDelta)
        } else {

          if ($containerWidth - padding < $wrapperWidth) {
            if (left < -($wrapperWidth - $containerWidth + padding)) {
              this.left = left;
            } else {
              this.left = Math.max(left + e.wheelDelta, $containerWidth - $wrapperWidth - padding)
            }
          } else {
            this.left = 0;
          }
        }
      },
      moveToTarget($target) {
        const $container = this.$refs.scrollContainer;
        const $containerWidth = $container.offsetWidth;
        const $targetLeft = $target.offsetLeft;
        const $targetWidth = $target.offsetWidth;
        if ($targetLeft < -this.left) {
          // tag in the left
          this.left = -$targetLeft + padding
        } else if ($targetLeft + padding > -this.left && $targetLeft + $targetWidth < -this.left + $containerWidth - padding) {
        } else {
          this.left = -($targetLeft - ($containerWidth - $targetWidth) + padding);
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .scroll-container {
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    height: 35px;
		background: #fff;
    .scroll-wrapper {
      position: absolute;
    }
  }
</style>
