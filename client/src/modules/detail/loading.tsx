import { memo } from "react";

function DetailLoading() {
  return (
    <section className="flex-1 mt-12 px-4 py-6">
      <div className="flex justify-center items-center h-full">
        <p>Loading work order details...</p>
      </div>
    </section>
  );
}

export default memo(DetailLoading);
