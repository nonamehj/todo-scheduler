import {
  CATEGORY_BTN,
  SHOW_MODAL,
  CLOSE_MODAL,
  MODAL_COFFEE_SIZE,
  MODAL_QUANTITY,
  MODAL_TOTAL_ITEM,
  ADDITEM_AMOUNT,
  ADDITEM_REMOVE,
  FINAL_ITEMS_ORDER,
  ORDER_LIST_REMOVE,
  ORDER_COMPLETED,
  ORDER_SUCCESS,
  TOTAL_ITEMS_PAYMENT,
} from "./actions";

const calculateItemTotal = (items) => {
  return items.map((item) => {
    let basePrice = item.price;
    if (!item.drinkType) {
      item.amount = 1;
      item.shot = 0;
      item.icecream = 0;
      item.pearls = 0;
      return basePrice * item.amount * 0;
    }

    const tempTypePrice =
      item.category === "커피" && item.drinkType === "hot"
        ? basePrice - 500
        : basePrice;
    const sizePrice =
      item.size === "tall"
        ? 500
        : item.size === "grande"
        ? 1000
        : item.size === "venti"
        ? 1500
        : 0;
    const shotPrice = item.shot * 500;
    const icecreamPrice = item.icecream * 500;
    const pearlsPrice = item.pearls * 500;
    const optionTotal = shotPrice + icecreamPrice + pearlsPrice;
    const itemTotal = (tempTypePrice + sizePrice + optionTotal) * item.amount;

    return itemTotal;
  });
};

const reducer = (state, action) => {
  if (action.type === CATEGORY_BTN) {
    if (action.payload.category === "전체") {
      return { ...state, menus: action.payload.data };
    } else {
      return { ...state, menus: action.payload.tempItem };
    }
  }

  /*modal 열었을대 */
  if (action.type === SHOW_MODAL) {
    let tempItem = state.menus
      .filter((item) => item.id === action.payload.id)
      .map((item) => {
        const { drinkOption, price } = item;
        let defaultDrinkType = "";
        let defaultDrinkPrice = 0;
        if (drinkOption.length === 1) {
          defaultDrinkType = drinkOption[0];
          defaultDrinkPrice = price;
        }

        return {
          ...item,
          amount: 1,
          shot: 0,
          icecream: 0,
          pearls: 0,
          size: "short",
          orderId: 0,
          itemTotal: defaultDrinkPrice,
          drinkType: defaultDrinkType,
        };
      });
    return { ...state, modalItem: tempItem, isModalOpen: true };
  }
  /*modal 닫기 */
  if (action.type === CLOSE_MODAL) {
    return { ...state, isModalOpen: false, modalItem: [] };
  }
  // hot & iced drinkType선택
  if (action.type === "MODAL_COFFEE_DRINKTYPE") {
    let tempItem = state.modalItem.map((item) => {
      const updateItem = { ...item, drinkType: action.payload };
      const [itemTotal] = calculateItemTotal([updateItem]);
      return { ...updateItem, itemTotal };
    });
    return { ...state, modalItem: tempItem };
  }
  /*modal 커피 사이즈 추가 */
  if (action.type === MODAL_COFFEE_SIZE) {
    let tempItem = state.modalItem.map((item) => {
      const updateItem = { ...item, size: action.payload };
      const [itemTotal] = calculateItemTotal([updateItem]);
      return { ...updateItem, itemTotal };
    });

    return { ...state, modalItem: tempItem };
  }
  if (action.type === MODAL_QUANTITY) {
    let tempItem = state.modalItem.map((item) => {
      const { addType, type } = action.payload;
      const increment = type === "inc" ? 1 : -1;
      const newValue = item[addType] + increment;
      const minValue = addType === "amount" ? 1 : 0;
      const tempValue =
        type === "inc" ? newValue : Math.max(newValue, minValue);
      const updateItem = { ...item, [addType]: tempValue };
      const [itemTotal] = calculateItemTotal([updateItem]);
      return { ...updateItem, itemTotal };
    });
    return { ...state, modalItem: tempItem };
  }

  if (action.type === "MODAL_ACTION_BUTTON") {
    if (action.payload.type === "cancel") {
      return { ...state, modalItem: [], isModalOpen: false };
    } else {
      let tempItem = state.modalItem.map((item) => {
        return {
          ...item,
          orderId: action.payload.tempId,
          itemTotal: item.itemTotal,
        };
      });
      return {
        ...state,
        modalItem: [],
        isModalOpen: false,
        selectedItems: [...state.selectedItems, ...tempItem],
        isAddItemOpen: true,
        orderId: action.payload.tempId,
      };
    }
  }
  if (action.type === "SELECTED_AMOUNT") {
    const { type, id } = action.payload;
    let tempItem = state.selectedItems.map((item) => {
      if (item.orderId === id) {
        const increment = type === "inc" ? 1 : -1;
        const newValue = item.amount + increment;
        const minValue = 1;
        const tempValue =
          type === "inc" ? newValue : Math.max(newValue, minValue);
        const updatedItem = { ...item, amount: tempValue };
        const [itemTotal] = calculateItemTotal([updatedItem]);
        return { ...updatedItem, itemTotal };
      }
      return item;
    });
    return { ...state, selectedItems: tempItem };
  }
  if (action.type === "SELECTED_REMOVE") {
    let tempItem = state.selectedItems
      .filter((item) => item.orderId !== action.payload)
      .map((item) => {
        if (item.orderId >= action.payload) {
          return { ...item, orderId: item.orderId - 1 };
        }
        return { ...item };
      });
    const isEmpty = tempItem.length === 0;
    return {
      ...state,
      selectedItems: tempItem,
      orderId: state.orderId - 1,
      isAddItemOpen: !isEmpty,
    };
  }
  if (action.type === "SELECTED_ALL_CLEAR") {
    let tempId = state.orderId - state.selectedItems.length;
    return {
      ...state,
      orderId: tempId,
      selectedItems: [],
      isAddItemOpen: false,
      total: 0,
    };
  }
  if (action.type === "SELECTED_ORDER_ITEMS") {
    return { ...state, isSelectedOrderOpen: true };
  }
  /*선택된 주문내역  */
  if (action.type === "SELECTED_BACK") {
    return { ...state, isSelectedOrderOpen: false };
  }
  /*마지막 주문내역 확인 */
  if (action.type === "ORDER_COMPLETED") {
    return {
      ...state,
      isOrderCompleted: true,
      isSelectedOrderOpen: false,
      itemsList: [...state.itemsList, ...state.selectedItems],
      selectedItems: [],
      total: 0,
    };
  }
  /*마지막 주문내역 확인체크 */
  if (action.type === "FINAL_COMPLETED_ORDER") {
    return {
      ...state,
      isOrderCompleted: false,
      isAddItemOpen: false,
    };
  }
  if (action.type === "SHOW_ORDER_DETAILS") {
    return { ...state, isOrderDetails: true };
  }
  if (action.type === "CLOSE_ORDER_DETAILS") {
    return { ...state, isOrderDetails: false };
  }
  if (action.type === "TOTAL_ITEMS_PAYMENT") {
    // let total = state.selectedItems.reduce(
    //   (prev, cur) => prev + (cur.itemTotal || 0),
    //   0
    // );
    let total = state.selectedItems.reduce((prev, cur) => {
      prev += cur.itemTotal;
      return prev;
    }, 0);
    return { ...state, total };
  }
  if (action.type === "TOTAL_ORDER_DETAILS_PAYMENT") {
    let totalAmount = state.itemsList.reduce(
      (prev, cur) => (prev += cur.itemTotal),
      0
    );
    return { ...state, totalAmount };
  }
  return state;
};

export default reducer;
