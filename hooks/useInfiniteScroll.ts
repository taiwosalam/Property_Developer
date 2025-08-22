import { useEffect, useRef, useState } from "react";

interface UseInfiniteScrollProps {
  callback: () => Promise<void>;
  hasMore: boolean;
}

export const useInfiniteScroll = ({
  callback,
  hasMore,
}: UseInfiniteScrollProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = (node: HTMLElement | null) => {
    if (isLoading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setIsLoading(true);
        await callback();
        setIsLoading(false);
      }
    });

    if (node) observer.current.observe(node);
  };

  return { isLoading, lastElementRef };
};
