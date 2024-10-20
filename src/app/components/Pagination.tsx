import { Employee, Reward } from "@prisma/client";

const Pagination = ({
  data,
  itemsPerPage,
  currentPage,
  setItemsPerPage,
  setCurrentPage,
}: {
  data: Array<Employee> | Array<Reward> | Array<unknown>;
  itemsPerPage: number;
  currentPage: number;
  setItemsPerPage: (items: number) => void;
  setCurrentPage: (page: number) => void;
}) => {
  const totalEmployees = data.length;
  const totalPages = Math.ceil(totalEmployees / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalEmployees);

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return totalEmployees === 0 ? null : (
    <div className="flex justify-between items-center mt-4 text-grey">
      <div className="flex items-center">
        <span className="mr-2">Showing</span>
        <select
          className="bg-white dark:bg-gray-800 border appearance-none border-grey text-[#16151C] dark:text-white rounded-[5px] px-2 py-1"
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
        >
          <option value={1}>1</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </div>
      <div className="text-grey whitespace-nowrap md:flex hidden">
        {`Showing ${startIndex} to ${endIndex} out of ${totalEmployees} records`}
      </div>
      <div className="flex items-center">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`text-[#16151C] dark:text-white px-3 py-1 rounded-full mr-2 ${
              currentPage === index + 1 ? "bg-primary text-white" : "border"
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Pagination;
