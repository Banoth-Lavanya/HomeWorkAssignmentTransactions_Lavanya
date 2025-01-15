import React, { useState, useMemo } from 'react';
import '../App.css';
import { Sort } from '@mui/icons-material';
import PropTypes from "prop-types";
import { ITEMS_PER_PAGE, SORT_CONFIG, CURRENT_PAGE } from '../config/constants';
import { sortData, filterData, paginateData } from '../utils/SortFilterPagination';


/**
 * totalPoints displays a list of users and their reward points based on the Price.
 *
 * @component
 * @example
 * const totalPoints = [
 *   {
 *     customer_name: "Lavanya",
 *     reward_points: 100
 *   },
 *   // more Total rewards
 * ];
 * return <TotalsRewards totalPoints={totalPoints} />;
 */

const TotalRewards = ({ totalPoints }) => {
  const [sortConfig, setSortConfig] = useState(SORT_CONFIG);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(CURRENT_PAGE);
  const [itemsPerPage] = useState(ITEMS_PER_PAGE);

  const sortedTotalPoints = useMemo(() => sortData(totalPoints, sortConfig), [totalPoints, sortConfig]);
  const filteredTotalPoints = useMemo(() => filterData(sortedTotalPoints, filter), [sortedTotalPoints, filter]);
  const { currentItems, totalPages } = useMemo(() => paginateData(filteredTotalPoints, currentPage, itemsPerPage), [filteredTotalPoints, currentPage, itemsPerPage]);

  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };
  return (
    <div className='DataTable totalRewardsTable'>
      <div className="filterInput">
          <input
          type="text"
          placeholder="Filter"
          value={filter}
          className='FilterData'
          onChange={e => setFilter(e.target.value)}
        />
        </div>
      <table className='equal-width-table centerAlign'>
        <thead>
          <tr>
          <th><div className='thead-display'>Customer Name<span onClick={() => requestSort('name')}><Sort/></span></div></th>
          <th className='rightAlign'><div className='thead-display'>Reward Points<span onClick={() => requestSort('reward_points')}><Sort/></span></div></th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
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

TotalRewards.propTypes = {
  totalPoints: PropTypes.arrayOf(
    PropTypes.shape({
      customer_name: PropTypes.string.isRequired,
      reward_points: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default TotalRewards;