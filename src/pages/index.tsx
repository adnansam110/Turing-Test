import Image from "next/image";
import AppLayout from "@/components/app-layout/AppLayout";
import { NextPageWithLayout } from "./_app";
import { ReactElement, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  makeStyles,
} from "@material-ui/core";
import { mockCallData } from "@/constants/global-constants";
import CallDetails from "@/components/call-details/CallDetails";
import { apiCall } from "@/utils/api-utils/api-helper";
import { formatDate, formatDuration } from "@/utils/date-utils/date";
import DownArrow from '../assets/images/down-arrow.png'

const Home: NextPageWithLayout = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState("");
  const [calls, setCalls] = useState<Call[]>([
    {
      id: "", // "unique ID of call"
      direction: "", // "inbound" or "outbound" call
      from: "", // Caller's number
      to: "", // Callee's number
      duration: 0, // Duration of a call (in seconds)
      is_archived: false, // Boolean that indicates if the call is archived or not
      call_type: "", // The type of the call, it can be a missed, answered or voicemail.
      via: "", // Aircall number used for the call.
      created_at: "", // When the call has been made.
      notes: [], // Notes related to a given call
    },
  ]);
  const [totalCount, setTotalCount]: any = useState(0);
  const [selectedCallId, setSelectedCallId] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    getCalls();
  }, []);

  const getCalls = async () => {
    const getCallsResponse = await apiCall(
      `/calls?offset=${1}&limit=${10}`,
      "GET"
    );
    setCalls(getCallsResponse.nodes);
    setTotalCount(getCallsResponse.totalCount);
    setHasNextPage(getCallsResponse.hasNextPage);
    setLoading(false);
  };

  const handleChangePage = async (event: any, newPage: number) => {
    const getCallsResponse = await apiCall(
      `/calls?offset=${page}&limit=${10}`,
      "GET"
    );
    setCalls(getCallsResponse.nodes);
    setTotalCount(getCallsResponse.totalCount);
    setHasNextPage(getCallsResponse.hasNextPage);
    setPage(newPage);
  };

  const handleFilterChange = (event: any) => {
    setFilter(event.target.value);
  };

  const handleArchiveCall = async (callId: String, isArchived: boolean) => {
    try {
      const archiveResponse = await apiCall(`/calls/${callId}/archive`, "PUT");
      const updatedData = calls.map((call: any) => {
        if (call.id === archiveResponse.id) {
          return archiveResponse;
        }
        return call;
      });
      setCalls(updatedData);
    } catch (err) {
      console.log("🚀 ~ file: index.tsx:62 ~ handleArchiveCall ~ err:", err);
    }
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const onSelectCall = (callId: String) => {
    setSelectedCallId(callId as any);
  };

  const filteredRows = calls.filter((row: any) =>
    filter === "Archived"
      ? row.is_archived
      : filter === "Unarchived"
      ? !row.is_archived
      : row
  );
  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : (
        <>
          <div className="relative w-full lg:max-w-sm mx-4 pt-4 flex justify-start items-center">
            <span className="w-auto">Filter By: </span>
              <select
                onChange={handleFilterChange}
                className="w-auto text-purple-700 rounded-lg outline-none bg-transparent ml-2"
              >
                <option>Status</option>
                <option>Archived</option>
                <option>Unarchived</option>
              </select>
          </div>
          <div className="p-4">
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Call Type</TableCell>
                    <TableCell>Direction</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>From</TableCell>
                    <TableCell>To</TableCell>
                    <TableCell>Via</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Archived</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRows.map((call: any) => (
                    <TableRow key={call.id} hover>
                      <TableCell>{call.call_type}</TableCell>
                      <TableCell>
                        {call.direction === "inbound" ? "Inbound" : "Outbound"}
                      </TableCell>
                      <TableCell>{formatDuration(call.duration)}</TableCell>
                      <TableCell>{call.from}</TableCell>
                      <TableCell>{call.to}</TableCell>
                      <TableCell>{call.via}</TableCell>
                      <TableCell>{formatDate(call.created_at)}</TableCell>
                      <TableCell>
                        <button
                          onClick={() =>
                            handleArchiveCall(call.id, call.is_archived)
                          }
                        >
                          {call.is_archived ? "Archived" : "Unarchive"}
                        </button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={(e) => {
                            onSelectCall(call.id);
                            e.stopPropagation();
                            handleOpen();
                          }}
                        >
                          Add Note
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          {open && (
            <div>
              <CallDetails
                open={open}
                handleClose={handleClose}
                callId={selectedCallId}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default Home;
