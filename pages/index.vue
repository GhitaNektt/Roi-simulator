<script setup lang="ts">


const orders = ref('');
const confirmed = ref('');
const delivered = ref('');
const product_cost = ref('');
const product_price = ref('');
const ship_fee = ref('');
const confirm_fee = ref('');
const marketing_fee = ref('');
const fix_fee = ref('');

const MOCK_RESOURCES: any[] = [
  {
    id: 1,
    thumbnailUrl: '',
    name: 'Apple MacBook Pro',
    price: '$2,499.00',
    stock: 7,
    isChecked: false,
    variants: [
      {
        id: 33,
        thumbnailUrl: '',
        name: 'Apple MacBook Pro 16 M3 Max',
        price: '$3,499.00',
        stock: 3,
        isChecked: false,
      },
      {
        id: 21,
        thumbnailUrl: '',
        name: 'Apple MacBook Pro 14 M3 Pro',
        price: '$2,499.00',
        stock: 4,
        isChecked: false,
      },
    ],
  },
  {
    id: 2,
    thumbnailUrl: '',
    name: 'Apple iMac',
    price: '$1,499.00',
    stock: 2,
    isChecked: false,
  },
];
const showPicker = ref(false);
const selectedResources = ref<any[]>([]);
const resources = ref<any[]>(MOCK_RESOURCES);

const onConfirm = (resources: any[]) => {
  selectedResources.value = resources;
  showPicker.value = false;
};

</script>

<template>
  <div class="app">
    <div class="intro">
    <div class="logo">
    <img src="~/assets/logo.png" />
    <h2>ROI Compass</h2>
    </div>
    <h4>Welcome to ROI Compass – the premier ROI simulator designed to elevate your financial strategy.</h4>
    </div>
  <div class="product-simulation-form">
    <ResourcePicker
      v-model:visible="showPicker"
      :resources="resources"
      stock-label="in stock"
      :is-loading="false"
      @confirm="onConfirm"
    />
    <PrimaryButton @click="showPicker = true;">
      <span>Select a product</span>
    </PrimaryButton>
    <div class="line">
      <InputGroup>
      <template #label>
        Orders
      </template>
      <template #input>
        <Input v-model="orders" />
      </template>
    </InputGroup>
    <InputGroup>
      <template #label>
        Confirmed orders
      </template>
      <template #input>
        <Input v-model="confirmed"/>
      </template>
    </InputGroup>
    <InputGroup>
      <template #label>
        Delivered orders
      </template>
      <template #input>
        <Input v-model="delivered"/>
      </template>
    </InputGroup>
    <InputGroup>
      <template #label>
        Product cost
      </template>
      <template #input>
        <Input v-model="product_cost"/>
      </template>
    </InputGroup>
    </div>
    
    <div class="line">
      
    <InputGroup>
      <template #label>
        Product price
      </template>
      <template #input>
        <Input v-model="product_price"/>
      </template>
    </InputGroup>
    <InputGroup>
      <template #label>
        Shiping fee
      </template>
      <template #input>
        <Input v-model="ship_fee"/>
      </template>
    </InputGroup>
    <InputGroup>
      <template #label>
        Confirmation fee
      </template>
      <template #input>
        <Input v-model="confirm_fee"/>
      </template>
    </InputGroup>
    <InputGroup>
      <template #label>
        Marketing fee
      </template>
      <template #input>
        <Input v-model="marketing_fee"/>
      </template>
    </InputGroup>
    <InputGroup>
      <template #label>
        Other fee
      </template>
      <template #input>
        <Input v-model="fix_fee"/>
      </template>
    </InputGroup>
    <div class="result">
      <p>PROFIT : </p>
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
.app{
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.logo{
  display: flex;
  gap: 10px;
  color: var(--green-400);
}
.logo img{
width: 40px;
height: 40px;
}

.intro{
  margin: 10px;
}

.result{
  border: 1px solid var(--blue-100);
  width: 200px;
  height: 100px;
  background: var(--blue-50);
  padding: 20px;
  border-radius: 6px;
}

.product-simulation-form{
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

.line{
  display: flex;
  flex-direction: row;
  gap: 20px;
}
</style>