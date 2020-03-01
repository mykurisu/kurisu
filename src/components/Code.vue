<template>
  <div id="codemirror">
    <codemirror
      :value="this.value"
      :options="cmOptions"
      @ready="onCmReady"
      @input="onCmCodeChange"
      @focus="onCmFocus"
    />
  </div>
</template>

<script>
import { codemirror } from "vue-codemirror";
import "codemirror/mode/markdown/markdown";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/monokai.css";

export default {
  components: {
    codemirror
  },
  props: ["width", "height", "value"],
  data() {
    return {
      code: '',
      cmOptions: {
        tabSize: 4,
        mode: "markdown",
        theme: "monokai",
        lineNumbers: true,
        line: true
      }
    };
  },
  methods: {
    onCmReady(cm) {
      const { width = "100%", height = "300px" } = this;
      cm.setSize(width, height);
    },
    onCmCodeChange(newCode) {
      this.code = newCode
      this.$emit('change', { value: newCode })
    },
    onCmFocus() {
      this.$emit('focus')
    }
  }
};
</script>
