"use client";
import CircleButton from "../components/circleButton";
import { FaList } from "react-icons/fa";
import Modal from "../components/modal.js";
import { useState } from "react";

export default function KeepersClient({ keepers }) {
  const [isOpen, setIsOpen] = useState(false);
  function splitPick(pick) {
    if (!pick) return { number: "", name: "" };
    const match = pick.match(/^(\d+)\s*[-.)]?\s*(.*)$/);
    return {
      number: match?.[1] ?? "",
      name: match?.[2] ?? pick,
    };
  }
  const keeperStyle = `border-b-2 border-gray-700 w-full text-center bg-white p-2`;
  return (
    <>
      {keepers.map((k) => {
        const pick1 = splitPick(k.pick1);
        const pick2 = splitPick(k.pick2);
        const pick3 = splitPick(k.pick3);
        const pick4 = splitPick(k.pick4);
        const pick5 = splitPick(k.pick5);
        const pick6 = splitPick(k.pick6);

        return (
          <div key={k.id} className="w-full p-2 h-[calc(100vh - 3rem)]">
            <div>
              <div className=" bg-white p-3 flex justify-center border-b-2 border-black">
                <h1 className="text-black font-bold text-2xl">{k.team_name}</h1>
              </div>
              <div className=" bg-gray-700 flex flex-col justify-center items-center">
                <p className={keeperStyle}>
                  <strong>({pick1.number}) </strong>
                  {pick1.name}
                </p>
                <p className={keeperStyle}>
                  <strong>({pick2.number}) </strong>
                  {pick2.name}
                </p>
                <p className={keeperStyle}>
                  <strong>({pick3.number}) </strong>
                  {pick3.name}
                </p>
                <p className={keeperStyle}>
                  <strong>({pick4.number}) </strong>
                  {pick4.name}
                </p>
                <p className={keeperStyle}>
                  <strong>({pick5.number})</strong> {pick5.name}
                </p>
                <p className={keeperStyle}>
                  <strong>({pick6.number})</strong> {pick6.name}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      <div className="w-fit h-fit absolute top-24 right-6">
        <CircleButton onClick={() => setIsOpen(!isOpen)}>
          {<FaList />}
        </CircleButton>
      </div>
      {isOpen && (
        <Modal>
          <ol className="list-decimal">
            {keepers.map((k) => (
              <li key={k.id} className="m-3 p-1 border-b-2 border-gray-500">
                {k.team_name}
              </li>
            ))}
          </ol>
        </Modal>
      )}
    </>
  );
}
