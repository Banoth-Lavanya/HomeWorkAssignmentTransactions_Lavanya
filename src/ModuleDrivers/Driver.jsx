import React, { useState, useEffect } from 'react';
import { fetchData } from "../Services/FetchData";
import { aggregatePoints } from '../utils/calculateRewardPoints';
import UserMonthlyRewards from "../components/UserMonthlyRewards";
import TotalRewards from "../components/TotalRewards";
import Transactions from "../components/Transactions";
import { monthlyRewardsTab , totalRewardsTab, transactionsTab } from "../config/constants";

/**
 * Driver component fetches transaction data, calculates reward points, and displays them in different tabs.
 * @component
 * @example
 * return <Driver />;
 */

const Driver = () => {
  const [pointsData, setPointsData] = useState({ transactions: [],monthlyPoints: [], totalPoints: [] });
  const [activeTab, setActiveTab] = useState('monthlyRewards');
  const [Fetcherror, setFetchError] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const getData = async () => {
      try {
        const transactions = await fetchData();
        const aggregatedPoints = aggregatePoints(transactions.Transactions);
        setPointsData(aggregatedPoints);
        setFetchError("");
      } catch (error) {
        setFetchError(new Error("Error Fetching Data"));
        setLoading(true);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const tabs = [
    { label: 'Monthly Rewards', value: monthlyRewardsTab, component: UserMonthlyRewards, dataKey: 'monthlyPoints' },
    { label: 'Total Rewards', value: totalRewardsTab, component: TotalRewards, dataKey: 'totalPoints' },
    { label: 'Transactions', value: transactionsTab, component: Transactions, dataKey: 'transactions' },
  ];

  return (
    <div>
      <header className="App-header">
        <img src="./assets/logo_image.jpg" className="App-logo" alt="logo" />
        <p>
          <span className="heart">Transaction History and Reward Points</span>
        </p>
      </header>
      <div className="tabs">
      {tabs.map((tab) => (
          <button
            key={tab.value}
            className={activeTab === tab.value ? 'active' : ''}
            onClick={() => handleTabChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : Fetcherror ? (
        <div>{Fetcherror.message}</div>
      ) : (
        <div className="tab-content">
           {tabs.map((tab) => {
            const Component = tab.component;
            return activeTab === tab.value && pointsData[tab.dataKey] ? (
              <Component key={tab.value} {...{ [tab.dataKey]: pointsData[tab.dataKey] }} />
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
export default Driver;