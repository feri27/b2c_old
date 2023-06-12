'use client';

import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import React, { useEffect, useState } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

type SavedRequest = {
  url: string;
  method: string;
  response: any;
};

export default function ReqRes() {
  const [urlRes, setUrlRes] = useState<Array<SavedRequest>>([]);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');

  const itemsPerPage = 10; // Number of items per page
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRequests = urlRes.slice(startIndex, endIndex);

  const debouncedValue = useDebouncedValue(searchInput);

  const filteredRequests = paginatedRequests.filter((val) =>
    val.url.includes(debouncedValue)
  );

  useEffect(() => {
    const data = localStorage.getItem('urlres')!;
    if (data) {
      setUrlRes(JSON.parse(data));
    }
  }, []);

  return (
    <div className="p-4 max-w-5xl overflow-hidden mx-auto flex flex-col gap-5">
      <div className="flex justify-center w-full">
        <input
          type="text"
          placeholder="search url"
          className="p-2 rounded md:w-2/3"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      {urlRes.length > 0 ? (
        <>
          {filteredRequests.map((savedRequest, index) => (
            <div
              key={index}
              className="mb-8 border-b border-b-black border-b-solid"
            >
              <div className="mb-4 space-x-1">
                <span className="font-bold">Request Endpoint:</span>{' '}
                <span className="text-blue-500">{savedRequest.url}</span>
              </div>
              <div className="mb-4 space-x-1">
                <span className="font-bold">Request Method:</span>{' '}
                <span className="text-blue-500">{savedRequest.method}</span>
              </div>
              <div className="mb-4">
                <span className="font-bold">Response:</span>{' '}
                <ReactMarkdown
                  className="rounded bg-gray-100 p-4"
                  children={JSON.stringify(savedRequest.response, null, 2)}
                  components={{
                    code: ({ children }) => (
                      <code className="block bg-gray-200 p-2 rounded">
                        {children}
                      </code>
                    ),
                  }}
                />
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
              disabled={endIndex >= urlRes.length}
              onClick={() => setPage(page + 1)}
            >
              Next Page
            </button>
          </div>
        </>
      ) : (
        <div>No saved requests.</div>
      )}
    </div>
  );
}
