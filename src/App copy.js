import React, { useState, useEffect } from 'react';
import './App.css';
import { useForm } from './Form/Form';

const Form = () => {

  const { errors, register, handleOnChange, handleSubmit } = useForm();
  const onSubmit = (values) => { console.log(values); }
  console.log(errors);
  
  return (
    <form onSubmit={(e) => handleSubmit(onSubmit, e)}>
      <div>
        <input
          type="text"
          name="email"
          defaultValue="admin"
          onChange={(e) => { handleOnChange(e) }}
          ref={
            register.bind(this, {
              validations: {
                required: { message: "Email-id is Required" },
                pattern: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid Email-Id" }
              }
            })
          }
        />
        {errors && errors.email}
        <input
          type="password"
          name="password"
          onChange={(e) => { handleOnChange(e) }}
          ref={register.bind(this,
            {
              validations: {
                required: { message: "Password is Required" }
              }
            })}
        />
      </div>


      {errors && errors.password}

      <button type="submit">Submit</button>
    </form>
  );
};


function App() {
  return (
    <Form />
  );
}

export default App;
