export default function Modal({ children }) {
  return (
    <div className="bg-white w-fit p-5 shadow-lg h-60 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl flex flex-col justify-center items-center">
      {children}
    </div>
  );
}
