import * as React from "react";
import { Dialog } from "@material-ui/core";
import { apiCall } from "@/utils/api-utils/api-helper";
import { NextPage } from "next";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
interface Props {
  open: boolean;
  handleClose: () => void;
  callId: string;
}
const CallDetails: NextPage<Props> = ({ open, handleClose, callId }) => {
  const [call, setCall] = React.useState<Call>({
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
  });
  const [loading, setLoading] = React.useState(true);
  const [note, setNote] = React.useState("");
  const [addNoteLoading, setAddNoteLoading] = React.useState(false);
  React.useEffect(() => {
    getCall();
  }, []);

  const getCall = async () => {
    try {
      const getCallResponse = await apiCall(`/calls/${callId}`, "GET");
      setCall(getCallResponse);
      setLoading(false);
    } catch (err) {
      console.log("🚀 ~ file: CallDetails.tsx:31 ~ getCall ~ err:", err);
    }
  };
  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes} m ${seconds} s`;
  };

  const addNote = async () => {
    try {
      setAddNoteLoading(true);
      const addNoteresponse = await apiCall(`/calls/${callId}/note`, "POST", {
        content: note,
      });
      setCall(addNoteresponse);
      setAddNoteLoading(false);
      handleClose();
    } catch (err) {
      console.log("🚀 ~ file: CallDetails.tsx:31 ~ getCall ~ err:", err);
      setAddNoteLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center">
      <Dialog open={open} onClose={handleClose}>
        <div className="w-[500px] h-[385px]">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center border-b-[1px]">
                <div className="flex flex-col justify-start items-start p-3 px-5 border-gray-400">
                  <span>Add Notes</span>
                  <span className="text-purple-700">Call ID {call.id}</span>
                </div>
              </div>
              <div className="p-3 px-5">
                <div className="flex justify-between items-center w-[200px]">
                  <span className="font-bold">Call Type</span>
                  <span className="text-purple-700">{call.call_type}</span>
                </div>
                <div className="flex justify-between items-center w-[200px]">
                  <span className="font-bold">Duration</span>
                  <span>{formatDuration(call.duration)}</span>
                </div>
                <div className="flex justify-between items-center w-[200px]">
                  <span className="font-bold">From</span>
                  <span>{call.from}</span>
                </div>
                <div className="flex justify-between items-center w-[200px]">
                  <span className="font-bold">To</span>
                  <span>{call.to}</span>
                </div>
                <div className="flex justify-between items-center w-[200px]">
                  <span className="font-bold">Via</span>
                  <span>{call.via}</span>
                </div>
                <div className="mt-3 flex flex-col">
                  <span>Notes:</span>
                  <textarea
                    onChange={(e) => setNote(e.target.value)}
                    className="border-2 mt-2 p-2"
                  ></textarea>
                </div>
                <button
                  onClick={() => addNote()}
                  className="bg-purple-700 w-full rounded-lg px-4 py-2 mt-3 text-white"
                >
                  {addNoteLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default CallDetails;
