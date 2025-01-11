/**
 * Calculates reward points based on the price.
 *
 * @param {number|string} price - The price of the product.
 * @returns {number} The calculated reward points.
 */

export const calculateRewardPoints = (price = 0) => {
    price = Math.floor(price);
    let points = 0;
    points += price > 100 ? (price - 100) * 2 : 0;
    points += price > 50 ? (Math.min(price, 100) - 50) * 1 : 0;
    return points;
};

/**
 * Gets the latest purchase date from a list of transactions.
 *
 * @param {Array} transactions - The list of transactions.
 * @returns {Date} The latest purchase date.
 */

const getLatestdate = (transactions)=>{
    return transactions.reduce((latest, transaction) => {
        return new Date(transaction.purchased_date) > new Date(latest.purchased_date) ? transaction : latest;
    }).purchased_date;
}

// /**
//  * Filters transactions by Month and filters transactions within the last three months.
//  *
//  * @param {Array} transactions - The list of transactions.
//  * @returns {Array} The sorted by date and filtered list of transactions.
//  */

const filterAndSortTransactionsByLastThreeMonths = (transactions, lastThreeMonths) => {
    const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.purchased_date);
        const transactionMonth = transactionDate.getMonth() + 1;
        const transactionYear = transactionDate.getFullYear();
        return lastThreeMonths.some(monthData => 
            monthData.month === transactionMonth && monthData.year === transactionYear
        );
    });
    filteredTransactions.sort((a, b) => new Date(b.purchased_date) - new Date(a.purchased_date));
    return filteredTransactions;
}
/**
 * Aggregates reward points from a list of transactions.
 *
 * @param {Array} transactions - The list of transactions.
 * @returns {Object} An object containing transactions with reward points, monthly points, and total points.
 */

export const aggregatePoints = (transactions) => {
    const latestDate = getLatestdate(transactions);
    const lastThreeMonths = getLastThreeMonths(latestDate);
    const transactionsWithRewardpts= transactions.map(transaction => ({
        ...transaction,
       reward_points: calculateRewardPoints(parseFloat(transaction.price))
    }));
    const recentTransactions = filterAndSortTransactionsByLastThreeMonths(transactionsWithRewardpts, lastThreeMonths);
    const { pointsByCustomer } = recentTransactions.reduce((acc, { customer_id, customer_name, purchased_date, reward_points }) => {
    const month = new Date(purchased_date).getMonth() + 1;
    const year = new Date(purchased_date).getFullYear();
    const key = `${customer_id}-${year}-${month}`;
       
        if (!acc.pointsByCustomer[key]) {
            acc.pointsByCustomer[key] = { customer_id: customer_id, name: customer_name, year, month, reward_points: 0 };
        }
        acc.pointsByCustomer[key].reward_points += reward_points;
        return acc;
    }, { pointsByCustomer: {}});
    const filteredPointsByCustomer = Object.fromEntries(
        Object.entries(pointsByCustomer).filter(([key, value]) => value.reward_points !== 0)
    );
   
    const { totalPointsByCustomer } = transactionsWithRewardpts.reduce((acc, { customer_id, customer_name, reward_points }) => {
        if (!acc.totalPointsByCustomer[customer_id]) {
            acc.totalPointsByCustomer[customer_id] = { name: customer_name, reward_points: 0 };
        }
        acc.totalPointsByCustomer[customer_id].reward_points += reward_points;

        return acc;
    }, { totalPointsByCustomer: {} });

    return {
        transactions: transactionsWithRewardpts,
        monthlyPoints: Object.values(filteredPointsByCustomer),
        totalPoints: Object.values(totalPointsByCustomer),
    };
};

/**
 * Get the last three months based on the latest date provided.
 *
 * @param {string|Date} latestDate - The latest date to calculate the last three months from. Can be a date string or a Date object.
 * @returns {Array<Object>} An array of objects, each containing the month and year of the last three months.
 *
 * @example
 * // Example usage:
 * const latestDate = '2025-01-11';
 * const lastThreeMonths = getLastThreeMonths(latestDate);
 * console.log(lastThreeMonths);
 * // Output: [
 * //   { month: 1, year: 2025 },
 * //   { month: 12, year: 2024 },
 * //   { month: 11, year: 2024 }
 * // ]
 */

const getLastThreeMonths = (latestDate) => {
    const currentDate = new Date(latestDate);
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const monthsData = [];
    for (let i = 0; i < 3; i++) {
        let month = currentMonth - i;
        let year = currentYear;
        if (month < 0) {
            month += 12;
            year -= 1;
        }
        monthsData.push({ month: month + 1, year: year });
    }
    return monthsData;
}