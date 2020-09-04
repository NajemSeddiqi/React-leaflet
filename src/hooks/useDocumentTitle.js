import { useEffect } from "react";

export default function useDocumentTitle(title) {
  useEffect(() => {
    title ? (document.title = title) : (document.title = "Store Tracker");
  });
}
