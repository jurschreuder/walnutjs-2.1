<template>
  <div class="wrapper">

    <div
      id="sidebar-btn"
      :style="{ left: (10 + 280 * sidebarOut) + 'px' }"
      @click="sidebarOut = !sidebarOut"
      ><i class="ri-menu-line"></i>
    </div>

    <div
      id="sidebar"
      class="flex-shrink-0 p-3"
      :class="{ 'sidebar-hidden': !sidebarOut }"
    >
      <a
        href="/"
        class="d-flex align-items-center pb-3 mb-3 text-decoration-none border-bottom"
      >
        <img src="/public/walnut-icon-512.png" class="img-fluid px-4 py-4" />
      </a>
      <ul class="nav nav-pills flex-column mb-auto">
        <li class="nav-item">
          <router-link to="/home" class="nav-link" active-class="active">
            <i class="ri-magic-line"></i>
            <span class="menu-name">Home new</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/draw" class="nav-link" active-class="active">
            <i class="ri-file-copy-2-line"></i>
            <span class="menu-name">Draw</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">
            <i class="ri-file-copy-2-line"></i>
            <span class="menu-name">About</span>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- content -->
    <div id="right" :class="{ sidebarmargin: sidebarOut }">
      <div class="main-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

/* mobile */
@media screen
 and (max-device-width: 640px)
{
  .sidebarmargin {
      margin-left: 0px !important;
  }

  #sidebar-btn {
    display: block !important;
  }
}

#sidebar-btn {
  display: none;
  text-align: center;
  color: white;
  z-index: 10001;
  position: fixed;
  bottom: 10px;
  background-color: #000;
  width: 48px;
  height: 48px;
  border-radius: 24px;
  font-size: 24px;
  line-height: 44px;
}

.sidebar-hidden{
  left: -280px;
}

#sidebar {
  z-index: 10000;
  height: 100%;
  width: 280px;
  position: fixed;
  padding: 8em;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.035), 0 0 40px 0 rgba(0, 0, 0, 0.07);
  background-color: #fff;
}
.sidebarmargin {
  margin-left: 320px;
}
router-link {
  display: inline-flex;
  align-items: center;
  line-height: 2em;
}
i[class^="ri-"],
span {
  display: inline-block;
  vertical-align: middle;
}
.menu-name {
  padding-left: 0.5em;
}

</style>

<script>

export default {
  name: "LayoutView",
  components: {
  },
  data() {
    return {
      sidebarOut: true,
    };
  },
  watch: {
    '$route' () {
      if(document.body.clientWidth <= 640){
        this.sidebarOut = false;
      }
    }
  },
  mounted() {},
  async created() {
  },
};
</script>
