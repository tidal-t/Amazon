import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

export function getDeliveryOption(id) {
  let deliveryOption;
  deliveryOptions.forEach((option) => {
    if (option.id === id) {
      deliveryOption = option;
    }
  });
  return deliveryOption;
}
function isWeekend(date) {
  const dayOfWeek = date.format("dddd");
  return dayOfWeek === "Saturday" || dayOfWeek === "Sunday";
}

export function CalculateDeliveryOptions(deliveryOption) {
  let today = dayjs();
  let deliveryDate1 = today.add(deliveryOption.deliveryDays, "days");
  let dateString = deliveryDate1.format("dddd, MMMM D");
      let remainingDays = deliveryOption.deliveryDays;  //اینجا رو باید بخونم باز
      let deliveryDate = dayjs();

      while (remainingDays > 0) {
        deliveryDate = deliveryDate.add(1, "day");

        if (!isWeekend(deliveryDate)) {
          remainingDays--;
          // This is a shortcut for:
          // remainingDays = remainingDays - 1;
        }
      }
  return dateString;
}
export const deliveryOptions = [
  {
    id: "1",
    deliveryDays: 7,
    priceCent: 0,
  },
  {
    id: "2",
    deliveryDays: 3,
    priceCent: 499,
  },
  {
    id: "3",
    deliveryDays: 1,
    priceCent: 999,
  },
];
