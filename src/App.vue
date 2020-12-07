<template>
  <div id="app">
    <svg
      class="chart" :width="chartWidth" :height="chartHeight" 
    >
    <transition-group name="country-list" tag="g">
      <chart-bar
        v-for="({country, value, position}) in chartData"
        class="country"
        :key="country"
        :transform="`translate(0, ${position * 60})`"
        :country="country"
        :barHeight="barHeight"
        :chart-width="chartWidth"
        :max-value="maxValue"
        :value="value"
        :animation-duration="animationDuration"
      />
    </transition-group>
    </svg>
    <day-input
      v-model="day"
      :dates="dates"
      :animation-duration="animationDuration"
    />
  </div>
</template>

<script>
import data from "../data/country-cases.json";
import DayInput from "./DayInput.vue";
import ChartBar from "./ChartBar.vue";

export default {
  data: () => ({
    animationDuration: 0.3,
    dates: data.dates,
    day: 0,
    chartWidth: 600,
    chartHeight: 600,
    items: 20, // Will only show this many countries
    barSpacing: 10,
  }),
  components: {
    DayInput,
    ChartBar,
  },
  mounted() {
    this.$nextTick(() => {
      this.chartWidth = this.$el.getBoundingClientRect().width;
    });
  },
  computed: {
    chartData() {
      const chartData = Object.entries(data.countryData)
        .map(([country, dataArray]) => {
          return {
            country,
            value: dataArray[this.day],
          };
        })
        .filter(({ value }) => value);

      const sortedData = chartData.slice().sort((a, b) => b.value - a.value);

      return chartData.map((item) => ({
        position: sortedData.indexOf(item),
        ...item,
      }));
    },
    maxValue() {
      return this.chartData.reduce((max, { value }) => Math.max(value, max), 0);
    },
    barHeight() {
      return this.chartHeight / this.items - this.barSpacing;
    },
  },
  methods: {
    barWidth(value) {
      return (this.chartWidth / this.maxValue) * value;
    },
  },
};
</script>

<style scoped>
.chart {
  width: 100%;
}

.country {
  transition: opacity 0.3s linear, transform 0.3s linear;
}

.country-list-enter,
.country-list-leave-to {
  opacity: 0;
}
</style>