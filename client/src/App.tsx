import React, { useEffect, useState } from 'react';
import './App.css'; // Import the CSS file
import { MdDelete } from 'react-icons/md';
import { FaPen } from 'react-icons/fa';
import axios from 'axios';
import ChuY from './components/ChuY';

interface Work {
  name: string;
  id: number;
  checked: boolean;
}

export default function App() {
  const [list, setList] = useState<Work[]>([]);
  const [newWorkName, setNewWorkName] = useState<string>("");
  const [filter, setFilter] = useState<string>("Tất cả");
  const [showChuY, setShowChuY] = useState<boolean>(false);
  const [workToDelete, setWorkToDelete] = useState<number | null>(null);

  useEffect(() => {
    axios.get("http://localhost:8080/list")
      .then(response => setList(response.data));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewWorkName(e.target.value);
  };

  const getNextId = () => {
    const ids = list.map(work => work.id);
    return ids.length > 0 ? Math.max(...ids) + 1 : 0;
  };

  const addWork = () => {
    if (!newWorkName.trim()) return;

    const newWork: Work = {
      name: newWorkName,
      id: getNextId(),
      checked: false,
    };
    axios.post("http://localhost:8080/list", newWork)
      .then(() => setList([...list, newWork]));
    setNewWorkName("");
  };

  const deleteWork = () => {
    if (workToDelete === null) return;
    
    axios.delete(`http://localhost:8080/list/${workToDelete}`)
      .then(() => {
        setList(list.filter(work => work.id !== workToDelete));
        setShowChuY(false);
      });
  };

  const toggleCheck = (id: number) => {
    const updatedList = list.map(work => {
      if (work.id === id) {
        const updatedWork = { ...work, checked: !work.checked };
        axios.put(`http://localhost:8080/list/${id}`, updatedWork);
        return updatedWork;
      }
      return work;
    });
    setList(updatedList);
  };

  const clearAllTasks = () => {
    axios.delete("http://localhost:8080/list")
      .then(() => setList([]));
  };

  const completeAllTasks = () => {
    const updatedList = list.map(work => {
      const updatedWork = { ...work, checked: true };
      axios.put(`http://localhost:8080/list/${work.id}`, updatedWork);
      return updatedWork;
    });
    setList(updatedList);
  };

  const filteredList = list.filter(work => {
    if (filter === "Đã hoàn thành") return work.checked;
    if (filter === "Đang làm") return !work.checked;
    return true;
  });

  const confirmDelete = (id: number) => {
    setWorkToDelete(id);
    setShowChuY(true);
  };

  const handleChuYClose = () => {
    setShowChuY(false);
    setWorkToDelete(null);
  };

  return (
    <div>
      {showChuY && workToDelete !== null && (
        <ChuY chuy3={handleChuYClose} delete={deleteWork} />
      )}
      <div className="container">
        <h3 className="title">Quản lý công việc</h3>
        <div className="input-container">
          <input
            onChange={handleInputChange}
            value={newWorkName}
            id="input"
            className="input"
            type="text"
            placeholder="Nhập tên công việc"
          />
          <button onClick={addWork} className="add-button">Thêm công việc</button>
        </div>
        <br />
        <div className="filter-container">
          <button className="filter-button" onClick={() => setFilter("Tất cả")}>Tất cả</button>
          <button className="filter-button" onClick={() => setFilter("Đã hoàn thành")}>Đã hoàn thành</button>
          <button className="filter-button" onClick={() => setFilter("Đang làm")}>Đang làm</button>
        </div>
        <br />
        <div className="task-list">
          {filteredList.map(item => (
            <div key={item.id} className="task-item">
              <input
                type="checkbox"
                className="task-checkbox"
                checked={item.checked}
                onChange={() => toggleCheck(item.id)}
              />
              <span className="task-name">{item.name}</span>
              <div className="task-actions">
                <MdDelete className="task-icon" onClick={() => confirmDelete(item.id)} />
                <FaPen className="task-icon" />
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: 20 }}>
          <button className="add-button2" onClick={clearAllTasks}>Xóa tất cả công việc</button>
          <button className="add-button2" onClick={completeAllTasks}>Hoàn thành tất cả</button>
        </div>
      </div>
    </div>
  );
}
