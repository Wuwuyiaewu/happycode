var vm = new Vue({
  el: "#app",
  data() {
    return {
      ax_data: {
        head: { appKey: "yz352001" },
        data: { login_name: "", password: "", accountType: "" },
      },
      config: {
        method: "post",
        url:
          "https://api.dragonfly8.com/account/appProperties/getAccountProperties",
        headers: {
          "Content-type": "application/json",
          module: "uat-account",
          rpcType: "http",
          method: "/account/appProperties/getAccountProperties",
          httpMethod: "post",
          trace: "h5_" + this.get_current_time(),
          Authorization: "",
        },

        data: {
          head: { appKey: "yz352001" },
          data: { login_name: "", password: "" },
        },
      },
      content: {
        company_id: "",
        login_name: "",
        password: "",
        user_type: -1,
        appKey: "",
        clientIp: "",
      },
      aj_config: {
        method: "get",
        url: "/json/lp251.json",
      },
      fapidata: {},
      gb: null,
      mb: null,
      sadwq: 66,
      RankAccount_1: 50,
      RankAccount_2: null,
      RankAccount_3: null,
      list: [],
      data_pop1: this.radomAccount(),
      data_pop2: this.radomAccount(),
      data_pop3: this.radomAccount(),
      random_profit1: this.getRandom(6000, 7000),
      random_profit2: this.getRandom(6000, 7000),
      random_profit3: this.getRandom(6000, 7000),
      profit_1_o: null,
      profit_1_n: null,
      people_1_o: null,
      people_1_n: null,
      profit_2_o: null,
      profit_2_n: null,
      people_2_o: null,
      people_2_n: null,
      profit_3_o: null,
      profit_3_n: null,
      people_3_o: null,
      people_3_n: null,
      isOpen: false,
      tab_1: "true",
      tab_2: "false",
      tab_3: "false",
    };
  },
  methods: {
    get_current_time() {
      var d = new Date();
      return d.getTime();
    },
    gotourl() {
      let vm = this;
      console.log(vm.config);
      axios(vm.config)
        .then(function (response) {
          vm.config.headers.Authorization = response.headers.authorization;
          vm.config.data = vm.ax_data;
          console.log(response);
          return axios(vm.config);
        })
        .catch(function (error) {
          console.log(error, "第二次錯誤");
        });
    },
    ajax_sample() {
      let vm = this;
      axios(vm.aj_config)
        .then((res) => {
          vm.fapidata = res.data;
          vm.people_1_o = res.data.participants_1 * 1;
          vm.profit_1_o = res.data.profit_1 * 1;
          vm.people_1_n = res.data.participants_1 * 1;
          vm.profit_1_n = res.data.profit_1 * 1;
          vm.people_2_o = res.data.participants_2 * 1;
          vm.profit_2_o = res.data.profit_2 * 1;
          vm.people_2_n = res.data.participants_2 * 1;
          vm.profit_2_n = res.data.profit_2 * 1;
          vm.people_3_o = res.data.participants_3 * 1;
          vm.profit_3_o = res.data.profit_3 * 1;
          vm.people_3_n = res.data.participants_3 * 1;
          vm.profit_3_n = res.data.profit_3 * 1;
          console.log(vm.fapidata);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getRandom(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    radomAccount() {
      let vm = this;
      let newdata = vm.getRandom(100, 999);
      return `68***${newdata}`;
    },
    setAccountMoney() {
      let vm = this;
      vm.list.forEach((element, index, object) => {});
    },
    changeMil() {
      let vm = this;
      let ration = vm.profit_1_o / vm.people_1_o;
      if (vm.profit_1_n < 1050000) {
        vm.people_1_n = vm.people_1_n + vm.getRandom(5, 50);
        vm.profit_1_n = (vm.people_1_n * ration).toFixed(2);
      } else if (1050000 < vm.profit_1_n < 1055000) {
        vm.people_1_n = vm.people_1_n - vm.getRandom(100, 200);
        vm.profit_1_n = (vm.people_1_n * ration).toFixed(2);
      } else if (vm.profit_1_n > 1055001) {
        vm.people_1_n = vm.people_1_n - vm.getRandom(150, 220);
        vm.profit_1_n = (vm.people_1_n * ration).toFixed(2);
      }

      if (vm.profit_2_n < 1050000) {
        vm.people_2_n = vm.people_2_n + vm.getRandom(5, 50);
        vm.profit_2_n = (vm.people_2_n * ration).toFixed(2);
      } else if (1050000 < vm.profit_2_n < 1055000) {
        vm.people_2_n = vm.people_2_n - vm.getRandom(100, 200);
        vm.profit_2_n = (vm.people_2_n * ration).toFixed(2);
      } else if (vm.profit_2_n > 1055001) {
        vm.people_2_n = vm.people_2_n - vm.getRandom(150, 220);
        vm.profit_2_n = (vm.people_2_n * ration).toFixed(2);
      }

      if (vm.profit_3_n < 1050000) {
        vm.people_3_n = vm.people_3_n + vm.getRandom(5, 50);
        vm.profit_3_n = (vm.people_3_n * ration).toFixed(2);
      } else if (1050000 < vm.profit_3_n < 1055000) {
        vm.people_3_n = vm.people_3_n - vm.getRandom(100, 200);
        vm.profit_3_n = (vm.people_3_n * ration).toFixed(2);
      } else if (vm.profit_3_n > 1055001) {
        vm.people_3_n = vm.people_3_n - vm.getRandom(150, 220);
        vm.profit_3_n = (vm.people_3_n * ration).toFixed(2);
      }
    },
    startPop() {
      this.minPop();
    },
    minPop() {
      setInterval(() => {
        if (this.isOpen) {
          $(".shadow").show();
          $(".bombox").show();
          clearInterval(minPop);
        } else {
          clearInterval(minPop);
        }
      }, 10000);
    },
    RankList() {
      let vm = this;
      // 總長度要夠
      if (vm.list.length < 6) {
        // 長度不夠做長度補充與組陣列
        for (let x = 0; x < 6; x++) {
          vm.list.splice(0, 0, { account: vm.radomAccount(), money: 9500 });
        }
      }
      // 開始個別疊加
      vm.list.forEach((element, index, arr) => {
        element.money = element.money + this.getRandom(100, 1000);
      });
      // 判斷個別是否破萬
      vm.list.forEach((element, index, arr) => {
        if (element.money > 10300) {
          arr.splice(index, 1, {
            account: vm.radomAccount(),
            money: 9500 + vm.getRandom(1, 300),
          });
        }
      });
    },
  },
  computed: {
    doll() {
      let vm = this;
      let newSort = vm.list.sort((a, b) => {
        return a.money < b.money ? 1 : -1;
      });
      return newSort;
    },
    data_pop() {
      return this.radomAccount();
    },
    random_profit() {
      return this.getRandom(6000, 7000);
    },
  },
  watch: {},
  mounted() {
    let vm = this;
    let recaptchaScript = document.createElement("script");
    recaptchaScript.setAttribute("src", "./js/ws_index_251.js");
    console.log(recaptchaScript);
    document.head.appendChild(recaptchaScript);

    setInterval(() => {
      this.changeMil();
    }, 500);
    setTimeout(() => {
      this.RankList();
      setInterval(() => {
        this.RankList();
      }, 20000);
    }, 0);
  },
  created() {
    this.ajax_sample();
  },
  destroyed() {},
});
