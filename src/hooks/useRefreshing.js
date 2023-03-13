import * as React from "react";

export const useRefresh = (loading, onRefresh) => {
  const timer = useRef(null)
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    if (loading === false && refreshing === true) {
      setRefreshing(false);
    }
    return () => {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, [loading]);

  const onRefresh = () => {
    setRefreshing(true);
    timer.current = setTimeout(() => {
      onRefresh();
    }, 300);
  };

  return [refreshing, onRefresh];
}
