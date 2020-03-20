<template>
  <div id="editor">
    <div class="sider" :style="{ flex: collapsed ? '' : '1' }">
      <div class="logo" @click="this.handleHome" v-if="false"></div>

      <a-menu :inlineCollapsed="collapsed" mode="inline">
        <a-menu-item key="new" @click="handleAdd">
          <a-icon type="file-add" />
          <span>新建文档</span>
        </a-menu-item>

        <a-menu-item key="store" @click="handleGetStore" v-if="false">
          <a-icon type="book" />
          <span>已存文档</span>
        </a-menu-item>

        <a-sub-menu key="extensions">
          <span slot="title">
            <a-icon type="appstore" />
            <span>插件选择</span>
          </span>
          <a-menu-item
            v-for="e in extensionList"
            :key="e.key"
            @click="handleExtensionChange(e)"
          >
            <a-icon type="check-circle" v-if="extensionName === e.key" />
            <span>{{e.title}}</span>
          </a-menu-item>
        </a-sub-menu>

        <a-menu-item key="2" @click="handlePreviewShow">
          <a-icon type="read" />
          <span>预览界面</span>
        </a-menu-item>

        <a-menu-item key="3" id="copy" data-clipboard-target="#preview" v-if="previewShow">
          <a-icon type="copy" />
          <span>复制到公众号</span>
        </a-menu-item>
      </a-menu>

      <div class="bottom" @click="collapsed = !collapsed">
        <a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'" />
        <span v-if="!collapsed" style="margin-left: 15px">收起菜单</span>
      </div>
    </div>

    <a-spin style="width: 100%;flex: 6;" :spinning="!inited">
      <div class="edit_container">
        <div class="bar" v-if="false">
          <div class="bar-item bar-item-active">
            <a-icon type="file-markdown" />
            <span style="margin-left: 10px">新建文档</span>
            <div class="bar-item-delete">
              <a-icon type="close-circle" />
            </div>
          </div>

          <div class="bar-item-add">
            <a-icon type="plus-circle" />
          </div>
        </div>
        <div class="edit_area">
          <Code
            width="100%"
            height="100vh"
            :value="codeValue"
            :class="previewShow ? 'code-normal' : 'code-full'"
            @change="handleChange"
            @focus="handleFocus"
          />
          <Preview
            class="preview"
            :value="htmlValue"
            :extensionName="extensionName"
            v-if="previewShow"
          />
        </div>
      </div>
    </a-spin>

    <a-modal title="已存文档列表" :visible="isStoreListShow" :footer="null" @cancel="handleStoreListHide">
      <a-list bordered v-if="storeList.length > 0" style="height: 400px;overflow-y: auto">
        <a-list-item v-for="(store, n) in storeList" :key="`article_${n}`">
          <div>
            <p>文章内容：{{store.title}}</p>
            <p>保存时间：{{new Date(store.time).toLocaleString()}}</p>
          </div>
        </a-list-item>
      </a-list>
      <a-empty description="暂无存档" v-else />
    </a-modal>
  </div>
</template>

<script>
import marked from "marked";
import DOMPurify from 'dompurify';
import Clipboard from "clipboard";
import localforage from "localforage";
import { Menu, Icon, message, Spin, Modal, List, Empty } from "ant-design-vue";
import Code from "../components/Code";
import Preview from "../components/Preview";

import Example from '../assets/example'

export default {
  name: "editor",
  components: {
    Code,
    Preview,
    "a-menu": Menu,
    "a-sub-menu": Menu.SubMenu,
    "a-menu-item": Menu.Item,
    "a-icon": Icon,
    "a-spin": Spin,
    "a-modal": Modal,
    "a-list": List,
    "a-list-item": List.Item,
    "a-empty": Empty
  },
  data() {
    return {
      inited: false,
      collapsed: false,
      codeValue: "",
      htmlValue: "",
      previewShow: false,
      extensionName: "",
      selectedExtension: null,
      isStoreListShow: false,
      storeList: [],
      extensionList: [
        {
          title: "默认",
          key: ""
        },
        {
          title: "微保技术",
          key: "wesureExtension"
        },
        {
          title: "Labmem",
          key: "labmemExtension",
          onlyStyle: true
        },
      ],
    };
  },
  created() {
    const clipboard = new Clipboard("#copy");
    clipboard.on("success", e => {
      message.success("复制成功");
      e.clearSelection();
    });
  },
  mounted() {
    this.handlePageInit();

    this.saveTimer = setInterval(() => {
      this.handleSave();
    }, 30000);
  },
  destroyed() {
    this.saveTimer && clearInterval(this.saveTimer);
  },
  methods: {
    handlePageInit() {
      const { articleID = "" } = this.$route.params;

      if (!articleID || articleID === "newArticle") {
        this.codeValue = Example
        this.htmlValue = marked(Example);
        return (this.inited = true)
      }

      localforage.getItem(articleID).then((res) => {
        if (res) {
          const { value } = res
          this.handleChange({ value });
          message.success("草稿导入成功");
        }
        this.inited = true;
      });
    },

    handleCollapse() {
      this.collapsed = !this.collapsed;
    },

    handleHome() {
      this.$router.push("/");
    },

    handleAdd() {
      this.codeValue = Example
      this.handleChange({ value: Example })
      this.$router.replace("/editor/newArticle");
    },

    handleChange({ value }) {
      this.codeValue = value;
      if (this.selectedExtension) {
        this.htmlValue = DOMPurify.sanitize(marked(
          value,
          { renderer: this.selectedExtension.renderer },
          this.selectedExtension.parseCallback
        ));
      } else {
        this.htmlValue = DOMPurify.sanitize(marked(value));
      }
    },

    handleFocus() {
      if (this.$route.params.articleID === "newArticle") {
        this.$router.replace(`/editor/${btoa(`${Date.now()}_md`)}`);
      }
    },

    handlePreviewShow() {
      this.previewShow = !this.previewShow;
    },

    handleExtensionChange(ex) {
      if (!ex) return;

      const { key = '', onlyStyle = false } = ex
      this.extensionName = key;
      this.selectedExtension = null;

      if (key && !onlyStyle) {
        this.selectedExtension = require(`../extensions/${ex.key}/index`).default;
        this.handleChange({ value: this.codeValue });
      }
    },

    handleSave() {
      if (!this.inited) {
        return;
      }

      const { articleID = "" } = this.$route.params;
      if (!articleID || articleID === "newArticle") {
        return;
      }
      const store = {
        title: this.codeValue.substring(0, 6),
        value: this.codeValue,
        time: Date.now()
      };
      localforage.setItem(articleID, store, () =>
        message.success("已自动保存")
      );
    },

    handleGetStore() {
      const _this = this
      localforage
        .keys()
        .then(function(keys) {
          _this.handleGetData(keys)
          _this.isStoreListShow = true
        })
        .catch(function(err) {
          console.log(err);
        });
    },

    handleGetData(keys) {
      if (!keys || keys.length <= 0) return
      const key = keys[0]
      localforage.getItem(key, (err, value) => {
        this.storeList.push(value)
        keys.splice(0, 1)
        this.handleGetData(keys)
      })
    },

    handleStoreListHide() {
      this.isStoreListShow = false;
    }
  }
};
</script>

<style scoped>
#editor {
  width: 100%;
  display: flex;
}

.edit_container {
  width: 100%;
  height: 100vh;
}

.bar {
  width: 100%;
  height: 30px;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
}

.bar-item {
  padding: 0 40px 0 20px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
  position: relative;
}

.bar-item-delete {
  position: absolute;
  right: 10px;
  top: 0;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bar-item-add {
  position: relative;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-left: 20px;
}

.bar-item-add:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

.bar-item-active {
  background-color: rgba(0, 0, 0, 0.2);
}

.edit_area {
  flex: 6;
  width: 100%;
  height: 100vh;
  /* height: calc(100vh - 30px); */
  display: flex;
  overflow: hidden;
}

.code-full {
  width: 100%;
}

.code-normal {
  width: 60%;
}

.preview {
  width: 40%;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
}

.sider {
  max-width: 200px;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  user-select: none;
}

.sider .bottom {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #eeeeee;
  position: absolute;
  z-index: 5;
  bottom: 0;
  left: 0;
}

.logo {
  width: 100%;
  height: 60px;
  margin-bottom: 16px;
  background-color: aliceblue;
}

.spin {
  width: 100%;
  height: 100vh;
  position: absolute;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>