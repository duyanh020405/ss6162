import React from 'react';
import { GoAlert } from "react-icons/go";

interface Props {
  chuy3: () => void;
  delete: () => void;
}

export default function ChuY(props: Props) {
  return (
    <div style={{ border: "1px solid black", position: "relative", width: 400, height: 200, backgroundColor: "black", padding: 20 }}>
      <button onClick={props.chuy3} style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none", color: "white", fontSize: 20 }}>X</button>
      <div style={{ display: "flex", flexDirection: "row", gap: 30, alignItems: "center" }}>
        <GoAlert style={{ fontSize: 80, color: "red" }} />
        <h2 style={{ color: "white" }}>Bạn có muốn xóa thông tin này không?</h2>
      </div>
      <button style={{ backgroundColor: "red", color: "white", position: "absolute", bottom: 10, right: 10, padding: "10px 20px", border: "none", borderRadius: 5 }} onClick={props.delete}>Xóa</button>
    </div>
  );
}
