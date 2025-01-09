/**
 * Sorts data based on the provided sort configuration.
 *
 * @param {Array} data - The data to be sorted.
 * @param {Object} sortConfig - The configuration for sorting.
 * @param {string} sortConfig.key - The key to sort by.
 * @param {string} sortConfig.direction - The direction of sorting ('ascending' or 'descending').
 * @returns {Array} The sorted data.
 */

export const sortData = (data, sortConfig) => {
    let sortableData = [...data];
    if (sortConfig.key !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  };
  
  /**
 * Filters data based on the provided filter string.
 *
 * @param {Array} data - The data to be filtered.
 * @param {string} filter - The filter string.
 * @returns {Array} The filtered data.
 */

  export const filterData = (data, filter) => {
    return data.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(filter.toLowerCase())
      )
    );
  };
  
  /**
 * Paginates data based on the current page and items per page.
 *
 * @param {Array} data - The data to be paginated.
 * @param {number} currentPage - The current page number.
 * @param {number} itemsPerPage - The number of items per page.
 * @returns {Object} An object containing the current items and total pages.
 */

  export const paginateData = (data, currentPage, itemsPerPage) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);
    return { currentItems, totalPages };
  };