import React, { useState, useEffect, useMemo } from 'react';
import { fetchData } from "../Services/FetchData";
import { aggregatePoints } from '../utils/calculateRewardPoints';
import UserMonthlyRewards from "../components/UserMonthlyRewards";
import TotalRewards from "../components/TotalRewards";
import Transactions from "../components/Transactions";
import { monthlyRewardsTab, totalRewardsTab, transactionsTab } from "../config/constants";

/**
 * Driver component fetches transaction data, calculates reward points, and displays them in different tabs.
 * @component
 * @example
 * return <Driver />;
 */

const Driver = () => {
  const [pointsData, setPointsData] = useState({ transactions: [], monthlyPoints: [], totalPoints: [] });
  const [activeTab, setActiveTab] = useState(monthlyRewardsTab);
  const [fetchError, setFetchError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const transactions = await fetchData();
        const aggregatedPoints = aggregatePoints(transactions.Transactions);
        setPointsData(aggregatedPoints);
        setFetchError('');
      } catch (error) {
        setFetchError(new Error('Error Fetching Data'));
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const tabs = useMemo(() => [
    { label: 'Monthly Rewards', value: monthlyRewardsTab, component: UserMonthlyRewards, dataKey: 'monthlyPoints' },
    { label: 'Total Rewards', value: totalRewardsTab, component: TotalRewards, dataKey: 'totalPoints' },
    { label: 'Transactions', value: transactionsTab, component: Transactions, dataKey: 'transactions' },
  ], []);

  return (
    <div>
      <header className="App-header">
        <img src="./assets/logo_image.jpg" className="App-logo" alt="logo" />
        <p>
          <span className="heart">Transaction History and Reward Points</span>
        </p>
      </header>
      <div className="tabs">
        {tabs.map(({ label, value }) => (
          <button
            key={value}
            className={activeTab === value ? 'active' : ''}
            onClick={() => setActiveTab(value)}
          >
            {label}
          </button>
        ))}
      </div>
      {fetchError ? (
        <div>{fetchError}</div>
      ) : (
        loading ? (
          <div>Loading...</div>
        ) :(
        <div className="tab-content">
          {tabs.map(({ value, component: Component, dataKey }) => (
            activeTab === value && pointsData[dataKey] && (
              <Component key={value} {...{ [dataKey]: pointsData[dataKey] }} />
            )
          ))}
        </div>)
      )}
    </div>
  );
};

export default Driver;