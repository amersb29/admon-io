import Vue from 'vue';
import Sidebar from "./SideBar.vue";
import SidebarLink from "./SidebarLink";

const SidebarStore = {
  showSidebar: false,
  sidebarLinks: [],
  displaySidebar(value) {
    this.showSidebar = value;
  }
};

Vue.prototype.$sidebar = SidebarStore;
Vue.component("side-bar", Sidebar);
Vue.component("sidebar-link", SidebarLink);
