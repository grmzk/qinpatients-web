import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { setEditorTabHeadState, headAreas, makeAreaState, headAreaInitialState } from "../model/editorSlice";
import { AreaTitleName, BodyPartState } from "../model/EditorTabTypes";

import BodyPart from "./BodyPart";

type HeadProps = {
  id: string;
};

function Head({ id }: HeadProps) {
  console.log("RENDER HEAD");

  const state = useAppSelector((state) => state.editor.editorTabs[id]?.state.head);

  if (!state) {
    throw "Tab with id=" + id + " not found!";
  }

  const dispatch = useAppDispatch();

  const setState = (newState: BodyPartState) => {
    dispatch(setEditorTabHeadState({ id, state: newState }));
  };

  return (
    <BodyPart
      state={state}
      setState={setState}
      areas={headAreas}
      makeAreaState={(newAreaTitleName: AreaTitleName) => makeAreaState(headAreaInitialState, newAreaTitleName)}
    />
  );
}

export default Head;
