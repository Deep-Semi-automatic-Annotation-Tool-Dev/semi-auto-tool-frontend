<template>
  <div id="layout-root">
    <AppBar></AppBar>
    <div id="layout-project-root">
      <div id="layout-project-sidebar">
        <div id="layout-sidebar-project-list">
          <div id="text-project-list-title">프로젝트 목록</div>
          <!--     프로젝트 리스트     -->
          <div id="text-project-list-item" class="list-vuetify">
            <div
                v-for="item in projectList"
                :key="item.project_id"
                class="list-vuetify-item"
                @click.left="projectListLeftClick($event, item.project_id)"
                @click.right="projectListRightClick($event, item.project_id, item.project_name)"
                @contextmenu.prevent
            >
              {{ item.project_name }}
            </div>
          </div>
        </div>

        <!--    프로젝트 생성 다이얼로그 부분    -->
        <v-dialog
            v-model="showMakeProjectDialog"
            width="auto"
        >
          <template v-slot:activator="{ props }">
            <v-btn
                color="light_magenta"
                id="text-project-create-btn"
                prepend-icon="mdi-plus"
                v-bind="props"
            >
              프로젝트생성
            </v-btn>
          </template>
          <!--     다이얼로그     -->
          <Dialog
              v-on:dialog-click="projectCreateDialogClicked"
              :dialog-type="this.DIALOG_TYPE_TEXTFIELD"
              title="프로젝트 생성"
              text-field-label="프로젝트 이름"
              text-accept="생성"
              text-deny="취소"
          ></Dialog>
        </v-dialog>

      </div>
      <div id="layout-project-editor">
        <!--   문장/태그 편집 영역   -->
        <div id="layout-project-text-area">
          <div id="layout-project-editor-top">
            <div id="editor-top-title">프로젝트 제목</div>
            <v-btn color="light_magenta" height="30">
              저장
            </v-btn>
            <v-btn color="light_brown" height="30">
              텍스트 로드
            </v-btn>
          </div>
          <div id="layout-project-editor-main">
            <div id="layout-project-editor-main-title">
              <div id="editor-main-title">-선택된 태그구성-</div>
            </div>
            <div id="editor-main-lines" class="list-vuetify-light">
              <p
                v-for="(l, idx) in lineData"
                :key="l"
                class="text-line"
                :data-tooltip="idx"
                @dragenter.prevent
                @dragover.prevent
                @drop.prevent="onDrop($event, idx)"
              >
                <span class="text-word">{{ l.text }}</span>
                <v-chip
                      v-if="checkDataTag(l.data_tags) !== undefined"
                      size="small"
                      :style="[chipBackground(`#${checkDataTag(l.data_tags).tagColor}`),
                      setChipBackgroundColor(`#${checkDataTag(l.data_tags).tagColor}`)]"
                    >
                  {{ checkDataTag(l.data_tags).tagName }}
                </v-chip>
              </p>
            </div>
<!--            <p id="editor-main-lines" class="list-vuetify-light">-->
<!--              <span-->
<!--                  v-for="(l, idx) in lineData"-->
<!--                  :key="l"-->
<!--                  :class="getTagClasses(l.tags)"-->
<!--                  class="text-line"-->
<!--                  :data-tooltip="idx"-->
<!--                  @mouseover="lineOver"-->
<!--              >{{ l.data }}</span>-->
<!--            </p>-->
          </div>
        </div>
        <!--   태그 선택 및 학습 영역   -->
        <div id="layout-project-tag-area">

          <div class="stepper-item" :class="stepperIdx === 0 ? 'selected' : ''">
            <div class="stepper-item-top">
              <div class="stepper-item-top-circle" :class="stepperIdx === 0 ? 'selected' : ''">
                <div class="stepper-item-top-circle-num">1</div>
              </div>
              <div class="stepper-item-top-circle-title" :class="stepperIdx === 0 ? 'stepper-item-top-circle-title-selected' : ''">
                태깅 - {{ tagGroups.length > 0 ? tagGroups[selectedTagGroup].tag_group_name : '' }}
              </div>
            </div>

            <div class="stepper-item-content">
              <v-divider class="stepper-item-divider" vertical></v-divider>
              <div class="stepper-item-content-area" :class="stepperIdx !== 0 ? 'unselected' : ''">
                <div id="tags-group-select-area">
                  <v-container class="pa-0 ma-0">
                    <v-select
                        label="태그 그룹"
                        density="comfortable"
                        :items="tagGroups"
                        item-title="tag_group_name"
                        item-value="value"
                        :hide-details="true"
                        @update:model-value="changeGroup"
                    ></v-select>
                  </v-container>
                  <v-container class="pa-0 ma-0">
                    <v-btn color="light_magenta" id="tags-group-add-btn">
                      그룹 추가
                    </v-btn>
                  </v-container>
                </div>
                <div id="layout-project-tag-selection-area">
                  <div id="tag-selection-top">
                    <div id="tag-top-title">태그-선택된 그룹의 태그</div>
                    <v-btn color="light_brown" height="30" width="80" id="tag-top-add-btn">
                      태그추가
                    </v-btn>
                  </div>
                  <div id="tag-chips">
                    <v-chip-group
                        class="pa-3 list-vuetify-light"
                    >
                      <v-chip
                          v-for="tag in tags"
                          :key="tag"
                          :draggable="true"
                          @dragstart="startDrag($event, [tag.tag_id, tag.tag_name, `#${tag.tag_color}`])"
                          :style="[chipBackground(`#${tag.tag_color}`),
                          setChipBackgroundColor(`#${tag.tag_color}`)]"
                      >
                        {{ tag.tag_name }}
                      </v-chip>
                    </v-chip-group>
                  </div>
                </div>

                <div class="stepper-item-buttons">
                  <v-btn color="color_accept" size="small" @click="stepperNext">
                    모델선택
                  </v-btn>
<!--                  <v-btn color="color_deny" size="small" @click="stepperPrev">-->
<!--                    이전-->
<!--                  </v-btn>-->
                </div>
              </div>
            </div>
          </div>

          <div class="stepper-item" :class="stepperIdx === 1 ? 'selected' : ''">
            <div class="stepper-item-top">
              <div class="stepper-item-top-circle" :class="stepperIdx === 1 ? 'selected' : ''">
                <div class="stepper-item-top-circle-num">2</div>
              </div>
              <div class="stepper-item-top-circle-title" :class="stepperIdx === 1 ? 'stepper-item-top-circle-title-selected' : ''">
                모델 - {{ modelLists[selectedModel].name }}
              </div>
            </div>

            <div class="stepper-item-content">
              <v-divider class="stepper-item-divider" vertical></v-divider>
              <div class="stepper-item-content-area" :class="stepperIdx !== 1 ? 'unselected' : ''">
                <div id="layout-project-model-area">
                  <div class="model-summary">Active Learning을 진행할 모델을 선택해주세요.</div>
                  <v-container class="pa-0 ma-0">
                    <v-select
                        label="모델 목록"
                        density="comfortable"
                        :items="modelLists"
                        item-title="name"
                        item-value="value"
                        :hide-details="true"
                        @update:model-value="changeModel"
                    ></v-select>
                  </v-container>
<!--                  <div id="model-learning-selection">-->
<!--                    <v-btn color="color_accept" class="learning-btn">-->
<!--                      모델학습-->
<!--                    </v-btn>-->
<!--                    <v-btn color="color_deny" class="learning-btn">-->
<!--                      데이터리로드-->
<!--                    </v-btn>-->
<!--                  </div>-->
<!--                  <v-btn color="color_second" id="annotation-btn">-->
<!--                    Auto Annotation-->
<!--                  </v-btn>-->
                </div>
                <div class="stepper-item-buttons">
                  <v-btn color="color_accept" size="small" @click="stepperNext">
                    학습
                  </v-btn>
                  <v-btn color="color_deny" size="small" @click="stepperPrev">
                    태깅 다시하기
                  </v-btn>
                </div>
              </div>
            </div>
          </div>

          <div class="stepper-item" :class="stepperIdx === 2 ? 'selected' : ''">
            <div class="stepper-item-top">
              <div class="stepper-item-top-circle" :class="stepperIdx === 2 ? 'selected' : ''">
                <div class="stepper-item-top-circle-num">3</div>
              </div>
              <div class="stepper-item-top-circle-title" :class="stepperIdx === 2 ? 'stepper-item-top-circle-title-selected' : ''">
                Training
              </div>
            </div>

            <div class="stepper-item-content">
              <v-divider class="stepper-item-divider" vertical></v-divider>
              <div class="stepper-item-content-area" :class="stepperIdx !== 2 ? 'unselected' : ''">

                <div class="model-summary">학습이 완료되면 자동으로 다음 단계로 넘어갑니다.</div>
                <v-progress-linear indeterminate></v-progress-linear>
                <div class="stepper-item-buttons">
                  <v-btn color="color_accept" size="small" @click="stepperNext">
                    다음
                  </v-btn>
                  <v-btn color="color_deny" size="small" @click="stepperPrev">
                    이전
                  </v-btn>
                </div>
              </div>
            </div>
          </div>

          <div class="stepper-item" :class="stepperIdx === 3 ? 'selected' : ''">
            <div class="stepper-item-top">
              <div class="stepper-item-top-circle" :class="stepperIdx === 3 ? 'selected' : ''">
                <div class="stepper-item-top-circle-num">4</div>
              </div>
              <div class="stepper-item-top-circle-title" :class="stepperIdx === 3 ? 'stepper-item-top-circle-title-selected' : ''">
                Auto Annotation
              </div>
            </div>

            <div class="stepper-item-content">
              <v-divider class="stepper-item-divider" vertical></v-divider>
              <div class="stepper-item-content-area" :class="stepperIdx !== 3 ? 'unselected' : ''">


                <div class="model-summary">학습이 완료되면 자동으로 다음 단계로 넘어갑니다.</div>
                <v-progress-linear indeterminate></v-progress-linear>
                <div class="stepper-item-buttons">
                  <v-btn color="color_accept" size="small" @click="stepperNext">
                    다음
                  </v-btn>
                  <v-btn color="color_deny" size="small" @click="stepperPrev">
                    이전
                  </v-btn>
                </div>
              </div>
            </div>
          </div>

          <div class="stepper-item" :class="stepperIdx === 4 ? 'selected' : ''">
            <div class="stepper-item-top">
              <div class="stepper-item-top-circle" :class="stepperIdx === 4 ? 'selected' : ''">
                <div class="stepper-item-top-circle-num">5</div>
              </div>
              <div class="stepper-item-top-circle-title" :class="stepperIdx === 4 ? 'stepper-item-top-circle-title-selected' : ''">
                Data Reload
              </div>
            </div>

            <div class="stepper-item-content stepper-item-content-last">
<!--              <v-divider vertical></v-divider>-->
              <div class="stepper-item-content-area" :class="stepperIdx !== 4 ? 'unselected' : ''">

                <div>

                  <div class="model-summary">정답 데이터: n개</div>
                  <div class="model-summary">오답 데이터: n개</div>
                  <div class="model-summary">data reload를 진행할 시 정답 데이터를 제외하고 태깅 단계로 되돌아 갑니다.</div>
                </div>
                <div class="stepper-item-buttons">
<!--                  <v-btn color="color_accept" size="small" @click="stepperNext">-->
<!--                    다음-->
<!--                  </v-btn>-->
                  <v-btn color="color_deny" size="small" @click="dataReloading">
                    data reload
                  </v-btn>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!--  context menu - 프로젝트 리스트 우클릭  -->
    <context-menu
        v-model:show="showProjectListMenu"
        :options="optionsComponent"
    >
      <context-menu-item label="이름 변경" @click="projectContextMenuClick(this.CONTEXTMENU_PROJECT_RENAME)"/>

      <context-menu-item
          label="삭제"
          @click="projectContextMenuClick(this.CONTEXTMENU_PROJECT_DELETE)">

      </context-menu-item>

    </context-menu>
    <!--  dialog - 프로젝트 삭제 확인  -->
    <v-dialog
        v-model="showDeleteProjectDialog"
        width="auto"
    >
      <Dialog
          v-on:dialog-click="projectDeleteDialogClicked"
          :dialog-type="this.DIALOG_TYPE_SUBTITLE"
          title="프로젝트 삭제"
          :subtitle="`'${projectRightClickedName}' 프로젝트를 삭제하시겠습니까?`"
          text-accept="삭제"
          text-deny="취소"
      ></Dialog>
    </v-dialog>
    <!--  dialog - 프로젝트 이름 변경 확인  -->
    <v-dialog
        v-model="showRenameProjectDialog"
        width="auto"
    >
      <Dialog
          v-on:dialog-click="projectRenameDialogClicked"
          :dialog-type="this.DIALOG_TYPE_TEXTFIELD"
          title="프로젝트 이름 변경"
          :subtitle="`'${projectRightClickedName}' 프로젝트를 삭제하시겠습니까?`"
          text-accept="변경"
          text-deny="취소"
      ></Dialog>
    </v-dialog>

    <!--  dialog - 프로젝트 선택 변경 전 저장 여부 물어보기  -->
    <v-dialog
        v-model="showChangeProjectDialog"
        width="auto"
    >
      <Dialog
          v-on:dialog-click="projectChangeDialogClicked"
          :dialog-type="this.DIALOG_TYPE_SUBTITLE"
          title="프로젝트 이동"
          :subtitle="`현재 프로젝트의 변경사항을 저장하고 다른 프로젝트로 이동하시겠습니까?`"
          text-accept="저장 후 이동"
          text-deny="이동 취소"
      ></Dialog>
    </v-dialog>

    <!--  snackbar - 프로젝트 생성 경고  -->
    <v-snackbar
        v-model="snackbarMakeProjectTitleWarn"
    >
      {{ snackbarMakeProjectTitleWarnMsg }}
      <template v-slot:actions>
        <v-btn
            color="pink"
            variant="text"
            @click="snackbarMakeProjectTitleWarn = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import AppBar from './appbar/AppBar';
import Dialog from "@/components/dialog/Dialog";
import {
  createProject,
  getProjectList,
  deleteProject,
  renameProject
} from'@/js/api/project.js'
import {
  addTagInData,
  getDataList
} from '@/js/api/data.js'
import {
  getTagGroupList,
  getTagList
} from "@/js/api/tag";

const generateModels = () => {
  const group = []
  for (let i = 0;i < 3;i++) {
    group.push({value: i, name: `model ${i}`})
  }
  return group;
}

const checkProjectName = (context, title) => {
  const titleRegEx = /^[a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|0-9]+/;
  if (title.length > 20) {
    context.snackbarMakeProjectTitleWarn = true
    context.snackbarMakeProjectTitleWarnMsg = "프로젝트 이름은 20자 이하만 가능합니다."
    return false
  } else if (titleRegEx.test(title)) {
    return true
  } else {
    context.snackbarMakeProjectTitleWarn = true
    context.snackbarMakeProjectTitleWarnMsg = "프로젝트 이름은 영어, 한글, 숫자만 입력 가능합니다."
    return false
  }
}

const loadProject = async (context, id) => {
  await getTagGroupList(context, id)
  if (context.tagGroups.length > 0) {
    console.log(context.tagGroups)
    await getTagList(context, id, context.tagGroups[context.selectedTagGroup].tag_group_id)
  }
  await getDataList(context, id, 0)
}

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export default {
  name: "ProjectComponent",
  data() {
    return {
      items: () => {
        const data = [];
        for (let i = 0;i < 100;i++) {
          data.push({title: `${i}` + ' item', value: i});
        }
        return data;
      },
      lineData: [],
      tagGroups: [],
      modelLists: generateModels(),

      selectedTagGroup: 0,
      selectedModel: 0,
      tags: [],
      stepperIdx: 0,
      stepperMax: 4,
      projectList: [],

      showMakeProjectDialog: false,
      snackbarMakeProjectTitleWarn: false,
      snackbarMakeProjectTitleWarnMsg: "",

      showProjectListMenu: false,
      optionsComponent: {
        zIndex: 3,
        minWidth: 230,
        x: 500,
        y: 200
      },
      projectRightClickedId: 0,
      projectRightClickedName: 'name',
      showDeleteProjectDialog: false,
      showRenameProjectDialog: false,

      selectedProjectId: -1,
      moveProjectId: -1,
      showChangeProjectDialog: false
    }
  },
  components: {
    AppBar,
    Dialog
  },
  created() {
    getProjectList(this);
  },
  methods: {
    checkDataTag(tags) {
      for (let t of tags) {
        if (t.tagGroupId === this.tagGroups[this.selectedTagGroup].tag_group_id) {
          return t
        }
      }
      return undefined
    },
    setChipBackgroundColor(hex) {
      const rgb = hexToRgb(hex)

      const brightness = Math.round(((parseInt(rgb.r) * 299) +
          (parseInt(rgb.g) * 587) +
          (parseInt(rgb.b) * 114)) / 1000);
      return {'color': (brightness > 125) ? 'black' : 'white'};
    },
    chipBackground (color) {
      return {
        'background': color
      }
    },

    getTagClasses(tags) {
      let classes = []
      for (const obj in tags) {
        if (this.selectedTagGroup === Number(obj)) {
          classes.push(`highlight${tags[obj].type}`)
        }
      }
      return classes
    },
    lineOver(event) {
      const target = event.target;
      const tooltipHtml = Number(target.dataset.tooltip);
      const targetTags = this.lineData[tooltipHtml].tags;

      if (targetTags[this.selectedTagGroup] === undefined) return
      let tooltipElem = document.createElement('div');
      tooltipElem.className = 'tooltip';
      tooltipElem.innerHTML = targetTags[this.selectedTagGroup].name;
      let coords = target.getBoundingClientRect();
      let left = coords.left + (target.offsetWidth - tooltipElem.offsetWidth) / 2;
      if (left < 0) left = 0;

      let top = coords.top - tooltipElem.offsetHeight - 5;
      if (top < 0) {
        top = coords.top + target.offsetHeight + 5;
      }

      tooltipElem.style.left = (event.clientX + 5) + 'px';
      tooltipElem.style.top = top + 'px';

      document.body.append(tooltipElem);

      document.onmouseout = function() {
        if (tooltipElem) {
          tooltipElem.remove();
          tooltipElem = null;
        }
      };
    },

    changeGroup(v) {
      // console.log(this.tagGroups[v])
      this.selectedTagGroup = v
      getTagList(this, this.selectedProjectId, this.tagGroups[this.selectedTagGroup].tag_group_id)
    },
    changeModel(v) {
      console.log(v)
      this.selectedModel = v
    },

    stepperNext() {
      if (this.stepperIdx + 1 <= this.stepperMax) this.stepperIdx++;
    },
    stepperPrev() {
      if (this.stepperIdx - 1 >= 0) this.stepperIdx--;
    },
    dataReloading() {
      this.stepperIdx = 0;
    },

    startDrag(event, item) {
      event.dataTransfer.dropEffect = "move"
      event.dataTransfer.effectAllowed = "move"

      let dragElement = document.createElement("div")
      const dragElementText = document.createTextNode(item[1])
      dragElement.appendChild(dragElementText)
      dragElement.className = "dragItem"
      dragElement.style.background = item[2]
      dragElement.style.color = this.setChipBackgroundColor(item[2]).color
      document.body.appendChild(dragElement);
      document.addEventListener("dragend", function() {
        if (dragElement) {
          dragElement.remove();
          dragElement = null;
        }
      }, false);
      // console.log(dragElement)

      event.dataTransfer.setDragImage(dragElement, 0, 0)
      event.dataTransfer.setData("selectedItem", item[0])
    },
    onDrop(event, colNum) {
      const draggedTagId = Number(event.dataTransfer.getData("selectedItem"))
      console.log(this.selectedProjectId, this.tagGroups[this.selectedTagGroup].tag_group_id, draggedTagId, this.lineData[colNum].id, this.lineData[colNum].text, colNum)
      addTagInData(this, this.selectedProjectId, this.tagGroups[this.selectedTagGroup].tag_group_id, draggedTagId, this.lineData[colNum].id, this.lineData[colNum].text, colNum)
    },

    projectCreateDialogClicked(data) {
      if (data.type === this.DIALOG_CLICK_YES) {
        const title = data.projectTitle;
        if (checkProjectName(this, title)) {
          createProject(this, title)
        }
      }
      this.showMakeProjectDialog = false
    },
    projectListRightClick(e, id, name) {
      this.showProjectListMenu = true;
      this.optionsComponent.x = e.x;
      this.optionsComponent.y = e.y;
      this.projectRightClickedId = id
      this.projectRightClickedName = name
      // console.log(id)
    },
    projectContextMenuClick(type) {
      if (type === this.CONTEXTMENU_PROJECT_RENAME) {
        this.showRenameProjectDialog = true
      } else if (type === this.CONTEXTMENU_PROJECT_DELETE) {
        this.showDeleteProjectDialog = true
      }
    },
    projectDeleteDialogClicked(data) {
      if (data.type === this.DIALOG_CLICK_YES) {
        deleteProject(this, this.projectRightClickedId)
      }
      this.showDeleteProjectDialog = false
    },
    projectRenameDialogClicked(data) {
      if (data.type === this.DIALOG_CLICK_YES) {
        const title = data.projectTitle;
        if (checkProjectName(this, title)) {
          renameProject(this, title, this.projectRightClickedId)
        }
      }
      this.showRenameProjectDialog = false
    },
    projectListLeftClick(e, id) {
      // 프로젝트 선택
      if (this.selectedProjectId === -1) {
        this.selectedProjectId = id
        loadProject(this, this.selectedProjectId)
      } else {
        // 이전에 선택한 화면이 있다면 저장 여부 물어보기
        this.moveProjectId = id
        this.showChangeProjectDialog = true
      }
    },
    projectChangeDialogClicked(data) {
      // 프로젝트 이동 시 저장 여부 다이얼로그 버튼 클릭
      if (data.type === this.DIALOG_CLICK_YES) {
        this.selectedProjectId = this.moveProjectId
        loadProject(this, this.selectedProjectId)
      } // move cancel
      this.showChangeProjectDialog = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import "../css/pages/project.scss";
</style>