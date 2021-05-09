import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/Destination/:slug",
    name: "DestinationDetails",
    component: () =>
      import(
        /* webpackChunkName: "DestinationDetails" */
        "../views/DestinationDetail"
      ),
    props: true,
    children: [
      {
        path: ":experienceSlug",
        name: "experienceDetails",
        props: true,
        component: () =>
          import(
            /* webpackChunkName: "ExperienceDetails" */
            "../views/ExperienceDetails"
          ),
      },
    ],
  },
  {
    path: "*",
    name: "NotFound",
    component: () =>
      import(/*webpackChunkName:"NotFound"*/ "../views/NotFound"),
  },
];

const router = new VueRouter({
  mode: "history",
  linkExactActiveClass: "router-act",
  routes,
});

export default router;
