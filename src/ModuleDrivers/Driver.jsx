import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fetchData } from "../Services/FetchData";
import { aggregatePoints } from '../utils/calculateRewardPoints';
import UserMonthlyRewards from "../components/UserMonthlyRewards";
import TotalRewards from "../components/TotalRewards";
import Transactions from "../components/Transactions";

/**
 * Driver component fetches transaction data, calculates reward points, and displays them in different tabs.
 * @component
 * @example
 * return <Driver />;
 */

const Driver = () => {
  const [pointsData, setPointsData] = useState({ transactions: [],monthlyPoints: [], totalPoints: [] });
  const [activeTab, setActiveTab] = useState('monthlyRewards');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const getData = async () => {
      try {
        const transactions = await fetchData();
        const aggregatedPoints = aggregatePoints(transactions.Transactions);
        setPointsData(aggregatedPoints);
        setError("");
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setLoading(false);
  };

  return (
    <div>
      <header className="App-header">
        <img src="./assets/logo_image.jpg" className="App-logo" alt="logo" />
        <p>
          <span className="heart">Transaction History and Reward Points</span>
        </p>
      </header>
      <div className="tabs">
        <button className={activeTab === 'monthlyRewards' ? 'active' : ''} onClick={() => handleTabChange('monthlyRewards')}>Monthly Rewards</button>
        <button className={activeTab === 'totalRewards' ? 'active' : ''} onClick={() => handleTabChange('totalRewards')}>Total Rewards</button>
        <button className={activeTab === 'transactions' ? 'active' : ''} onClick={() => handleTabChange('transactions')}>Transactions</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className="tab-content">
          {pointsData.monthlyPoints && activeTab === 'monthlyRewards' && <UserMonthlyRewards monthlyPoints={pointsData.monthlyPoints} />}
          {pointsData.totalPoints && activeTab === 'totalRewards' && <TotalRewards totalPoints={pointsData.totalPoints} />}
          {pointsData.transactions && activeTab === 'transactions' && <Transactions transactions={pointsData.transactions} />}
        </div>
      )}
    </div>
  );
}

Driver.propTypes = {
  pointsData: PropTypes.shape({
    transactions: PropTypes.arrayOf(
      PropTypes.shape({
        transaction_id: PropTypes.string.isRequired,
        customer_name: PropTypes.string.isRequired,
        customer_id: PropTypes.string.isRequired,
        purchased_product: PropTypes.string.isRequired,
        price: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number
        ]).isRequired,
        purchased_date: PropTypes.string.isRequired,
        reward_points: PropTypes.number.isRequired,
      })
    ).isRequired,
    monthlyPoints: PropTypes.arrayOf(PropTypes.object).isRequired,
    totalPoints: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  activeTab: PropTypes.string.isRequired,
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  handleTabChange: PropTypes.func.isRequired,
};

export default Driver;