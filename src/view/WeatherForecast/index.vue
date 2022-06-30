<template>
  <mu-container>
    <mu-paper :z-depth="1">
      <mu-data-table :columns="columns" :sort.sync="sort" :data="list">
        <template slot-scope="scope">
          <td>{{ scope.row.title }}</td>
          <td>{{ `[${scope.row.longitude},${scope.row.latitude}]` }}</td>
          <td>{{ scope.row.effective }}</td>
          <td>
            <center>
              <img
                :src="
                  `http://data.cma.cn/dataGis/static/ultra/img/gis/disasterWarning/${scope.row.type}.png`
                "
                alt=""
              />
            </center>
          </td>
        </template>
      </mu-data-table>
    </mu-paper>
  </mu-container>
</template>
<script>
export default {
  data() {
    return {
      sort: {
        name: "",
        order: "asc",
      },
      columns: [
        {
          title: "Title",
          name: "title",
          width: 300,
          align: "center",
          sortable: false,
        },
        {
          title: "Location",
          name: "location",
          width: 200,
          align: "center",
          sortable: false,
        },
        {
          title: "Time",
          name: "time",
          width: 200,
          align: "center",
          sortable: "false",
        },
        {
          title: "Badge",
          name: "badge",
          align: "center",
          sortable: "false",
        },
      ],
      list: [
        // {
        //   id: "31023041600000_20220630162420",
        //   headline: "崇明区气象局发布暴雨黄色预警[Ⅲ级/较重]",
        //   effective: "2022/06/30 16:21",
        //   description:
        //     "崇明区气象局2022年06月30日16时21分发布暴雨黄色预警[Ⅲ级/较重]：受较强的降水云团影响，预计今天上半夜以前本区新海镇、港西镇等中西部乡镇6小时累积降水量将达80毫米以上，本区暴雨蓝色预警信号更新为暴雨黄色预警信号。",
        //   longitude: 121.3914,
        //   latitude: 31.6282,
        //   type: "11B03_YELLOW",
        //   title: "上海市崇明县发布暴雨黄色预警",
        // },
      ],
    };
  },
  async mounted() {
    this.list = await this.getWeatherData();
  },
  methods: {
    async getWeatherData() {
      const url = "https://weather.cma.cn/api/map/alarm?adcode=31";
      let result = await new Promise((resolve, reject) => {
        fetch(url)
          .then((res) => res.json())
          .then((result) => {
            if (result.code === 0) {
              resolve(result.data);
            }
          })
          .catch((e) => {
            console.error(e);
            reject;
          });
      });
      return result;
    },
  },
};
</script>
