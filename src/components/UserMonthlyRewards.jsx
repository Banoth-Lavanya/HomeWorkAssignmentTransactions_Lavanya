import React, { useState, useMemo } from 'react';
import '../App.css';
import { Sort } from '@mui/icons-material';
import { sortData, filterData, paginateData } from '../utils/SortFilterPagination';

const UserMonthlyRewards = ({ monthlyPoints }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  const sortedMonthlyPoints = useMemo(() => sortData(monthlyPoints, sortConfig), [monthlyPoints, sortConfig]);
  const filteredMonthlyPoints = useMemo(() => filterData(sortedMonthlyPoints, filter), [sortedMonthlyPoints, filter]);
  const { currentItems, totalPages } = useMemo(() => paginateData(filteredMonthlyPoints, currentPage, itemsPerPage), [filteredMonthlyPoints, currentPage, itemsPerPage]);

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
    <div className='DataTable'>
      <input
        type="text"
        placeholder="Filter"
        value={filter}
        className='FilterData'
        onChange={e => setFilter(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th><div className='thead-display'><span>Customer ID</span><span onClick={() => requestSort('customer_id')}><Sort/></span></div></th>
            <th><div className='thead-display'><span>Customer Name</span><span onClick={() => requestSort('name')}><Sort/></span></div></th>
            <th><div className='thead-display'>Year<span onClick={() => requestSort('year')}><Sort/></span></div></th>
            <th><div className='thead-display'>Month<span onClick={() => requestSort('month')}><Sort/></span></div></th>
            <th><div className='thead-display'>Reward Points<span onClick={() => requestSort('reward_points')}><Sort/></span></div></th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              <td>{item.customer_id}</td>
              <td>{item.name}</td>
              <td>{item.year}</td>
              <td>{item.month}</td>
              <td>{item.reward_points}</td>
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
export default UserMonthlyRewards;