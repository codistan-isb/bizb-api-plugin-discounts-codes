
export default async function sellerDiscountCode(parent, args, context, info) {
    if (!context.queries.sellerDiscountCode) {
        throw new Error("GetAllCategories function is not defined in queries.");
    }
    let getDiscount = await context.queries.sellerDiscountCode(context, args);
    return getDiscount;
}
