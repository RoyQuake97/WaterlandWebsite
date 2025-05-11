import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Search, MoreHorizontal, ChevronDown, Filter, Download } from "lucide-react";

type ColumnDef<T> = {
  id: string;
  header: string;
  accessorKey: keyof T | ((row: T) => any);
  cell?: (info: { row: T }) => React.ReactNode;
  enableSorting?: boolean;
};

interface EnhancedTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  initialSearchKey?: keyof T;
  searchKeys?: Array<keyof T>;
  pagination?: boolean;
  pageSize?: number;
  actions?: Array<{
    label: string;
    onClick: (selectedRows: T[]) => void;
    icon?: React.ReactNode;
  }>;
  onRowClick?: (row: T) => void;
  className?: string;
  emptyStateMessage?: string;
}

export function EnhancedTable<T extends { id: number | string }>({
  data,
  columns,
  isLoading = false,
  searchable = true,
  searchPlaceholder = "Search...",
  initialSearchKey,
  searchKeys = [],
  pagination = true,
  pageSize = 10,
  actions = [],
  onRowClick,
  className,
  emptyStateMessage = "No data found"
}: EnhancedTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<T["id"]>>(new Set());
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filter the data based on search term
  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(row => {
      // If search keys are provided, only search in those fields
      if (searchKeys.length > 0) {
        return searchKeys.some(key => {
          const value = typeof key === "function" 
            ? key(row) 
            : row[key as keyof T];
          
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        });
      }
      
      // Otherwise search in all fields
      return Object.values(row).some(
        value => 
          value !== null && 
          value !== undefined && 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [data, searchTerm, searchKeys]);

  // Sort the data based on column
  const sortedData = React.useMemo(() => {
    if (!sortColumn) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const column = columns.find(col => col.id === sortColumn);
      if (!column) return 0;
      
      const aValue = typeof column.accessorKey === "function" 
        ? column.accessorKey(a) 
        : a[column.accessorKey as keyof T];
        
      const bValue = typeof column.accessorKey === "function"
        ? column.accessorKey(b)
        : b[column.accessorKey as keyof T];
      
      if (aValue === bValue) return 0;
      
      // Handle different types appropriately
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortDirection === "asc"
        ? aValue > bValue ? 1 : -1
        : aValue > bValue ? -1 : 1;
    });
  }, [filteredData, sortColumn, sortDirection, columns]);

  // Paginate the data
  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  // Total pages for pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Toggle row selection
  const toggleRowSelection = (id: T["id"]) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedRows(newSelection);
  };

  // Toggle all rows selection
  const toggleAllRows = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map(row => row.id)));
    }
  };

  // Handle sort
  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
  };

  // Selected rows as array
  const selectedRowsArray = React.useMemo(() => {
    return paginatedData.filter(row => selectedRows.has(row.id));
  }, [paginatedData, selectedRows]);

  return (
    <Card className={className}>
      {/* Header with search and actions */}
      {(searchable || actions.length > 0) && (
        <CardHeader className="p-4 pb-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {searchable && (
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full"
                />
              </div>
            )}
            
            {actions.length > 0 && (
              <div className="flex items-center gap-2">
                {selectedRows.size > 0 && (
                  <Badge variant="outline" className="mr-2">
                    {selectedRows.size} selected
                  </Badge>
                )}
                
                {actions.map((action, index) => (
                  <Button 
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => action.onClick(selectedRowsArray)}
                    disabled={action.label !== "Add New" && selectedRows.size === 0}
                    className="flex items-center gap-1"
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </CardHeader>
      )}
      
      {/* Table content */}
      <CardContent className="p-0 overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <LoadingSpinner size="md" />
          </div>
        ) : sortedData.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            {emptyStateMessage}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b bg-[#F9FAFB]">
                {actions.length > 0 && (
                  <th className="py-3 px-4 text-left w-10">
                    <Checkbox 
                      checked={selectedRows.size > 0 && selectedRows.size === paginatedData.length}
                      onCheckedChange={toggleAllRows}
                      aria-label="Select all rows"
                    />
                  </th>
                )}
                
                {columns.map((column) => (
                  <th 
                    key={column.id}
                    className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.enableSorting !== false ? (
                      <button
                        className="flex items-center gap-1 font-medium"
                        onClick={() => handleSort(column.id)}
                      >
                        {column.header}
                        {sortColumn === column.id && (
                          <span className="text-[#1e3a8a]">
                            {sortDirection === "asc" ? " ↑" : " ↓"}
                          </span>
                        )}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <tr 
                  key={row.id}
                  className={`
                    border-b hover:bg-gray-50 transition-colors
                    ${onRowClick ? 'cursor-pointer' : ''}
                    ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'}
                  `}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {actions.length > 0 && (
                    <td className="py-3 px-4 text-left" onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={selectedRows.has(row.id)}
                        onCheckedChange={() => toggleRowSelection(row.id)}
                        aria-label={`Select row ${row.id}`}
                      />
                    </td>
                  )}
                  
                  {columns.map((column) => (
                    <td key={column.id} className="py-3 px-4 text-sm text-gray-700">
                      {column.cell 
                        ? column.cell({ row }) 
                        : typeof column.accessorKey === "function"
                          ? column.accessorKey(row)
                          : String(row[column.accessorKey as keyof T] || '-')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
      
      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <CardFooter className="p-4 border-t flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
          </div>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Display page numbers near current page
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                
                return (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNumber)}
                      isActive={currentPage === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      )}
    </Card>
  );
}