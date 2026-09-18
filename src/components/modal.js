export default function Modal({ children, width }) {
  return (
    <div className="bg-white w-{} p-5 shadow-lg h-fit fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl flex flex-col justify-center items-center">
      {children}
    </div>
  );
}
