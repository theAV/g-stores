import Vue from "vue";
import VueRouter from "vue-router";
// import Login from "../views/Login.vue";

// import Warehouse from "../views/Warehouse/Warehouse.vue";

Vue.use(VueRouter);

const routes = [
  // {
  //   path: "/login",
  //   name: "login",
  //   component: Login,
  // },
  {
    path: "/",
    name: "dashboard",
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ "../views/Dashboard/Dashboard.vue"
      ),
  },
  {
    path: "/inwards",
    component: () =>
      import(/* webpackChunkName: "inwards" */ "../views/Inward/Inward.vue"),
    children: [
      {
        path: "",
        name: "inwardList",
        component: () =>
          import(
            /* webpackChunkName: "inwardsList" */ "../views/Inward/InwardList.vue"
          ),
      },
      {
        path: "/create-inward",
        name: "createInward",
        component: () =>
          import(
            /* webpackChunkName: "createinwards" */ "../views/Inward/CreateInward.vue"
          ),
      },
      {
        path: "/inward-details/:inwardId",
        name: "inwardDetails",
        component: () =>
          import(
            /* webpackChunkName: "inwardsDetails" */ "../views/Inward/InwardDetails.vue"
          ),
      },
    ],
  },
  {
    path: "/outwards",
    component: () =>
      import(/* webpackChunkName: "outwards" */ "../views/Outward/Outward.vue"),
    children: [
      {
        path: "",
        name: "createOutward",
        component: () =>
          import(
            /* webpackChunkName: "createOutward" */ "../views/Outward/CreateOutward.vue"
          ),
      },
    ],
  },
  {
    path: "/commodity",
    component: () =>
      import(
        /* webpackChunkName: "commodity" */ "../views/Commodity/Index.vue"
      ),
    meta: { breadCrumb: "Commodity" },
    children: [
      {
        path: "",
        name: "commodity",
        component: () =>
          import(
            /* webpackChunkName: "commodityItem" */ "../views/Commodity/ItemForm.vue"
          ),
        meta: { breadCrumb: "Customer List" },
      },
    ],
  },
  {
    path: "/customers",
    component: () =>
      import(/* webpackChunkName: "customer" */ "../views/Customer/index"),
    meta: { breadCrumb: "Customer" },
    children: [
      {
        path: "",
        name: "customer",
        component: () =>
          import(
            /* webpackChunkName: "CustomerList" */ "../views/Customer/CustomerList.vue"
          ),
        meta: { breadCrumb: "Customer List" },
      },
      {
        path: "/add-customer",
        name: "add_customer",
        component: () =>
          import(
            /* webpackChunkName: "FormCustomer" */ "../views/Customer/FormCustomer.vue"
          ),
        meta: { breadCrumb: "Add new customer" },
      },
    ],
  },

  {
    path: "/warehouse",
    name: "warehouse",
    // route level code-splitting
    // this generates a separate chunk (warehouse.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "warehouse" */ "../views/Warehouse/Warehouse.vue"
      ),
    meta: { breadCrumb: "Warehouse" },
    children: [
      {
        path: "/overview",
        name: "overview",
        component: () =>
          import(
            /* webpackChunkName: "warehouse-overview" */ "../views/Warehouse/WarehouseOverview.vue"
          ),
        meta: { breadCrumb: "View Warehouse" },
      },
      {
        path: "/add-item",
        name: "addWarehouseItem",
        component: () =>
          import(
            /* webpackChunkName: "warehouse-section-create" */ "../views/Warehouse/WarehouseSectionCreate.vue"
          ),
        meta: { breadCrumb: "View Warehouse" },
      },
    ],
  },
  {
    path: "/reports",
    name: "report",
    component: () =>
      import(
        /* webpackChunkName: "ReportComponent" */ "../views/Reports/Report.vue"
      ),
  },
];

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? "hash" : "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
