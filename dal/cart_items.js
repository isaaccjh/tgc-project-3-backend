const { CartItem } = require("../models");

const getCart = async (userId) => {
  const cart = await CartItem.collection()
    .where({
      user_id: userId,
    })
    .fetch({
      require: false,
      withRelated: [
        "variant",
        "variant.lure",
        "variant.colour",
        "variant.property",
        "lure",
        "lure.serie",
      ],
    });
  return cart;
};

const getCartItemByUserAndVariant = async (userId, variantId) => {
  const items = await CartItem.where({
    user_id: userId,
    variant_id: variantId,
  }).fetch({
    require: false,
  });
  return items;
};

const createCartItem = async (userId, variantId, quantity) => {
  let cartItem = new CartItem({
    user_id: userId,
    variant_id: variantId,
    quantity: quantity,
  });
  await cartItem.save();
  return cartItem;
};

const removeFromCart = async (userId, variantId) => {
  let cartItem = await getCartItemByUserAndVariant(userId, variantId);
  if (cartItem) {
    await cartItem.destroy();
    return true;
  }
  return false;
};

const updateQuantity = async (userId, variantId, newQuantity) => {
  let cartItem = await getCartItemByUserAndVariant(userId, variantId);
  if (cartItem) {
    cartItem.set("quantity", newQuantity);
    cartItem.save();
    return true;
  }
  return false;
};

const clearUserCart = async (userId) => {
  let userCart = await getCart(userId);
  // running through the cart to clear all of them
  if (userCart) {
    userCart.forEach(async (item) => {
      console.log("destroying!");
      await item.destroy();
    });
    return true;
  }
  return false;
};

module.exports = {
  getCart,
  getCartItemByUserAndVariant,
  createCartItem,
  removeFromCart,
  updateQuantity,
  clearUserCart,
};
