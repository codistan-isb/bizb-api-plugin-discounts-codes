import ReactionError from "@reactioncommerce/reaction-error";
/**
 * @name discounts/codes/discount
 * @method
 * @memberof Discounts/Codes/Methods
 * @summary calculates percentage off discount rates
 * @param {String} cartId cartId
 * @param {String} discountId discountId
 * @param {Object} collections Map of MongoDB collections
 * @returns {Number} returns discount total
 */
export default async function getPercentageOffDiscount(
  cartId,
  discountId,
  collections
) {
  const { Cart, Discounts } = collections;
  const discountMethod = await Discounts.findOne({ _id: discountId });
  if (!discountMethod)
    throw new ReactionError("not-found", "Discount not found");
  // For "discount" type discount, the `discount` string is expected to parse as a float, a percent
  const discountAmount = Number(discountMethod.discount);
  if (isNaN(discountAmount))
    throw new ReactionError(
      "invalid",
      `"${discountMethod.discount}" is not a number`
    );
  const cart = await Cart.findOne({ _id: cartId });
  if (!cart) throw new ReactionError("not-found", "Cart not found");
  function calculateTotal(cartItems) {
    let total = 0;
    for (const item of cartItems) {
      total += item.subtotal.amount;
    }
    return total;
  }
  // Applying discount if total is greater than or equal to minAmount
  function applyDiscountIfApplicable(cartItems, discount) {
    let discountValue = 0;
    const total = calculateTotal(cartItems);
    const minAmount = parseFloat(discountMethod.minAmount); // Parsing minAmount to a number
    if (!isNaN(minAmount) && total >= minAmount) {
      console.log("cartItems", total);
      console.log("Discount applied!");
      // Apply discount here
      // For example, subtract discount amount from total
      discountValue = discountValue + Number(discountMethod?.discount);
      console.log("discount", discountValue);
      return discountValue;
    } else {
      throw new ReactionError(
        "Discount not applicable",
        "Cart amount is less than the minimum amount required for the discount."
      );
    }
  }
  // Applying discount to the cart
  const result =  applyDiscountIfApplicable(cart.items, discountMethod);
  console.log("result", result);
  return result;
}
