<template>
  <v-app id="layout-root">
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
                @click.left="projectListLeftClick($event, item.project_id, item.project_name)"
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
      <div v-if="selectedProjectId !== -1" id="layout-project-editor">
        <!--   문장/태그 편집 영역   -->
        <div id="layout-project-text-area">
          <div id="layout-project-editor-top">
            <div id="editor-top-title">{{ this.selectedProjectName }}</div>
<!--            <v-btn color="light_magenta" height="30">-->
<!--              저장-->
<!--            </v-btn>-->
            <v-btn
                color="light_brown"
                height="30"
                :loading="isFileSelecting"
                @click="handleFileImport"
            >
              텍스트 로드
            </v-btn>
            <input
                :value="fileData"
                ref="uploader"
                class="d-none"
                type="file"
                accept="text/csv"
                @change="onFileChanged"
            >
          </div>
          <div id="layout-project-editor-main">
            <div id="layout-project-editor-main-title">
<!--              <div id="editor-main-title">-선택된 태그구성-</div>-->
              <div class="select-container">
                <button class="btn-select" @click="selectBoxClick">document</button>
                <ul class="list-member" @click="selectBoxChange">
                  <li
                      v-for="i in 10"
                      :key="i"
                  >
                    <button type="button">doc {{i}}</button>
                  </li>
                </ul>
              </div>
            </div>
            <div
                id="editor-main-lines"
                class="list-vuetify-light"
            >
              <div
                  id="editor-main-data-search"
                  v-show="dataFind"
              >
                <v-text-field
                    v-model="searchValue"
                    label="검색"
                    variant="outlined"
                    hide-details="true"
                    density="compact"
                    append-inner-icon="mdi-close-circle"
                    @click:appendInner="searchClose"
                    @update:modelValue="search"
                ></v-text-field>
              </div>
              <div v-if="tagMod === 'sentence'">
                <p
                    v-for="(l, idx) in lineData"
                    :key="l"
                    class="text-line"
                    :data-tooltip="idx"
                    @dragenter.prevent
                    @dragover.prevent
                    @drop.prevent="onDrop($event, idx)"
                >
                  <span v-if="l.search" class="text-word">{{ l.text }}</span>
                  <v-chip
                      v-if="l.search && checkDataTag(l.data_tags) !== undefined"
                      size="small"
                      :style="[chipBackground(`#${checkDataTag(l.data_tags).tagColor}`),
                      setChipBackgroundColor(`#${checkDataTag(l.data_tags).tagColor}`)]"
                      @click="onDataTagClicked($event, checkDataTag(l.data_tags), idx)"
                  >
                    {{ checkDataTag(l.data_tags).tagName }}
                  </v-chip>
                </p>
              </div>
              <div v-else-if="tagMod === 'word'" id="editor-words">
                <div
                    v-for="(l, idx) in lineData"
                    :key="l"
                >
                  <p
                      class="text-line"
                      v-html="setWordHighlight(l, wordTagData)"
                  ></p>
                  <p
                      class="text-line-selection"
                      :data-tooltip="idx"
                      @mouseup="onWordSelection"
                  >
                    {{ l.text }}
                  </p>
                </div>
              </div>
              <div v-else-if="tagMod === 'paragraph'" id="editor-paragraphs">
                <div
                    v-for="(l, idx) in lineData"
                    :key="l"
                >
                  <p
                      class="text-line"
                      :data-tooltip="idx"
                      :style="[setParagraphBackground(l)]"
                  > {{l.text}} </p>
                </div>
              </div>
            </div>
          </div>
          <v-pagination
              v-model="dataPage"
              :length="dataTotalPage"
              rounded="circle"
              @update:modelValue="onPageChange"
              id="layout-project-editor-pagination"
          ></v-pagination>
        </div>
        <!--   태그 선택 및 학습 영역   -->
        <div id="layout-project-tag-area">

          <div class="stepper-item" :class="stepperIdx === 0 ? 'selected' : ''">
            <div class="stepper-item-top">
              <div class="stepper-item-top-circle" :class="stepperIdx === 0 ? 'selected' : ''">
                <div class="stepper-item-top-circle-num">1</div>
              </div>
              <div class="stepper-item-top-circle-title" :class="stepperIdx === 0 ? 'stepper-item-top-circle-title-selected' : ''">
                태깅 - {{ tagGroups.length > 0 ? tagGroups[selectedTagGroupId].tag_group_name : '' }}
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
                        v-model="tagGroupSelectionModel"
                    >
                      <template v-slot:selection="{ item }">
                        <div v-if="tagGroups.length > 0">{{ item.title }}</div>
                      </template>
                      <template v-slot:item="{ props }">
                          <v-list-item v-bind="props">
                            <template v-slot:append>
                              <v-btn
                                  color="grey-lighten-1"
                                  icon="mdi-delete"
                                  variant="text"
                                  size="small"
                                  @click="deleteTagGroup($event, props)"
                                  @click.stop
                              ></v-btn>
                            </template>
                          </v-list-item>
                      </template>
                    </v-select>
                  </v-container>
                  <v-container class="pa-0 ma-0">
                    <v-btn color="light_magenta" id="tags-group-add-btn" @click="addTagButtonClicked">
                      그룹 추가
                    </v-btn>
                  </v-container>
                </div>
                <div id="layout-project-tag-selection-area">
                  <v-container id="tag-selection-top">
                    <v-btn-toggle
                        density="compact"
                        id="tag-mod-group"
                        v-model="tagMod"
                        color="deep-purple-accent-3"
                        variant="outlined"
                        @update:modelValue="changeTagMod"
                        mandatory
                    >
                      <v-btn value="paragraph" width="85">
                        문단
                      </v-btn>
                      <v-btn value="sentence" width="85">
                        문장
                      </v-btn>
                      <v-btn value="word" width="85">
                        단어
                      </v-btn>
                    </v-btn-toggle>
                  </v-container>
                  <div id="tag-chips">
                    <div
                        id="tag-selection-container"
                    >
                      <v-chip-group
                          class="pa-3 list-vuetify-light"
                          @update:modelValue="changeTagSelection"
                          mandatory
                      >
                        <v-chip
                            v-for="(tag, idx) in tags"
                            :key="tag"
                            :prepend-icon="selectedTag === idx && this.tagMod !== 'sentence' ? 'mdi-check' : ''"
                            :draggable="tagMod === 'sentence'"
                            @dragstart="startDrag($event, [idx, tag.tag_name, `#${tag.tag_color}`])"
                            @click.right="tagChipRightClick($event, tag)"
                            @contextmenu.prevent
                            :style="[chipBackground(`#${tag.tag_color}`),
                          setChipBackgroundColor(`#${tag.tag_color}`)]"
                        >
                          {{ tag.tag_name }}
                        </v-chip>
                      </v-chip-group>
                    </div>
                    <v-btn
                        color="light_brown"
                        id="tag-top-add-btn"
                        @click="showAddTagDialog = true"
                        :disabled="this.tagGroups.length === 0"
                    >
                      태그추가
                    </v-btn>
                  </div>
                </div>

                <div class="stepper-item-buttons">
                  <v-btn color="color_accept" size="small" @click="startTrain">
                    파라미터 설정
                  </v-btn>
<!--                  <v-btn color="color_deny" size="small" @click="stepperPrev">-->
<!--                    이전-->
<!--                  </v-btn>-->
                </div>
              </div>
            </div>
          </div>

<!--          <div class="stepper-item" :class="stepperIdx === 1 ? 'selected' : ''">-->
<!--            <div class="stepper-item-top">-->
<!--              <div class="stepper-item-top-circle" :class="stepperIdx === 1 ? 'selected' : ''">-->
<!--                <div class="stepper-item-top-circle-num">2</div>-->
<!--              </div>-->
<!--              <div class="stepper-item-top-circle-title" :class="stepperIdx === 1 ? 'stepper-item-top-circle-title-selected' : ''">-->
<!--                모델 - {{ modelLists[selectedModel].name }}-->
<!--              </div>-->
<!--            </div>-->

<!--            <div class="stepper-item-content">-->
<!--              <v-divider class="stepper-item-divider" vertical></v-divider>-->
<!--              <div class="stepper-item-content-area" :class="stepperIdx !== 1 ? 'unselected' : ''">-->
<!--                <div id="layout-project-model-area">-->
<!--                  <div class="model-summary">Active Learning을 진행할 모델을 선택해주세요.</div>-->
<!--                  <v-container class="pa-0 ma-0">-->
<!--                    <v-select-->
<!--                        label="모델 목록"-->
<!--                        density="comfortable"-->
<!--                        :items="modelLists"-->
<!--                        item-title="name"-->
<!--                        item-value="value"-->
<!--                        :hide-details="true"-->
<!--                        @update:model-value="changeModel"-->
<!--                    ></v-select>-->
<!--                  </v-container>-->
<!--                </div>-->
<!--                <div class="stepper-item-buttons">-->
<!--                  <v-btn color="color_accept" size="small" @click="stepperNext">-->
<!--                    학습-->
<!--                  </v-btn>-->
<!--                  <v-btn color="color_deny" size="small" @click="stepperPrev">-->
<!--                    태깅 다시하기-->
<!--                  </v-btn>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->

          <div class="stepper-item" :class="stepperIdx === 1 ? 'selected' : ''">
            <div class="stepper-item-top">
              <div class="stepper-item-top-circle" :class="stepperIdx === 1 ? 'selected' : ''">
                <div class="stepper-item-top-circle-num">2</div>
              </div>
              <div class="stepper-item-top-circle-title" :class="stepperIdx === 1 ? 'stepper-item-top-circle-title-selected' : ''">
                Set Parameters
              </div>
            </div>

            <div class="stepper-item-content">
              <v-divider class="stepper-item-divider" vertical></v-divider>
              <div class="stepper-item-content-area" :class="stepperIdx !== 1 ? 'unselected' : ''">
                <v-container class="parameter-set-items">
                  <v-text-field
                      v-model="trainName"
                      label="학습이름"
                      variant="outlined"
                      density="compact"
                      :hide-details="true"
                  ></v-text-field>
                </v-container>
                <v-container class="parameter-set-items">
                  <v-select
                      label="학습할 태그 그룹"
                      :items="tagGroups"
                      item-title="tag_group_name"
                      item-value="value"
                      :hide-details="true"
                      @update:model-value="changeGroup"
                      v-model="tagGroupSelectionModel"
                      variant="outlined"
                      density="compact"
                  ></v-select>
                </v-container>
                <v-container class="parameter-set-items">
                  <v-slider
                      :max="1"
                      :min="0.01"
                      :step="0.001"
                      thumb-label
                  >
                  </v-slider>
                </v-container>
                <div class="stepper-item-buttons">
                  <v-btn color="color_accept" size="small" @click="checkTrainStart">
                    학습시작
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
                <div class="stepper-item-top-circle-num">4</div>
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
                <div class="stepper-item-top-circle-num">3</div>
              </div>
              <div class="stepper-item-top-circle-title" :class="stepperIdx === 3 ? 'stepper-item-top-circle-title-selected' : ''">
                Data Reload
              </div>
            </div>

            <div class="stepper-item-content stepper-item-content-last">
<!--              <v-divider vertical></v-divider>-->
              <div class="stepper-item-content-area" :class="stepperIdx !== 3 ? 'unselected' : ''">

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
      <div v-else>프로젝트를 선택하거나 생성해 주세요.</div>
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
          :field-text-init="projectRightClickedName"
          text-field-label="프로젝트 이름"
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
          :subtitle="`다른 프로젝트로 이동하시겠습니까?`"
          text-accept="이동"
          text-deny="취소"
      ></Dialog>
    </v-dialog>

    <!--  dialog - 태그 그룹 추가하기  -->
    <v-dialog
        v-model="showAddTagGroupDialog"
        width="auto"
    >
      <Dialog
          v-on:dialog-click="addTagButtonDialogClicked"
          :dialog-type="this.DIALOG_TYPE_TEXTFIELD"
          text-field-label="태그 그룹 이름"
          title="태그 그룹 추가"
          text-accept="추가"
          text-deny="취소"
      ></Dialog>
    </v-dialog>
    <!--  dialog - 태그 그룹 삭제 확인  -->
    <v-dialog
        v-model="showDeleteTagGroupDialog"
        width="auto"
    >
      <Dialog
          v-on:dialog-click="deleteTagGroupDialogClicked"
          :dialog-type="this.DIALOG_TYPE_SUBTITLE"
          title="태그 그룹 삭제"
          :subtitle="`'${selectedDeleteTagGroup.title}' 태그 그룹을 삭제하시겠습니까?`"
          text-accept="삭제"
          text-deny="취소"
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

    <!--  dialog - 태그 생성 다이얼로그  -->
    <v-dialog
        v-model="showAddTagDialog"
        width="auto"
    >
      <Dialog
          v-on:dialog-click="addTagDialogClicked"
          :dialog-type="this.DIALOG_TYPE_TEXTFIELD"
          title="태그 추가"
          text-field-label="태그 이름"
          text-accept="추가"
          text-deny="취소"
      ></Dialog>
    </v-dialog>
    <!--  context menu - 태그 칩 컨택스트 매뉴  -->
    <context-menu
        v-model:show="showTagMenu"
        :options="tagMenuOptionsComponent"
    >
      <context-menu-item
          label="이름 변경"
          @click="tagContextMenuClick(this.CONTEXTMENU_TAG_RENAME)"/>
      <context-menu-item
          label="색상 변경"
          @click="tagContextMenuClick(this.CONTEXTMENU_TAG_COLOR)"/>
      <context-menu-item
          label="삭제"
          @click="tagContextMenuClick(this.CONTEXTMENU_TAG_DELETE)">
      </context-menu-item>
    </context-menu>
    <!--  dialog - 태그 삭제 확인  -->
    <v-dialog
        v-model="showDeleteTagDialog"
        width="auto"
    >
      <Dialog
          v-on:dialog-click="deleteTagDialogClicked"
          :dialog-type="this.DIALOG_TYPE_SUBTITLE"
          title="태그 삭제"
          :subtitle="`'${tagRightCLickItem.tag_name}' 태그를 삭제하시겠습니까?`"
          text-accept="삭제"
          text-deny="취소"
      ></Dialog>
    </v-dialog>
    <!--  dialog - 태그 이름 변경 확인  -->
    <v-dialog
        v-model="showRenameTagDialog"
        width="auto"
    >
      <Dialog
          v-on:dialog-click="renameTagDialogClicked"
          :dialog-type="this.DIALOG_TYPE_TEXTFIELD"
          title="태그 이름 변경"
          :field-text-init="this.tagRightCLickItem.tag_name"
          text-field-label="태그 이름"
          text-accept="변경"
          text-deny="취소"
      ></Dialog>
    </v-dialog>
    <!--  dialog - 태그 색싱 변경 확인  -->
    <v-dialog
        v-model="showReColorTagDialog"
        width="auto"
    >
      <Dialog
          v-on:dialog-click="recolorTagDialogClicked"
          :dialog-type="this.DIALOG_TYPE_COLORPICKER"
          title="태그 색상 변경"
          :color-init="'#' + this.tagRightCLickItem.tag_color"
          text-accept="변경"
          text-deny="취소"
      ></Dialog>
    </v-dialog>

    <!--  dialog 로딩중 화면  -->
    <v-dialog
        v-model="showLoadingDialog"
        width="auto"
        :close-on-back="false"
        :persistent="true"
    >
      <Dialog
          :dialog-type="this.DIALOG_TYPE_PROGRESS_LINEAR_INFINITY"
          :title="this.loadingDialogTitle"
          :subtitle="this.loadingDialogSubTitle"
      >
      </Dialog>
    </v-dialog>

    <!--  dialog 컬럼이름  -->
    <v-dialog
        v-model="showColumnNameDialog"
        width="auto"
        :close-on-back="false"
        :persistent="true"
    >
      <Dialog
          v-on:dialog-click="dataFieldClicked"
          :dialog-type="this.DIALOG_TYPE_TEXTFIELD"
          title="텍스트 데이터 필드명"
          text-field-label="텍스트 데이터 필드명"
      >
      </Dialog>
    </v-dialog>

    <!--  dialog 학습 시작 확인  -->
    <v-dialog
        v-model="showTrainStart"
        width="auto"
    >
      <Dialog
          v-on:dialog-click="startTrainCheck"
          :dialog-type="this.DIALOG_TYPE_SUBTITLE"
          title="학습 시작"
          :subtitle="`'${tagGroups[selectedTagGroupId].tag_group_name}' 태그 그룹을 '${trainName}'으로 학습을 시작하시겠습니까?`"
          text-accept="시작"
          text-deny="취소"
      ></Dialog>
    </v-dialog>
  </v-app>
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
  addTagInData, deleteTagInData,
  getDataList, getParagraphDataList, getWordDataList, postData
} from '@/js/api/data.js'
import {
  getTagList,
  addTagGroup,
  deleteTagGroup, deleteTag, changeTagInform, addTag
} from "@/js/api/tag";
import {initVariables, loadProject} from "@/js/api/common";

const generateModels = () => {
  const group = []
  for (let i = 0;i < 3;i++) {
    group.push({value: i, name: `model ${i}`})
  }
  return group;
}

const checkProjectName = (context, title) => {
  const titleRegEx = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9| ]+$/;
  if (title.length > 20) {
    context.snackbarMakeProjectTitleWarn = false
    context.snackbarMakeProjectTitleWarnMsg = "프로젝트 이름은 20자 이하만 가능합니다."
    context.snackbarMakeProjectTitleWarn = true
    return false
  } else if (titleRegEx.test(title)) {
    return true
  } else {
    context.snackbarMakeProjectTitleWarn = false
    context.snackbarMakeProjectTitleWarnMsg = "프로젝트 이름은 영어, 한글, 숫자만 입력 가능합니다."
    context.snackbarMakeProjectTitleWarn = true
    return false
  }
}

const checkTagGroupName = (context, title) => {
  const titleRegEx = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9| ]+$/;
  if (title.length > 20) {
    context.snackbarMakeProjectTitleWarn = false
    context.snackbarMakeProjectTitleWarnMsg = "태그 (그룹) 이름은 20자 이하만 가능합니다."
    context.snackbarMakeProjectTitleWarn = true
    return false
  } else if (titleRegEx.test(title)) {
    return true
  } else {
    context.snackbarMakeProjectTitleWarn = false
    context.snackbarMakeProjectTitleWarnMsg = "태그 (그룹) 이름은 영어, 한글, 숫자만 입력 가능합니다."
    context.snackbarMakeProjectTitleWarn = true
    return false
  }
}

const checkTrainName = (context, title) => {
  const titleRegEx = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9| ]+$/;
  if (title.length > 20) {
    context.snackbarMakeProjectTitleWarn = false
    context.snackbarMakeProjectTitleWarnMsg = "학습 이름은 20자 이하만 가능합니다."
    context.snackbarMakeProjectTitleWarn = true
    return false
  } else if (titleRegEx.test(title)) {
    return true
  } else {
    context.snackbarMakeProjectTitleWarn = false
    context.snackbarMakeProjectTitleWarnMsg = "학습 이름은 영어, 한글, 숫자만 입력 가능합니다."
    context.snackbarMakeProjectTitleWarn = true
    return false
  }
}

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

const setTextColorToBackground = (hex) => {
  const rgb = hexToRgb(hex)
  const brightness = Math.round(((parseInt(rgb.r) * 299) +
      (parseInt(rgb.g) * 587) +
      (parseInt(rgb.b) * 114)) / 1000)
  return (brightness > 125) ? 'black' : 'white'
}


const setTextStroke = (hex) => {
  const color = setTextColorToBackground(hex)
  if (color === 'black') return 'none'
  return `-1px 0px ${color}, 0px 1px ${color}, 1px 0px ${color}, 0px -1px ${color}`
}

export default {
  name: "ProjectComponent",
  data() {
    return {
      showLoadingDialog: false,
      loadingDialogTitle: "",
      loadingDialogSubTitle: "",

      lineData: [],
      tagGroups: [],
      modelLists: generateModels(),

      selectedTagGroupId: 0,
      tagGroupSelectionModel: 0,
      selectedModel: 0,
      tags: [],
      stepperIdx: 0,
      stepperMax: 3,
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
      selectedProjectName: '프로젝트를 선택해 주세요.',
      moveProjectName: '프로젝트를 선택해 주세요.',
      showChangeProjectDialog: false,

      showAddTagGroupDialog: false,

      showDeleteTagGroupDialog: false,
      selectedDeleteTagGroup: {},

      showTagMenu: false,
      tagMenuOptionsComponent: {
        zIndex: 3,
        minWidth: 230,
        x: 500,
        y: 200
      },
      tagRightCLickItem: {},
      showDeleteTagDialog: false,
      showRenameTagDialog: false,
      showReColorTagDialog: false,
      showAddTagDialog: false,

      isFileSelecting: false,

      showColumnNameDialog: false,

      fileData: undefined,
      selectedFile: undefined,

      dataPage: 0,
      dataTotalPage: 0,

      dataFind: false,
      searchValue: '',

      tagMod: 'sentence',
      selectedTag: 0,

      wordTagData: [],
      paragraphData: [],

      showTrainStart: false,
      trainName: ''
    }
  },
  components: {
    AppBar,
    Dialog
  },
  created() {
    getProjectList(this);
    window.onkeydown = (e) => {
      if ((e.keyCode === 70 && (e.ctrlKey || e.metaKey ))) {
        e.preventDefault();
        if (this.lineData.length > 0) {
          this.dataFind = !this.dataFind
          if (!this.dataFind) this.searchClose()
        } else {
          console.log("undefind")
        }
      }
    }
  },
  methods: {
    checkDataTag(tags) {
      for (let t of tags) {
        if (t.tagGroupId === this.tagGroups[this.selectedTagGroupId].tag_group_id) {
          return t
        }
      }
      return undefined
    },
    setChipBackgroundColor(hex) {
      return {'color': setTextColorToBackground(hex)};
    },
    chipBackground (color) {
      return {
        'background': color
      }
    },
    setParagraphBackground(nowData) {
      let color = null;
      if (this.paragraphData.paragraph_indexes === undefined || this.paragraphData.paragraph_indexes.length === 0) return {}
      // console.log(this.paragraphData.paragraph_indexes)
      for (let d of this.paragraphData.paragraph_indexes) {
        // if (d.end_index < nowData.id) continue
        // if (d.start_index > nowData.id) break
        if (d.start_index <= nowData.id && nowData.id <= d.end_index) {
          let nowTagInfo = null
          for (let t of d.data_target_tags) {
            if (t.tagGroupId === this.tagGroups[this.selectedTagGroupId].tag_group_id) {
              nowTagInfo = t
              break
            }
          }
          if (nowTagInfo === null) return
          color = `#${nowTagInfo.tagColor}`
          break
        }
      }
      if (color === null) return {}
      return {'background': color, 'color': setTextColorToBackground(color)}
    },

    async changeGroup(v) {
      // console.log(this.tagGroups[v])
      this.selectedTagGroupId = v
      console.log(this.tagGroupSelectionModel)
      await getTagList(this,
          this.selectedProjectId,
          this.tagGroups[this.selectedTagGroupId].tag_group_id)
    },
    changeModel(v) {
      console.log(v)
      this.selectedModel = v
    },
    deleteTagGroup(e, item) {
      console.log(e, item)
      this.selectedDeleteTagGroup.value = item.value
      this.selectedDeleteTagGroup.title = item.title
      this.showDeleteTagGroupDialog = true
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
      if (this.tagMod !== "sentence") return
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
    async onDrop(event, colNum) {
      const draggedTagValue = Number(event.dataTransfer.getData("selectedItem"))
      console.log(event.dataTransfer.getData("selectedItem"))
      let targetTag = this.tags[draggedTagValue]
      await addTagInData(this,
          this.selectedProjectId,
          targetTag,
          colNum)
    },
    async projectCreateDialogClicked(data) {
      this.showMakeProjectDialog = false
      if (data.type === this.DIALOG_CLICK_YES) {
        const title = data.projectTitle;
        if (checkProjectName(this, title)) {
          await createProject(this, title)
        }
      }
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
    async projectDeleteDialogClicked(data) {
      this.showDeleteProjectDialog = false
      if (data.type === this.DIALOG_CLICK_YES) {
        await deleteProject(this, this.projectRightClickedId)
        initVariables(this)
      }
    },
    async projectRenameDialogClicked(data) {
      this.showRenameProjectDialog = false
      if (data.type === this.DIALOG_CLICK_YES) {
        const title = data.projectTitle;
        if (checkProjectName(this, title)) {
          await renameProject(this, title, this.projectRightClickedId)
        }
      }
    },
    projectListLeftClick(e, id, name) {
      // 프로젝트 선택
      if (this.selectedProjectId === -1) {
        this.selectedProjectId = id
        this.selectedProjectName = name
        loadProject(this, this.selectedProjectId, 0)
      } else {
        // 이전에 선택한 화면이 있다면 저장 여부 물어보기
        this.moveProjectId = id
        this.moveProjectName = name
        this.showChangeProjectDialog = true
      }
    },
    projectChangeDialogClicked(data) {
      this.showChangeProjectDialog = false
      // 프로젝트 이동 시 저장 여부 다이얼로그 버튼 클릭
      if (data.type === this.DIALOG_CLICK_YES) {
        this.selectedProjectId = this.moveProjectId
        this.selectedProjectName = this.moveProjectName
        loadProject(this, this.selectedProjectId, 0)
      } // move cancel
    },

    addTagButtonClicked() {
      this.showAddTagGroupDialog = true
    },
    async addTagButtonDialogClicked(data) {
      this.showAddTagGroupDialog = false
      // 프로젝트 이동 시 저장 여부 다이얼로그 버튼 클릭
      if (data.type === this.DIALOG_CLICK_YES) {
        const title = data.projectTitle;
        if (checkTagGroupName(this, title)) {
          await addTagGroup(this, this.selectedProjectId, title)
        }
      } // move cancel
    },
    async deleteTagGroupDialogClicked(data) {
      this.showDeleteTagGroupDialog = false
      // 프로젝트 이동 시 저장 여부 다이얼로그 버튼 클릭
      if (data.type === this.DIALOG_CLICK_YES) {
        await deleteTagGroup(this,
            this.selectedProjectId,
            this.tagGroups[this.selectedDeleteTagGroup.value].tag_group_id)
      } // move cancel
    },

    tagChipRightClick(e, item) {
      this.showTagMenu = true;
      this.tagMenuOptionsComponent.x = e.x;
      this.tagMenuOptionsComponent.y = e.y;
      this.tagRightCLickItem = item
      console.log(item)
    },
    tagContextMenuClick(type) {
      if (type === this.CONTEXTMENU_TAG_RENAME) {
        this.showRenameTagDialog = true
      } else if (type === this.CONTEXTMENU_TAG_DELETE) {
        this.showDeleteTagDialog = true
      } else if (type === this.CONTEXTMENU_TAG_COLOR) {
        this.showReColorTagDialog = true
      }
    },
    async deleteTagDialogClicked(data) {
      this.showDeleteTagDialog = false
      if (data.type === this.DIALOG_CLICK_YES) {
        await deleteTag(this,
            this.selectedProjectId,
            this.tagRightCLickItem.tag_group_id,
            this.tagRightCLickItem.tag_id)
      }
    },
    async renameTagDialogClicked(data) {
      this.showRenameTagDialog = false
      if (data.type === this.DIALOG_CLICK_YES) {
        const tagName = data.projectTitle;
        if (checkTagGroupName(this, tagName)) {
          await changeTagInform(this,
              this.selectedProjectId,
              this.tagRightCLickItem.tag_group_id,
              this.tagRightCLickItem.tag_id,
              tagName,
              this.tagRightCLickItem.tag_color)
        }
      }
    },
    async recolorTagDialogClicked(data) {
      this.showReColorTagDialog = false
      if (data.type === this.DIALOG_CLICK_YES) {
        const tagColor = data.color;
        console.log(tagColor.slice(1), tagColor)
        await changeTagInform(this,
            this.selectedProjectId,
            this.tagRightCLickItem.tag_group_id,
            this.tagRightCLickItem.tag_id,
            this.tagRightCLickItem.tag_name,
            tagColor.slice(1))
      }
    },
    async addTagDialogClicked(data) {
      this.showAddTagDialog = false
      if (data.type === this.DIALOG_CLICK_YES) {
        const tagName = data.projectTitle;
        if (checkTagGroupName(this, tagName)) {
          let randomColor = Math.floor(Math.random() * 16777215).toString(16);
          await addTag(this,
              this.selectedProjectId,
              this.tagGroups[this.selectedTagGroupId].tag_group_id,
              tagName,
              randomColor)
        }
      }
    },

    async onDataTagClicked(e, tag, dataIdx) {
      console.log(e, tag, dataIdx)
      await deleteTagInData(this,
          this.selectedProjectId,
          tag,
          dataIdx)
    },

    handleFileImport() {
      this.isFileSelecting = true;
      window.addEventListener('focus', () => {
        this.isFileSelecting = false
      }, { once: true });
      this.$refs.uploader.click();
    },
    onFileChanged(e) {
      console.log(e)
      this.selectedFile =  e.target.files[0]
      this.showColumnNameDialog = true
    },
    async dataFieldClicked(data) {
      this.showColumnNameDialog = false
      this.fileData = undefined
      if (data.type === this.DIALOG_CLICK_YES) {
        const colName = data.projectTitle;
        console.log(colName)
        await postData(this,
            this.selectedProjectId,
            this.selectedFile,
            colName)
      }
    },

    async onPageChange(page) {
      await getDataList(this, this.selectedProjectId, page - 1)
    },

    searchClose() {
      this.dataFind = false
      this.searchValue = ''
      this.search()
    },
    search() {
      console.log(this.searchValue)
      for (let d of this.lineData) {
        if (d.text.includes(this.searchValue)) {
          d.search = true
        } else {
          d.search = false
        }
      }
    },

    selectBoxClick(e) {
      e.target.classList.add("on");
    },
    selectBoxChange(e) {
      let btn = document.getElementsByClassName("btn-select")[0]
      if (e.target.nodeName === "BUTTON") {
        btn.innerText = e.target.innerText;
        btn.classList.remove('on');
      }
    },

    async changeTagMod(d) {
      this.selectedTag = 0
      switch (d) {
        case 'word': {
          this.wordTagData = {}
          if (this.lineData.length > 0) {
            let startIdx = this.lineData[this.lineData.length - 1].id
            let endIdx = this.lineData[0].id
            await getWordDataList(this, this.selectedProjectId, startIdx, endIdx)
          }
          break
        }
        case 'sentence': {
          this.lineData = []
          await getDataList(this, this.selectedProjectId, this.dataPage - 1)
          break
        }
        case 'paragraph': {
          this.paragraphData = []
          let startIdx = this.lineData[this.lineData.length - 1].id
          let endIdx = this.lineData[0].id
          await getParagraphDataList(this, this.selectedProjectId, startIdx, endIdx)
          break
        }
      }
    },
    changeTagSelection(d) {
      this.selectedTag = d
      console.log(d)
    },

    setWordHighlight(word, wordTag) {
      const sentenceIdx = word.id
      const targetInfo = wordTag[sentenceIdx]
      if (targetInfo === undefined) return word.text
      targetInfo.sort((a, b) => {
        return a.start_index - b.start_index
      })

      let lastEndIdx = 0
      let result = ""
      for (let tag of targetInfo) {
        let nowTagInfo = null
        for (let t of tag.data_target_tags) {
          if (t.tagGroupId === this.tagGroups[this.selectedTagGroupId].tag_group_id) {
            nowTagInfo = t
            break
          }
        }
        if (nowTagInfo === null) {
          result += word.text.slice(lastEndIdx, tag.end_index + 1)
        } else {
          result += word.text.slice(lastEndIdx, tag.start_index)
          result += `<span style="background-color: #${nowTagInfo.tagColor}; text-shadow: ${setTextStroke(nowTagInfo.tagColor)}">`
              + word.text.slice(tag.start_index, tag.end_index + 1) + '</span>'
        }
        lastEndIdx = tag.end_index + 1
      }
      if (lastEndIdx !== word.text.length) result += word.text.slice(lastEndIdx, word.text.length)

      return result
    },
    onWordSelection() {
      const selection = window.getSelection()
      console.log(selection)
      console.log(selection.anchorOffset, selection.anchorOffset + selection.toString().length)
      console.log(selection.toString())
    },

    startTrainCheck() {

    },
    startTrain() {
      this.stepperNext()
    },
    checkTrainStart() {
      if (checkTrainName(this, this.trainName)) {
        this.showTrainStart = true
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../css/pages/project.scss";
</style>