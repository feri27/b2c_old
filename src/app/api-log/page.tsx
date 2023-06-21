'use client';

import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { retrieveApiLogs } from '@/services/common/apiLog';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

type SavedRequest = {
  url: string;
  method: string;
  response: any;
};

export default function ApiLog() {
  // const [urlRes, setUrlRes] = useState<Array<SavedRequest>>([]);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');

  const apiLogsQry = useQuery({
    queryKey: ['apiLogs'],
    queryFn: retrieveApiLogs,
    refetchOnWindowFocus: false,
  });

  console.log(apiLogsQry.isLoading);

  const itemsPerPage = 10; // Number of items per page
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRequests = apiLogsQry.data?.data.slice(startIndex, endIndex);

  const debouncedValue = useDebouncedValue(searchInput);

  const filteredRequests = paginatedRequests?.filter((val) =>
    val.api_name.includes(debouncedValue)
  );

  // useEffect(() => {
  //   const data = localStorage.getItem('urlres')!;
  //   if (data) {
  //     setUrlRes(JSON.parse(data));
  //   }
  // }, []);

  if (apiLogsQry.isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4 max-w-5xl overflow-hidden mx-auto flex flex-col gap-5">
      {apiLogsQry.data && apiLogsQry.data.data.length > 0 ? (
        <>
          <div className="flex justify-center w-full">
            <input
              type="text"
              placeholder="search url"
              className="p-2 rounded md:w-2/3"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          {filteredRequests?.map((savedRequest, index) => (
            <div
              key={index}
              className="mb-8 border-b border-b-black border-b-solid"
            >
              <div className="mb-4 space-x-1">
                <span className="font-bold">Endpoint:</span>{' '}
                <span className="text-blue-500">{savedRequest.api_name}</span>
              </div>
              <div className="mb-4 space-x-1">
                <span className="font-bold">Page:</span>{' '}
                <span className="text-blue-500">{savedRequest.page}</span>
              </div>
              <div className="mb-4 space-x-1">
                <span className="font-bold">Log DT:</span>{' '}
                <span className="text-blue-500">
                  {savedRequest.log_dt.toString()}
                </span>
              </div>
              <div className="mb-4">
                <span className="font-bold">Request Body:</span>{' '}
                <ReactMarkdown
                  className="rounded bg-gray-100 p-4"
                  components={{
                    code: ({ children }) => (
                      <code className="block bg-gray-200 p-2 rounded">
                        {children}
                      </code>
                    ),
                  }}
                >
                  {JSON.stringify(savedRequest.request, null, 2)}
                </ReactMarkdown>
              </div>
              <div className="mb-4">
                <span className="font-bold">Response Body:</span>{' '}
                <ReactMarkdown
                  className="rounded bg-gray-100 p-4"
                  components={{
                    code: ({ children }) => (
                      <code className="block bg-gray-200 p-2 rounded">
                        {children}
                      </code>
                    ),
                  }}
                >
                  {JSON.stringify(savedRequest.response, null, 2)}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          <div className="flex justify-center">
            <button
              className="mr-2 px-4 py-2 bg-blue-500 text-white rounded"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous Page
            </button>
            <button
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
              disabled={endIndex >= apiLogsQry.data.data.length}
              onClick={() => setPage(page + 1)}
            >
              Next Page
            </button>
          </div>
        </>
      ) : (
        <div className="w-full h-screen flex justify-center items-center">
          Looks like there&apos;s no log
        </div>
      )}
    </div>
  );
}