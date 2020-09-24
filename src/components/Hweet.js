import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Hweet = ({ hweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newHweet, setNewHweet] = useState(hweetObj.text);
  const onDeleteClick = async () => {
    const isOk = window.confirm("Are you sure you want to delete this hweet?");
    if (isOk) {
      await dbService.doc(`hweets/${hweetObj.id}`).delete();
      await storageService.refFromURL(hweetObj.attachmentUrl).delete();
    }
  };
  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`hweets/${hweetObj.id}`).update({
      text: newHweet
    });
    setEditing(false);
  };
  const onChenge = (event) => {
    const {
      target: { value }
    } = event;
    setNewHweet(value);
  };
  return (
    <div className="hweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container hweetEdit">
            <input
              type="text"
              placeholder="Edit your hweet"
              value={newHweet}
              required
              onChange={onChenge}
              className="formInput"
            />
            <input type="submit" value="Update Hweet" className="formBtn" />
          </form>
          <button onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </button>{" "}
        </>
      ) : (
        <>
          <h4>{hweetObj.text}</h4>
          {hweetObj.attachmentUrl && (
            <img src={hweetObj.attachmentUrl} alt={hweetObj.text} />
          )}
          {isOwner && (
            <div className="hweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Hweet;
