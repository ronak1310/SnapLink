import React, { useState } from 'react';
import './InputBox.css'; // <-- Apne page ki CSS file ka naam likho (agar banayi hai toh)

function InputBox() {
  
  // 🧠 1. LOGIC AREA: Saare useState aur functions yahan rahenge
  // Example: const [input, setInput] = useState("");
    const[liveInput,setliveInput]=useState("");
    const[finalout,setfinalout]=useState("");
    const handleButtonclick=async()=>{
        if(liveInput===""){
            alert("Write an URL");
            return;
        }
        try{
          const response=await fetch("http://localhost:5000/api/shorten",{
            method:"POST",
            headers:{
              "Content-Type": "application/json",
            },
            body:JSON.stringify({ longurl: liveInput }), // Aapka wala naam
          });
          const data=await response.json();
          if(data.success){
            setfinalout(data.output); // Aapka wala naam
            console.log("original url : ",data.original_url);
          }else{
            alert("error:"+data.error);
          }
        }
        catch(error){
          console.error("connection failed:",error);
          alert("Backend not working!");
        }
    };
  
  
  // 🎨 2. UI AREA: Screen par jo dikhana hai woh return() ke andar aayega
  return (
    <div className="Input-Page">
      <div className="neon-rotating-box">
        <div className="box-inner-content">
        <label htmlFor="URLinput">URL:</label>
        <input type="text" placeholder='Paste your URL' value={liveInput} onChange={(e)=>setliveInput(e.target.value)} />
        <button onClick={handleButtonclick}>Generate</button>
        {finalout && (
                <div>
                    <h3 htmlFor="Output">Output:{finalout}</h3>
                </div>
            )}
        </div>
      </div>

    </div>
  );
}

// 🔌 3. EXPORT: Isko export karna zaroori hai taaki App.jsx isko use kar sake
export default InputBox;