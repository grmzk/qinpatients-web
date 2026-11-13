import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { setEditorTabComplaintsState } from "../model/editorSlice";
import { TextareaExtendedState } from "../model/EditorTabTypes";

import TextareaExtended from "./TextareaExtended";

type CompalintsProps = {
  id: string;
};

function Complaints({ id }: CompalintsProps) {
  console.log("RENDER COMPLAINTS");

  const complaintsState = useAppSelector((state) => state.editor.editorTabs[id]?.state.complaints);

  if (!complaintsState) {
    throw "Tab with id=" + id + " not found!";
  }

  const dispatch = useAppDispatch();

  const setComplaintsState = (complaintsState: TextareaExtendedState) => {
    dispatch(setEditorTabComplaintsState({ id, state: complaintsState }));
  };

  return <TextareaExtended state={complaintsState} setState={setComplaintsState} />;
}

export default Complaints;
