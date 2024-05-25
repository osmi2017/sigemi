import React from 'react';

const CreateUserButton = ({ onClick, label }) => {
  return (
    <button onClick={onClick} className="button btn-create ">
      {label}
    </button>
  );
};

export default CreateUserButton;
