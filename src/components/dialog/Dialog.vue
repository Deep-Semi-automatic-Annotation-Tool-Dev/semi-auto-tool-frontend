<template>
  <div id="dialog-root">
    <div id="dialog-title">{{ title }}</div>
    <div v-if="dialogType === this.DIALOG_TYPE_SUBTITLE" id="dialog-subtitle">{{ subtitle }}</div>
    <div v-else id="dialog-textfield">
      <v-text-field
          :label="textFieldLabel"
          variant="outlined"
          hide-details="true"
          v-model="fieldText"
      ></v-text-field>
    </div>
    <div id="dialog-buttons">
      <div class="dialog-button" id="dialog-button-yes" @click="onClickButton(this.DIALOG_CLICK_YES)">
        <div class="dialog-button-text">{{ textAccept }}</div>
      </div>
      <div class="dialog-button" id="dialog-button-no" @click="onClickButton(this.DIALOG_CLICK_NO)">
        <div class="dialog-button-text">{{ textDeny }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DialogComponent",
  props: {
    textAccept: {
      type: String,
      default: "accept"
    },
    textDeny: {
      type: String,
      default: "deny"
    },
    title: {
      type: String,
      default: "Title"
    },
    subtitle: {
      type: String,
      default: "Subtitle"
    },
    dialogType: {
      type: Number,
      default: 100
    },
    textFieldLabel: {
      type: String,
      default: 'label'
    }
  },
  data() {
    return {
      fieldText: ""
    }
  },
  methods: {
    onClickButton(type) {
      let returnData = {type: type}
      if (this.dialogType === this.DIALOG_TYPE_TEXTFIELD) {
        returnData.projectTitle = this.fieldText;
      }
      this.$emit('dialog-click', returnData)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../css/components/dialog.scss";
</style>