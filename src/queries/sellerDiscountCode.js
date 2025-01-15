// export default async function sellerDiscountCode(context, args) {
//     try {
//         console.log("Collections available:", Object.keys(context.collections));
//         let { itemPerPage, PageNumber, searchQuery } = args;
//         const { SellerDiscounts } = context.collections;

//         let filters = {};

//         if (searchQuery) {
//             filters.$or = [
//                 { code: { $regex: new RegExp(searchQuery, "i") } },
//                 { type: { $regex: new RegExp(searchQuery, "i") } },
//                 { description: { $regex: new RegExp(searchQuery, "i") } },
//             ];
//         }

//         let itemsPerPage = itemPerPage ? itemPerPage : 10;
//         PageNumber = PageNumber ? PageNumber : 1;
//         let skipAmount = (PageNumber - 1) * itemsPerPage;

//         // Count total documents that match the filters
//         let totalCount = await SellerDiscounts.countDocuments(filters);
//         console.log(`Total matching Seller Discount: ${totalCount}`);

//         let sellerDiscountResponse = await SellerDiscounts
//             .find(filters)
//             .skip(skipAmount)
//             .limit(itemsPerPage)
//             .toArray();

//         if (sellerDiscountResponse.length > 0) {
//             return {
//                 totalCount,
//                 data: sellerDiscountResponse,
//             };
//         } else {
//             return {
//                 totalCount: 0,
//                 data: [],
//             };
//         }
//     } catch (error) {
//         console.error("Error fetching sellerDicount:", error);
//         throw new Error("Failed to fetch Seller Discount");
//     }
// }


export default async function sellerDiscountCode(context, args) {
    try {

        let { itemPerPage, PageNumber, searchQuery, startDate, endDate, sellerId, minValue, maxValue } = args;
        const { SellerDiscounts } = context.collections;

        let filters = {};

        if (searchQuery) {
            filters.$or = [
                { code: { $regex: new RegExp(searchQuery, "i") } },
                { type: { $regex: new RegExp(searchQuery, "i") } },
                { description: { $regex: new RegExp(searchQuery, "i") } },
            ];
        }

        if (sellerId) {
            filters.sellerId = sellerId;
        }


        if (minValue !== undefined) {
            filters.value = { ...filters.value, $gte: minValue };
        }

        if (maxValue !== undefined) {
            filters.value = { ...filters.value, $lte: maxValue };
        }

        // Adding date range filter
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            filters.createdAt = { $gte: start, $lte: end };
        } else if (startDate) {
            const start = new Date(startDate);
            filters.createdAt = { $gte: start };
        } else if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            filters.createdAt = { $lte: end };
        }

        let itemsPerPage = itemPerPage ? itemPerPage : 10;
        PageNumber = PageNumber ? PageNumber : 1;
        let skipAmount = (PageNumber - 1) * itemsPerPage;

        // Count total documents that match the filters
        let totalCount = await SellerDiscounts.countDocuments(filters);
        console.log(`Total matching Seller Discount: ${totalCount}`);

        let sellerDiscountResponse = await SellerDiscounts
            .find(filters)
            .skip(skipAmount)
            .limit(itemsPerPage)
            .toArray();

        if (sellerDiscountResponse.length > 0) {
            return {
                totalCount,
                data: sellerDiscountResponse,
            };
        } else {
            return {
                totalCount: 0,
                data: [],
            };
        }
    } catch (error) {
        console.error("Error fetching sellerDiscount:", error);
        throw new Error("Failed to fetch Seller Discount");
    }
}
