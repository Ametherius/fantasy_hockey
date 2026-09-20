"use client";

import Modal from "@/components/modal";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [registered, setRegistered] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [status, setStatus] = useState(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleCreateAccount() {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://fantasy-hockey-rho.vercel.app",
        data: {
          name: name,
          teamName: teamName,
        },
      },
    });
    if (error) {
      setStatus({
        type: "error",
        message: error.message || `There was an error creating your profile${error.status ? ` (${error.status})` : ""}.`,
      });
      return;
    }
    setEmail("");
    setPassword("");
    setName("");
    setTeamName("");
    setStatus({
      type: "success",
      message: "Profile created. Check your email to confirm, then log in.",
    });
  }

  async function handleLogin() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setStatus({
        type: "error",
        message: error.message || `There was an error logging in${error.status ? ` (${error.status})` : ""}.`,
      });
      return;
    }
    setStatus({
      type: "success",
      message: "Logged in successfully.",
    });
    setEmail("");
    setPassword("");
  }

  function closeStatus() {
    const wasSuccess = status?.type === "success";
    const wasLogin = registered;
    setStatus(null);
    if (!wasSuccess) return;
    if (wasLogin) {
      router.push("/");
      return;
    }
    setRegistered(true);
  }

  const formGroup = `m-2 my-auto p-1`;
  const inputClass = "border-2 border-black p-1 text-black block";
  return (
    <div className="bg-black w-screen h-screen flex justify-center items-center">
      {!registered && (
        <>
          <Modal>
            <div className="border-b-2 border-black m-2">
              <h1 className="text-center font-bold text-3xl">Create Profile</h1>
            </div>
            <div>
              <form>
                <div className={formGroup}>
                  <label>
                    Email
                    <input
                      type="email"
                      className={inputClass}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                </div>
                <div className={formGroup}>
                  <label className="flex flex-1 gap-30">
                    Password
                    <button
                      type="button"
                      className="cursor-pointer my-auto"
                      onClick={() => setShowPass(!showPass)}
                    >
                      {showPass ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </label>

                  <input
                    type={showPass ? "text" : "password"}
                    className={inputClass}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className={formGroup}>
                  <label>
                    Name
                    <input
                      type="text"
                      className={inputClass}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>
                </div>
                <div className={formGroup}>
                  <label>
                    Team Name
                    <input
                      type="text"
                      className={inputClass}
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                  </label>
                </div>
                <div className="flex justify-center m-2">
                  <button
                    type="button"
                    className="bg-black text-white p-2 m-1 hover:bg-white hover:border-2 hover:text-black"
                    onClick={handleCreateAccount}
                  >
                    Create Profile
                  </button>
                  <button
                    type="button"
                    className="bg-white text-black border-2 p-2 m-1 hover:bg-black hover:text-white"
                    onClick={() => setRegistered(true)}
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </Modal>
        </>
      )}
      {registered && (
        <>
          <Modal>
            <div className="text-3xl text-center font-bold border-b-2 border-black">
              <h1>Login</h1>
            </div>
            <div className="p-2">
              <form>
                <div className={formGroup}>
                  <label>
                    Email:
                    <input
                      type="email"
                      className={inputClass}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                </div>
                <div className={formGroup}>
                  <label className="flex flex-1 gap-30">
                    Password
                    <button
                      type="button"
                      className="cursor-pointer my-auto"
                      onClick={() => setShowPass(!showPass)}
                    >
                      {showPass ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </label>

                  <input
                    type={showPass ? "text" : "password"}
                    className={inputClass}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex justify-center m-2">
                  <button
                    type="button"
                    className="bg-black text-white p-2 hover:bg-white hover:border-2 hover:text-black"
                    onClick={handleLogin}
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </Modal>
        </>
      )}
      {status?.type === "success" && (
        <Modal>
          <p className="m-4 font-bold text-2xl text-center">{status.message}</p>
          <button
            type="button"
            className="bg-black text-white p-2 px-6 font-bold"
            onClick={closeStatus}
          >
            Close
          </button>
        </Modal>
      )}
      {status?.type === "error" && (
        <Modal>
          <p className="m-4 font-bold text-2xl text-center">{status.message}</p>
          <button
            type="button"
            className="bg-black text-white p-2 px-6 font-bold"
            onClick={() => setStatus(null)}
          >
            Close
          </button>
        </Modal>
      )}
    </div>
  );
}
