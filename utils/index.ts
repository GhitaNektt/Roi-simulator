
interface RoiInputs {
      orders: number;
      confirmed: number;
      delivered: number;
      product_cost: number;
      product_price: number;
      ship_fee: number;
      confirm_fee: number;
      marketing_fee: number;
      fix_fee: number;
    }
  
    export function roi_calculator(inputs:RoiInputs): number{
      console.log("object", inputs)
      let profit: number;
      let confirmation_fee: number;
      let shipement_fee: number;
      let product_cost: number;
      let marketing_fee: number;
  
      confirmation_fee = inputs.confirmed * inputs.confirm_fee;
      shipement_fee = inputs.delivered * inputs.ship_fee;
      product_cost = inputs.delivered * inputs.product_cost;
      marketing_fee = (inputs.marketing_fee * inputs.orders) + inputs.fix_fee;
  
  
      profit = (inputs.delivered * inputs.product_price) - (product_cost + shipement_fee + confirmation_fee + marketing_fee)
  console.log(profit)
      return profit;
    }
