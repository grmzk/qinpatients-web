import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { setEditorTabAnamnesisMorbiState } from "../model/editorSlice";
import { TextareaExtendedState } from "../model/EditorTabTypes";

import TextareaExtended from "./TextareaExtended";

type AnamnesisMorbiProps = {
  id: string;
};

function AnamnesisMorbi({ id }: AnamnesisMorbiProps) {
  console.log("RENDER ANAMNESIS MORBI");

  const anamnesisMorbiState = useAppSelector((state) => state.editor.editorTabs[id]?.state.anamnesisMorbi);

  if (!anamnesisMorbiState) {
    throw "Tab with id=" + id + " not found!";
  }

  const dispatch = useAppDispatch();

  const setAnamnesisMorbiState = (newState: TextareaExtendedState) => {
    dispatch(setEditorTabAnamnesisMorbiState({ id, state: newState }));
  };

  return <TextareaExtended state={anamnesisMorbiState} setState={setAnamnesisMorbiState} />;
}

export default AnamnesisMorbi;
