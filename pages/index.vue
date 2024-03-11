<script setup lang="ts">
import { roi_calculator } from "~/utils";
import type {Resource} from "@youcan/qantra/src/types";
import { Pie } from 'vue-chartjs';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import { ref } from 'vue';
import {isArray} from "@vue/shared";
ChartJS.register(ArcElement);

const orders = ref<number>(50);
const confirmed = ref<number>(40);
const delivered = ref<number>(30);
const product_cost = ref<number>(15);
const product_price = ref<number>(60);
const ship_fee = ref<number>(30);
const confirm_fee = ref<number>(1);
const marketing_fee = ref<number>(1);
const fix_fee = ref<number>(0);
const profit = ref<number>(0);
const show = ref<boolean>(true)

const {data: products} = useFetch<Resource[] | null>('/products');
const {data: recievedOrders} = useFetch<Resource[] | null>('/orders');

const showPicker = ref(false);
const selectedResources = ref<Resource[] | null>([]);
const resources = ref<Resource[] | null>(products?.value?.data ?? null);

ChartJS.register( Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const fees = ref(fix_fee.value + marketing_fee.value + (delivered.value * product_cost.value) + (ship_fee.value * delivered.value) + (confirm_fee.value * confirmed.value))
const estimated_rev = ref ((orders.value * product_price.value) - (orders.value * (marketing_fee.value + product_cost.value + ship_fee.value + confirm_fee.value) + fix_fee.value))
const chartData = ref({
  labels: ['Estimated rev', 'Profit', 'Fee'],
  datasets: [
    {
      label: 'Data',
      backgroundColor: ['rgb(113, 181, 244)', 'rgb(115, 227, 167)', 'rgb(220, 81, 81)'],
      data: [estimated_rev.value, profit.value, fees.value],
    },
  ],
});

watch([orders, product_price, delivered, profit, fees], ([newProfit, newFees]) => {
  chartData.value = {
    labels: ['Estimated rev', 'Profit', 'Fee'],
    datasets: [
      {
        label: 'Data',
        backgroundColor: ['rgb(113, 181, 244)', 'rgb(115, 227, 167)', 'rgb(220, 81, 81)'],
        data: [estimated_rev.value, newProfit, newFees],
      },
    ],
  };
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});

const chartFullfil = ref({
  labels: ['Delivered', 'Delivering', 'Waiting Confirmation'],
  datasets: [
    {
      label: 'Data',
      backgroundColor: ['rgb(115, 227, 167)', 'rgb(205, 213, 223)', 'rgb(247, 197, 115)'],
      data: [delivered.value, orders.value - confirmed.value, orders.value - confirmed.value],
    },
  ],
});


const onConfirm = (resources: Resource[]) => {
  selectedResources.value = resources;
  showPicker.value = false;
};

function handleClose(){
  show.value = !show.value
}

function handleCalculation() {
  profit.value = roi_calculator({
    orders: orders.value,
    confirmed: confirmed.value,
    delivered: delivered.value,
    product_cost: product_cost.value,
    product_price: product_price.value,
    ship_fee: ship_fee.value,
    confirm_fee: confirm_fee.value,
    marketing_fee: marketing_fee.value,
    fix_fee: fix_fee.value,
  });

  return profit;
}

watch(selectedResources, (nv) => {
  console.log("orders",recievedOrders);
  if(!nv || nv.length <= 0 || !isArray(recievedOrders.value)) {
    return;
  }

  let productId = nv[0] ? nv[0].id : null;
  console.log("productId" , productId);
  if(!productId) {
    return;
  }
  const order = recievedOrders.value.find((o : any) => o.product_id === productId);
  console.log("order",order);

  if(order) {
    orders.value = order.orders;
    confirmed.value =  order.confirmed;
    delivered.value =  order.delivered;
    product_cost.value =  order.product_cost;
    product_price.value =  order.product_price;
    ship_fee.value =  order.ship_fee;
    confirm_fee.value =  order.confirm_fee;
    marketing_fee.value =  order.marketing_fee;
    fix_fee.value =  order.fix_fee;
  }
})
</script>

<template>
  <div class="app">
    <div class="intro">
      <div class="logo">
        <img src="~/assets/logo.png" />
      </div>
      <p class="description">Welcome to ROI Compass. The premier ROI simulator designed to elevate your
        financial strategy.</p>
      <Alert v-show="show" type="info" canClose @close="handleClose" class="instructions">
        <template #title>
          Intructions
        </template>
        <template #description>
          <p>This Profit Simulation Calculator allows you to estimate the profit of a product based on input data. You can use it in two ways</p>
          <p class="label">Manual Entry Method</p>
          <p>For manual entry, input values like cost price, selling price, quantity sold, and additional costs, then click "Calculate"</p>
          <p class="label">Product Selection Method</p>
          <p>Choose a product from the dropdown list and complete filling the inputs</p>
          <p class="label">Calculation example</p>
          <p class="title">Let's have a product with the following scenario:</p>
          <p>You have a product that you acquired for $15. Following your marketing efforts, you managed to secure 50 leads (orders) at a cost of $1 per lead. The fulfillment center successfully confirmed 40 orders but only delivered to 30 customers. The fees for confirmation were $1 each, and shipping cost $30 per delivery.</p>
          <p>If you sell this product for $60, your total profit would amount to $360</p>
        </template>
      </Alert>
    </div>
    <div class="form">
      <ResourcePicker
        v-model:visible="showPicker"
        :resources="resources"
        stock-label="in stock"
        :is-loading="false"
        @confirm="onConfirm"
      />
      <PrimaryButton @click="showPicker = true">
        <span>Select a product</span>
      </PrimaryButton>
      <p class="label">Orders</p>
      <div class="line">
        <InputGroup>
          <template #label> Orders number</template>
          <template #input>
            <Input v-model="orders" type="number"/>
          </template>
        </InputGroup>
        <InputGroup>
          <template #label> Confirmed orders </template>
          <template #input>
            <Input v-model="confirmed" type="number"/>
          </template>
        </InputGroup>
        <InputGroup>
          <template #label> Delivered orders </template>
          <template #input>
            <Input v-model="delivered" type="number"/>
          </template>
        </InputGroup>
      </div>
      <p class="label">Product</p>
      <div class="line">
        <InputGroup>
          <template #label> Product cost </template>
          <template #input>
            <Input v-model="product_cost" type="number"/>
          </template>
        </InputGroup>
        <InputGroup>
          <template #label> Product price </template>
          <template #input>
            <Input v-model="product_price" type="number"/>
          </template>
        </InputGroup>
      </div>
      <p class="label">Fees</p>
      <div class="line">
        <InputGroup>
          <template #label> Shiping fee </template>
          <template #input>
            <Input v-model="ship_fee" type="number"/>
          </template>
        </InputGroup>
        <InputGroup>
          <template #label> Confirmation fee </template>
          <template #input>
            <Input v-model="confirm_fee" type="number"/>
          </template>
        </InputGroup>
        <InputGroup>
          <template #label> Marketing fee </template>
          <template #input>
            <Input v-model="marketing_fee" type="number"/>
          </template>
        </InputGroup>
        <InputGroup>
          <template #label> Other fee </template>
          <template #input>
            <Input v-model="fix_fee" type="number"/>
          </template>
        </InputGroup>
      </div>
      <div class="line last">
        <PrimaryButton class="submit" @click="() => handleCalculation()"> Calculate profit </PrimaryButton>
        <div class="result">
          <p>Profit : {{ profit }}</p>
        </div>
      </div>
      <p class="label">Profit chart</p>
      <div class="stats">
        <div class="chart-container">
          <Pie :data="chartFullfil" :options="chartOptions" />
        </div>
        <div class="chart-container">
          <Bar :data="chartData" :options="chartOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
html {
  background-color: var(--gray-50) !important;
  font: var(--text-sm-regular);
}
.app {
  display: flex;
  flex-direction: column;
  background-color: var(--base-white) !important;
  gap: 20px;
  border: 1px solid var(--gray-100);
  border-radius: 8px;
  padding: 30px;
  margin: 10px;
}

.instructions{
  width: unset !important
}

.instructions .title{
  font: var(--text-sm-bold)
}

.label{
font: var(--text-md-bold)

}
.submit{
  height: fit-content;
  align-self: center;
}

.logo img {
  width: 360px;
  height: 50px;
  margin-bottom: 20px;
}

.intro {
  margin: 10px;
}
.description{
  font: var(--text-sm-regular)
}
.result {
  border: 1px solid var(--blue-100);
  width: 200px;
  height: 100px;
  background: var(--blue-50);
  padding: 20px;
  border-radius: 6px;
  height: fit-content;
}

.form {
  align-items: flex-start;
  justify-content: flex-start;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid var(--gray-100);
  border-radius: 8px;
  padding: 30px;
  width: 90%;
}

.line {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.line.last {
  margin-top: 25px;
}

.stats {
  width: 100%;
  height: 400px;
  position: relative;
  display: flex;
  gap:16px
}

.chart-container{
  height: 300px; 
  flex: 1
}
</style>
