import React, { useState, useEffect } from "react";
import { useStore, actions } from "../../contextApi";
export const GroupDash = () => {
  document.body.style.overflow = "hidden";

  const [state, dispatch] = useStore(useStore);

  useEffect(() => {
    dispatch(actions.setSearchQuey("Group"));
  }, []);

  return <div>GroupDash</div>;
};
