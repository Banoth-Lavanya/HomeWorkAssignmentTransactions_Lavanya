import React, { useState, useMemo } from 'react';
import '../App.css';
import { Sort } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { ITEMS_PER_PAGE, SORT_CONFIG, CURRENT_PAGE } from '../config/constants';
import { sortData, filterData, paginateData } from '../utils/SortFilterPagination';

/**
 * UserMonthlyRewards displays a list of users, their reward points based on the Price of last 3 months Transactions.
 *
 * @component
 * @example
 * const monthlyPoints = [
 *   {
 *     customer_name: "Lavanya",
 *     reward_points: 100
 *   },
 *   // more monthlyPoints
 * ];
 * return <UserMonthlyRewards monthlyPoints={monthlyPoints} />;
 */

const UserMonthlyRewards = ({ monthlyPoints }) => {
  const [sortConfig, setSortConfig] = useState(SORT_CONFIG);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(CURRENT_PAGE);
  const [itemsPerPage] = useState(ITEMS_PER_PAGE);
  const sortedMonthlyPoints = useMemo(() => sortData(monthlyPoints, sortConfig), [monthlyPoints, sortConfig]);
  const filteredMonthlyPoints = useMemo(() => filterData(sortedMonthlyPoints, filter), [sortedMonthlyPoints, filter]);
  const { currentItems, totalPages } = useMemo(() => paginateData(filteredMonthlyPoints, currentPage, itemsPerPage), [filteredMonthlyPoints, currentPage, itemsPerPage]);

  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  }

  const getMonthName = (monthNumber) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];
    return monthNames[monthNumber - 1];
  }

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  }

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  }

  return (
    <div className='DataTable'>
      <input
        type="text"
        placeholder="Filter"
        value={filter}
        className='FilterData'
        onChange={e => setFilter(e.target.value)}
      />
      <table className='equal-width-table centerAlign'>
        <thead>
          <tr>
            <th><div className='thead-display'><span>Customer ID</span><span onClick={() => requestSort('customer_id')}><Sort/></span></div></th>
            <th><div className='thead-display'><span>Customer Name</span><span onClick={() => requestSort('name')}><Sort/></span></div></th>
            <th><div className='thead-display'>Year<span onClick={() => requestSort('year')}><Sort/></span></div></th>
            <th><div className='thead-display'>Month<span onClick={() => requestSort('month')}><Sort/></span></div></th>
            <th className='rightAlign'><div className='thead-display'>Reward Points<span onClick={() => requestSort('reward_points')}><Sort/></span></div></th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={item.customer_id}>
              <td>{item.customer_id}</td>
              <td>{item.name}</td>
              <td>{item.year}</td>
              <td>{getMonthName(item.month)}</td>
              <td className='rightAlign'>{item.reward_points}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <div className='inner-pagination'>
          <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
};

UserMonthlyRewards.propTypes = {
  monthlyPoints: PropTypes.arrayOf(
    PropTypes.shape({
      customer_id: PropTypes.string.isRequired,
      customer_name: PropTypes.string.isRequired,
      year: PropTypes.number.isRequired,
      month: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]).isRequired,
      reward_points: PropTypes.number.isRequired,
    })
  ).isRequired,
};

UserMonthlyRewards.defaultProps = {
  monthlyPoints: [{ customer_id: "Unknown", customer_name: "Unknown", year: 0, month: 0, reward_points: 0 }],
};

export default UserMonthlyRewards;