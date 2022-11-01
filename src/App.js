import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
  const list = localStorage.getItem("list");
  if (list) {
    return JSON.parse(list);
  } else {
    return [];
  }
};

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    msg: "",
    type: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, "Please Enter Value", "danger");
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editId) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      // setName("");
      setEditId(null);
      setIsEditing(false);
      showAlert(true, "Value Changed", "success");
    } else {
      showAlert(true, "Item added to the lsit", "success");
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]); // keeps in an array
      setName("");
    }
  };

  const showAlert = (show = "false", msg = "", type = "") => {
    setAlert({ show: show, msg: msg, type: type });
  };

  const clearList = () => {
    showAlert(true, "Empty List", "danger");
    setList([]);
  };

  const removeItem = (id) => {
    setAlert({ show: true, msg: "Item Removed", type: "danger" });
    setList(list.filter((item) => id !== item.id));
  };

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditId(id);
    setName(specificItem.title);
  };

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  return (
    <div className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        {/*if alert show is true show the alert*/}
        {/* {...alert} passing all the properties of alert*/}
        <h3>Bazar Bag</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="Kichu Likhun"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            {isEditing ? "edit" : "submit"}
          </button>
        </div>
      </form>

      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
