export const calculateRewardPoints = (price) => {
    price = Math.floor(price ?? 0);
    let points = 0;
    points += price > 100 ? (price - 100) * 2 : 0;
    points += price > 50 ? (Math.min(price, 100) - 50) * 1 : 0;
    return points;
};

const getLatestDate = (transactions) => {
    return transactions.reduce((latest, transaction) => {
        const curreDate = new Date(transaction.purchased_date);
        return curreDate > latest ? curreDate : latest;
    }, new Date(transactions[0].purchased_date));
};

export const sortByDate = (transactions) => {
    const latestDate = getLatestDate(transactions);
    const currentDate = new Date(latestDate.toISOString().split('T')[0]);
    const threeMonthsAgo = new Date(latestDate.toISOString().split('T')[0]);
    threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

    const filteredTransactions = transactions.filter(transaction => new Date(transaction.purchased_date) >= threeMonthsAgo);
    const sortedTransactions = filteredTransactions.sort((a, b) => new Date(b.purchased_date) - new Date(a.purchased_date));
    return sortedTransactions;
};

export const aggregatePoints = (transactions) => {
    const transactionsWithRewardpts= transactions.map(transaction => ({
        ...transaction,
       reward_points: calculateRewardPoints(parseFloat(transaction.price))
    }));
    const recentTransactions = sortByDate(transactionsWithRewardpts);
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