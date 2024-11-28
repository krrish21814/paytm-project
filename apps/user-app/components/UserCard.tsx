"use client"
import {useState} from "react";
export const UserCard = (
    {name,
    password,
    id,
    onUpdate}: {
        name: string
        password: string
        id : number
        onUpdate: (id: number, updates: {name?: string; password? : string} ) =>Promise<void>;
    }) => {
        const [inputName, setInputName] = useState("");
        const [inputPassword, setInputPassword] = useState("");
        const [loadingName, setLoadingName] = useState(false);
        const [loadingPassword, setLoadingPassword] = useState(false);
        const [success, setSuccess] = useState(false);
        const [passwordError, setPasswordError] = useState(false);
        const [nameError, setNameError] = useState(false);

        const handleUpdate = async (field: "name" | "password") => {
            setSuccess(false)
            if (field === "name") {
                setLoadingName(true);
            } else {
                setLoadingPassword(true);
            }
            if(field === "name" && inputName.length < 1){
                setNameError(true);
                setLoadingName(false);
                return;
            }
            if(field === "password" && inputPassword.length < 6){
                setPasswordError(true)
                setLoadingPassword(false);
                return;
            }
                const updates : {name?: string, password?: string} = {};
               
                if(field === "name") updates.name = inputName;
                if(field === "password") updates.password = inputPassword
               
                await onUpdate(Number(id), updates);
              
                setLoadingName(false)
                setLoadingPassword(false)
                setNameError(false);
                setPasswordError(false);
            
                setSuccess(true)    
        }

        return (
            <div className="flex flex-col gap-4 -mb-6 rounded-lg pl-16 p-1">
                <div className="text-lg font-bold">
                    Update User Information
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        onChange={(e) =>{
                            const value = e.target.value 
                            setInputName(e.target.value);
                            setSuccess(false)
                            if (value.length >= 1) {
                                setNameError(false);
                             }
                          }}
                          placeholder="Enter new name"
                          className="p-2 border rounded">
                        </input>
                    <button
                        onClick={() => handleUpdate("name")}
                        disabled={loadingName}
                        className={`p-2 w-40 rounded bg-blue-500 text-white ${
                            loadingName ? "opacity-50 cursor-not-allowed" : ""}`}>
                        {loadingName ? "Updating..." : "Update Name"}
                    </button>
                </div>
                  <div className="relative flex flex-col gap-2">
                      <div className=" flex items-center gap-2">
                       <input
                        type="password"
                        onChange={(e) => {
                            const value = e.target.value
                            setInputPassword(e.target.value);
                            setSuccess(false) 
                            if (value.length >= 6) {
                                setPasswordError(false);
                            }
                        }}
                        placeholder="Enter new password"
                        className="p-2 border rounded">
                        </input>
                    <button
                        onClick={() => handleUpdate("password")}
                        disabled={loadingPassword}
                        className={`p-2 w-40 rounded bg-green-500 text-white ${
                            loadingPassword ? "opacity-50 cursor-not-allowed" : ""}`}>
                        {loadingPassword ? "Updating..." : "Update Password"}
                    </button>
                </div>

                <div className="relative h-5 mt-1">
                {passwordError && (
                    <div className="absolute text-red-500 text-sm -mt-1">
                        Password must be at least 6 characters
                    </div>
                )}
                </div>

                <div className="relative h-5 mt-1">
                {nameError && (
                    <div className="absolute text-red-500 text-sm -mt-2">
                       Name field cannot be empty
                    </div>
                )}
                </div>
               
                <div className="relative h-5 ">
                {success && (
                    <div className="absolute text-green-600 text-sm -mt-16">
                        Update successful!
                    </div>
                    )}
                </div>
                
          </div>
    </div>
  );
};