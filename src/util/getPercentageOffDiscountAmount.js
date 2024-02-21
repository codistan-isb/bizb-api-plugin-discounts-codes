export default async function getPercentageOffDiscountAmount(
  cartId,
  discountId,
  collections
) {
  const { Cart, Discounts } = collections;
  let discount = 0;
  console.log("getpercentageoffdiscountamount");
  const discountMethod = await Discounts.findOne({ _id: discountId });
  if (!discountMethod)
    throw new ReactionError("not-found", "Discount not found");
  // Validate and get the fixed amount discount
  const discountAmount = Number(discountMethod.discount);
  if (isNaN(discountAmount))
    throw new ReactionError(
      "invalid",
      `"${discountMethod.amount}" is not a number`
    );
  const cart = await Cart.findOne({ _id: cartId });
  if (!cart) throw new ReactionError("not-found", "Cart not found");
  // Subtract fixed amount discount from the subtotal of cart value
  discount = discount + Number(discountMethod?.discount);
  console.log("discount 2", discount);
  return discount;
}