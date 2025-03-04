import { useEffect, useState } from "react";

export default function useMount() {
  const [mount, setMount] = useState<boolean>(false);

  useEffect(() => {
    setMount(true);

    return () => setMount(false);
  }, []);

  return mount;
}
