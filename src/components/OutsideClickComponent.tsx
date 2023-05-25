import React, { useRef, useEffect, RefObject } from "react";
import PropTypes from "prop-types";

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideHandler(ref: RefObject<HTMLDivElement>, action: Function) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        action()
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, action]);
}

interface OutsideAlerterProps {
    children: React.ReactNode;
    action: () => void;
}

function OutsideClick(props: OutsideAlerterProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideHandler(wrapperRef, props.action);

  return <div ref={wrapperRef}>{props.children}</div>;
}

export default OutsideClick;
