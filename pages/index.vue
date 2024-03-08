<script setup lang="ts">
import { roi_calculator } from "~/utils";
import type {Resource} from "@youcan/qantra/src/types";
import {isArray} from "@vue/shared";

const orders = ref<number>(100);
const confirmed = ref<number>(50);
const delivered = ref<number>(25);
const product_cost = ref<number>(10);
const product_price = ref<number>(50);
const ship_fee = ref<number>(5);
const confirm_fee = ref<number>(2);
const marketing_fee = ref<number>(5);
const fix_fee = ref<number>(0);

const {data: products} = useFetch<Resource[] | null>('/products');
const {data: recievedOrders} = useFetch<Resource[] | null>('/orders');

const showPicker = ref(false);
const selectedResources = ref<Resource[] | null>([]);
const resources = ref<Resource[] | null>(products?.value?.data ?? null);

const onConfirm = (resources: Resource[]) => {
  selectedResources.value = resources;
  showPicker.value = false;
};

function handleCalculation() {
  console.log("in the function");
  let profit = roi_calculator({
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
  console.log("this is the profit ", profit);
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
        <h2>ROI Compass</h2>
      </div>
      <h4>
        Welcome to ROI Compass – the premier ROI simulator designed to elevate your
        financial strategy.
      </h4>
    </div>
    <div class="product-simulation-form">
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
      <div class="line">
        <InputGroup>
          <template #label> Orders </template>
          <template #input>
            <Input v-model="orders" />
          </template>
        </InputGroup>
        <InputGroup>
          <template #label> Confirmed orders </template>
          <template #input>
            <Input v-model="confirmed" />
          </template>
        </InputGroup>
        <InputGroup>
          <template #label> Delivered orders </template>
          <template #input>
            <Input v-model="delivered" />
          </template>
        </InputGroup>
        <InputGroup>
          <template #label> Product cost </template>
          <template #input>
            <Input v-model="product_cost" />
          </template>
        </InputGroup>
      </div>

      <div class="line">
        <InputGroup>
          <template #label> Product price </template>
          <template #input>
            <Input v-model="product_price" />
          </template>
        </InputGroup>
        <InputGroup>
          <template #label> Shiping fee </template>
          <template #input>
            <Input v-model="ship_fee" />
          </template>
        </InputGroup>
        <InputGroup>
          <template #label> Confirmation fee </template>
          <template #input>
            <Input v-model="confirm_fee" />
          </template>
        </InputGroup>
        <InputGroup>
          <template #label> Marketing fee </template>
          <template #input>
            <Input v-model="marketing_fee" />
          </template>
        </InputGroup>
        <InputGroup>
          <template #label> Other fee </template>
          <template #input>
            <Input v-model="fix_fee" />
          </template>
        </InputGroup>
        <PrimaryButton @click="() => handleCalculation()"> Primary Button </PrimaryButton>
        <div class="result">
          <p>PROFIT :</p>
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
  gap: 20px;
}

.logo {
  display: flex;
  gap: 10px;
  color: var(--green-400);
}
.logo img {
  width: 40px;
  height: 40px;
}

.intro {
  margin: 10px;
}

.result {
  border: 1px solid var(--blue-100);
  width: 200px;
  height: 100px;
  background: var(--blue-50);
  padding: 20px;
  border-radius: 6px;
}

.product-simulation-form {
  align-items: flex-start;
  justify-content: flex-start;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid var(--gray-100);
  border-radius: 8px;
  padding: 30px;
  background-color: var(--base-white) !important;
  width: 80%;
  align-self: center;
}

.line {
  display: flex;
  flex-direction: row;
  gap: 20px;
}
</style>
