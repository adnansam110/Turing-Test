import Image from "next/image";
import AppLayout from "@/components/app-layout/AppLayout";
import { NextPageWithLayout } from "./_app";
import { ReactElement, useState } from "react";
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
  TextField,
  makeStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { mockCallData } from "@/constants/global-constants";
const useStyles = makeStyles({});

const Home: NextPageWithLayout = () => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState("");
  const [calls, setCalls]: any = useState(mockCallData);
  const [totalCount, setTotalCount]: any = useState(0);
  const [selectedCallId, setSelectedCallId] = useState("");

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };
  const handleFilterChange = (event: any) => {
    setFilter(event.target.value);
  };
  const handleArchiveCall = async (callId: String, isArchived: boolean) => {};
  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const onSelectCall = (callId: String) => {
    console.log("Call id", callId);
    setSelectedCallId(callId as any);
  };
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  };
  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}m ${seconds}s (${duration}s)`;
  };
  const handleAddNote = async (callId: String) => {};
  const filteredRows = calls.filter((row: any) =>
    row.call_type.toLowerCase().includes(filter.toLowerCase())
  );
  return (
    <>
      <div className="relative w-full lg:max-w-sm mx-4 pt-4 flex justify-start items-center">
        <span className="w-[100px]">Filter By: </span>
        <select className="w-full p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600 flex justify-between">
          <option>All</option>
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
                <TableRow key={call.id} hover style={{ cursor: "pointer" }}>
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
                        e.stopPropagation();
                        handleAddNote(call.id);
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
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default Home;
